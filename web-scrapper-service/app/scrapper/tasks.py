from concurrent.futures import ThreadPoolExecutor

from celery import shared_task
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from app.db import db
from app.scrapper.utils import is_sitemap, extract_urls_from_sitemap, scrape_website, process_result


@shared_task
def scrape_sitemaps(urls, request_id):
    request_id = request_id
    # db.insert_request(request_id, 'in_progress')
    all_scraped_text = ""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('start-maximized')
    chrome_options.add_argument('disable-infobars')
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = None

    try:
        # Initialize the Chrome driver
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        with ThreadPoolExecutor(max_workers=5) as executor:

            for url in urls:
                print(f"Processing {url}")
                if is_sitemap(url):
                    sitemap_urls = extract_urls_from_sitemap(url)
                    for sitemap_url in sitemap_urls:
                        print(f"Scraping {sitemap_url}")
                        # call the function to scrape the url
                        future = executor.submit(scrape_website, driver, sitemap_url, request_id)
                        future.add_done_callback(process_result)
                else:
                    # call the function to scrape the url
                    future = executor.submit(scrape_website, driver, url, request_id)
                    future.add_done_callback(process_result)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if driver is not None:
            driver.quit()
    # return all_scraped_text
    # check if all_scraped_text is not empty
    # if all_scraped_text:
    #     with open(f'{request_id}.txt', 'a') as f:
    #         f.write(all_scraped_text + "\n\n")
    db.update_request(request_id, 'complete')
    return {"message": "Scraping started.", "request_id": request_id}
