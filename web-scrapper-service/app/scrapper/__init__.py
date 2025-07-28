import asyncio
import uuid
from typing import List

import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, HTTPException, BackgroundTasks

from app.db import db
from app.scrapper.models import SitemapLink
from app.scrapper.tasks import scrape_sitemaps
from app.scrapper.utils import scrape_text, is_sitemap

router = APIRouter(
    prefix="/scrapper"
)


@router.post("/scrape-sitemap")
async def scrape_sitemap(sitemap_link: SitemapLink):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(sitemap_link.url)
            response.raise_for_status()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=str(exc))

        soup = BeautifulSoup(response.content, "html.parser")
        links = [loc.text for loc in soup.find_all("loc")]

        texts = await asyncio.gather(*(scrape_text(client, link) for link in links))
        return texts


@router.post("/scrape-sitemap_links")
async def scrape_sitemap(sitemap_link: SitemapLink):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(sitemap_link.url)
            response.raise_for_status()
        except httpx.RequestError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=str(exc))

        # if the url is not sitemape thatis end with .xml use some common sitemap directories like /sitemap.xml, /sitemap_index.xml, /sitemap_index.xml.gz, /wp-sitemap.xml,
        # /sitemap.xml.gz , /sitemap_index.xml.gz , /sitemap.xml.gz , /sitemap_index.xml.gz , /sitemap.xml.gz , /sitemap_index.xml.gz , /sitemap.xml.gz , /sitemap_index.xml.gz
        if not is_sitemap(sitemap_link.url):
            print("not sitemap")
            # remove the last / if present
            if sitemap_link.url.endswith("/"):
                sitemap_link.url = sitemap_link.url[:-1]
            common_sitemap_directories = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap_index.xml.gz",
                                          "/wp-sitemap.xml", "/sitemap.xml.gz", "/sitemap_index.xml.gz",
                                          "/sitemap.xml.gz", "/sitemap_index.xml.gz", "/sitemap.xml.gz",
                                          "/sitemap_index.xml.gz", "/sitemap.xml.gz", "/sitemap_index.xml.gz"]
            for common_sitemap_directory in common_sitemap_directories:
                # try:
                response = await client.get(sitemap_link.url + common_sitemap_directory)
                print(response.status_code)
                # if code is 301 or 302 then try to get the redirected url
                if response.status_code == 301 or response.status_code == 302:
                    print("redirected")
                    print(response.headers["location"])
                    # check if redirected url is complete or not
                    if response.headers["location"].startswith("http") or response.headers["location"].startswith(
                            "https"):
                        response = await client.get(response.headers["location"])
                    else:
                        response = await client.get(sitemap_link.url + response.headers["location"])
                    print(response.status_code)
                if response.status_code == 200:
                    break
            # except:
            #    pass

        soup = BeautifulSoup(response.content, "html.parser")
        links = [loc.text for loc in soup.find_all("loc")]

        if len(links) > 100:
            links = links

        if len(links) == 0:
            return {"links": [sitemap_link.url]}
        return {"links": links}


# aoi that will take a list of links and return the text from each link
@router.post("/scrape-links")
async def scrape_links(links: List[str]):
    async with httpx.AsyncClient() as client:
        texts = await asyncio.gather(*(scrape_text(client, link) for link in links))
        return texts


@router.post("/scrape-sitemaps")
async def scrape_sitemaps_background(background_tasks: BackgroundTasks, urls: List):
    request_id = str(uuid.uuid4())
    db.insert_request(request_id, 'in_progress')
    scrape_sitemaps.delay(urls, request_id)
    return {"message": "Scraping started in the background.", "request_id": request_id,
            "status_url": f"http://localhost:8000/get-status?request_id={request_id}"}


# function to get the status of a request
@router.get("/get-status")
def get_status(request_id: str):
    status = db.get_request_status(request_id)
    print("status", status)
    if status is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"status": status}


# function to get the text of a request
@router.get("/get-text")
def get_text(request_id: str):
    try:
        with open(f'{request_id}.txt', 'r') as f:
            text = f.read()
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"text": text}
