import asyncio
import re
import time
import xml.etree.ElementTree as ET

import httpx
import requests
from bs4 import BeautifulSoup


def is_sitemap(url):
    # check if url ends with .xml or .xml/
    if url.endswith(".xml") or url.endswith(".xml/"):
        return True

    return False


def extract_urls_from_sitemap(sitemap_url):
    response = requests.get(sitemap_url)
    urls = []
    if response.status_code == 200:
        root = ET.fromstring(response.content)
        for sitemap in root.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url'):
            loc = sitemap.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text
            urls.append(loc)
    return urls


async def scrape_text(client, url, depth=0, max_depth=2):
    if depth > max_depth:
        return {"url": url, "text": "", "urls": [], "error": "Max depth reached"}

    try:
        response = await client.get(url)
        response.raise_for_status()
    except (httpx.RequestError, httpx.HTTPStatusError):
        return {"url": url, "error": "Failed to fetch or invalid status code"}

    soup = BeautifulSoup(response.content, "html.parser")
    text = " ".join(soup.stripped_strings)

    # Find all URLs in the text
    urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)

    # Recursively scrape text from found URLs
    if urls and depth < max_depth:
        url_texts = await asyncio.gather(
            *(scrape_text(client, found_url, depth=depth + 1, max_depth=max_depth) for found_url in urls))
    else:
        url_texts = []

    return {"url": url, "text": text, "urls": url_texts, "error": None}


def scrape_website(driver, url, request_id):
    try:
        # Open the URL in a new tab if less than 3 tabs are open
        if len(driver.window_handles) < 3:
            driver.execute_script(f"window.open('');")  # Open a new tab
            driver.switch_to.window(driver.window_handles[-1])
            driver.get(url)
        else:
            # Switch to the oldest tab and load the new URL
            driver.switch_to.window(driver.window_handles[0])
            driver.get(url)

        # Wait for a few seconds to let JavaScript load
        time.sleep(5)

        # Extract the page's HTML
        page_html = driver.page_source

        # Parse the HTML with BeautifulSoup
        soup = BeautifulSoup(page_html, 'html.parser')
        return soup.get_text(), request_id

    except Exception as e:
        print(f"An error occurred while scraping {url}: {e}")
        return "", request_id


# function to process the result of the scrape_website function
def process_result(future):
    all_scraped_text = ""
    try:
        all_scraped_text, request_id = future.result()
    except Exception as e:
        print(f"An error occurred while processing the result: {e}")
    if all_scraped_text:
        print("writing to file")
        with open(f'{request_id}.txt', 'a') as f:
            f.write(all_scraped_text + "\n\n")
    # return all_scraped_text
