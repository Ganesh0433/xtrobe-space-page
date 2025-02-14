
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
from urllib.parse import urljoin
import time
import asyncio
import aiohttp
from flask_caching import Cache
from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from threading import Timer
from datetime import datetime, timedelta
import threading


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config['CACHE_TYPE'] = 'simple'
cache = Cache(app)

@app.route('/scrape', methods=['GET'])
def scrape_space_news():
    try:
        # Fetch the HTML content of the space.com website
        url = 'https://www.space.com'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract the content of the elements with class="feature-block-item-wrapper"
        all_articles = soup.find_all('div', class_='feature-block-item-wrapper')

        # Extract relevant data from each article
        articles_data = []
        for article in all_articles:
            try:
                title = article.find('span', class_='article-name').text.strip() if article.find('span', class_='article-name') else 'No Title'
                link = article.find('a', class_='article-link')['href'] if article.find('a', class_='article-link') else '#'
                description = article.find('span', class_='article-strapline').text.strip() if article.find('span', class_='article-strapline') else 'No Description'

                # Extract image data
                picture = article.find('picture')
                if picture:
                    # Extract WebP srcset and sizes
                    webp_source = picture.find('source', type='image/webp')
                    webp_set = webp_source['srcset'] if webp_source and 'srcset' in webp_source.attrs else ''
                    sizes = webp_source['sizes'] if webp_source and 'sizes' in webp_source.attrs else ''

                    # Extract fallback image (JPEG)
                    img = picture.find('img')
                    image = img['src'] if img and 'src' in img.attrs else ''
                    src_set = img['srcset'] if img and 'srcset' in img.attrs else ''
                else:
                    webp_set = ''
                    sizes = ''
                    image = ''
                    src_set = ''

                # Convert relative URLs to absolute URLs
                if image and not image.startswith(('http://', 'https://')):
                    image = urljoin(url, image)
                if webp_set:
                    webp_set = ', '.join([urljoin(url, src.strip()) for src in webp_set.split(',')])
                if src_set:
                    src_set = ', '.join([urljoin(url, src.strip()) for src in src_set.split(',')])

                articles_data.append({
                    'title': title,
                    'link': link,
                    'image': image,
                    'description': description,
                    'webp_set': webp_set,
                    'src_set': src_set,
                    'sizes': sizes
                })
            except Exception as e:
                print(f"Error parsing article: {e}")
                continue  
        unique_articles = []
        seen_titles = set()
        for article in articles_data:
            if article['title'] not in seen_titles:
                unique_articles.append(article)
                seen_titles.add(article['title'])

        return jsonify({
            'status': 'success',
            'data': unique_articles
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            'status': 'error',
            'message': f'Failed to fetch data: {str(e)}'
        }), 500

@app.route('/astronomy', methods=['GET'])
def scrape_astronomy_articles():
    try:
        # Fetch HTML content
        base_url = 'https://www.timeanddate.com'
        url = f'{base_url}/astronomy/sights-to-see.html'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all <article class="post-row">
        articles = soup.find_all('article', class_='post-row')

        # Extract relevant details
        articles_data = []
        for article in articles:
            try:
                # Extract event date (e.g., "Jan 3")
                date_span = article.find('h3').find('span', class_='text-color-link--active')
                event_date = date_span.text.strip() if date_span else "No Date"

                # Extract title and link
                title_tag = article.find('h3').find('a')
                title = title_tag.text.strip() if title_tag else "No Title"
                link = urljoin(base_url, title_tag['href']) if title_tag and 'href' in title_tag.attrs else "#"

                # Extract event description
                description_tag = article.find('p')
                description = description_tag.text.strip() if description_tag else "No Description"

                # Extract image and alt text
                img_tag = article.find('img')
                image_url = urljoin(base_url, img_tag['src']) if img_tag and 'src' in img_tag.attrs else ""
                image_alt = img_tag['alt'] if img_tag and 'alt' in img_tag.attrs else "No Image Description"

                # Extract extra link (if available)
                extra_link_tag = article.find('p', class_='large-link')
                extra_link = urljoin(base_url, extra_link_tag.find('a')['href']) if extra_link_tag and extra_link_tag.find('a') else "#"

                # Append to results
                articles_data.append({
                    'title': title,
                    'event_date': event_date,
                    'link': link,
                    'description': description,
                    'image': image_url,
                    'image_description': image_alt,
                    'extra_link': extra_link
                })
            except Exception as e:
                print(f"Error parsing article: {e}")
                continue

        return jsonify({'status': 'success', 'data': articles_data})

    except requests.exceptions.RequestException as e:
        return jsonify({'status': 'error', 'message': f'Failed to fetch data: {str(e)}'}), 500


async def get_event_details(article):
    """Extract details of each event from the article."""
    title = article.find('h2', class_='entry-title').text.strip() if article.find('h2', class_='entry-title') else 'No title'
    launch_info = article.find('h3', class_='h6').text.strip() if article.find('h3', class_='h6') else 'No launch info'
    location = article.find('div', class_='col h6 mb-0 pt-2').text.strip() if article.find('div', class_='col h6 mb-0 pt-2') else 'No location'
    
    launch_time = 'No launch time'
    launch_time_tag = article.find('time', class_='launchDateTime')
    if launch_time_tag and 'datetime' in launch_time_tag.attrs:
        launch_time = launch_time_tag.attrs['datetime']  # Extract launch time from the datetime attribute
    
    image_url = 'No image URL'
    image_div = article.find('a', class_='launch-list-thumbnail')  # Find the <a> tag with the class
    if image_div and 'data-ezbg' in image_div.attrs:
        image_url = image_div.attrs['data-ezbg']  # Extract image URL from data-ezbg

    go_for_launch_content = ''
    go_for_launch_div = article.find('div', class_='col h6 mb-1 pt-1 text-uppercase')  # Find the div with the specified class
    if go_for_launch_div:
        go_for_launch_content = go_for_launch_div.text.strip()  # Extract and clean up the text inside the div

    return {
        'title': title,
        'launch_info': launch_info,
        'location': location,
        'launch_time': launch_time ,
        'image_url': image_url,
        'go_for_launch_content': go_for_launch_content  # Add the actual content inside the Go For Launch div
    }

async def scrape_page(session, page_num):
    """Scrape the content of a single page asynchronously."""
    base_url = "https://www.spacelaunchschedule.com/page/"
    url = f"{base_url}{page_num}/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        async with session.get(url, headers=headers) as response:
            response.raise_for_status()  # Check for HTTP errors
            soup = BeautifulSoup(await response.text(), 'html.parser')
            main_section = soup.find('main', class_='site-main')
            if main_section:
                articles = main_section.find_all('article')
                return articles if articles else None
            return None
    except Exception as e:
        return None

@app.route('/calenderevents', methods=['GET'])
@cache.cached(timeout=3600)
async def scrape_class_content():
    """Scrape class content across multiple pages and return all events asynchronously."""
    all_events = []
    page_num = 1
    max_pages = 3  # Limit the number of pages to scrape

    async with aiohttp.ClientSession() as session:
        tasks = []
        while page_num <= max_pages:
            task = asyncio.ensure_future(scrape_page(session, page_num))  # Create an async task for scraping the page
            tasks.append(task)
            page_num += 1  # Move to the next page

        results = await asyncio.gather(*tasks)  # Wait for all pages to be fetched
        for articles in results:
            if articles:
                for article in articles:
                    event_details = await get_event_details(article)  # Fetch event details asynchronously
                    all_events.append(event_details)

    return jsonify({'events': all_events})

EMAIL_ADDRESS = "mekalaganeshreddy796@gmail.com"
EMAIL_PASSWORD = "splmpcjdbmybnzez"

scheduled_emails = {}

def send_email(event):
    """Sends an email notification."""
    try:
        msg = MIMEText(f"Reminder: {event['title']} is launching at {event['launch_time']}!")
        msg["Subject"] = f"Upcoming Launch: {event['title']}"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = event["email"]

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, event["email"], msg.as_string())

        print(f"Email sent to {event['email']} for event {event['title']}.")

    except Exception as e:
        print(f"Error sending email: {str(e)}")

def schedule_email(email, event_title, launch_time):
    """Schedules an email to be sent at the specified launch time."""
    event_time = datetime.strptime(launch_time, "%Y-%m-%d %H:%M:%S")
    delay = (event_time - datetime.now()).total_seconds()

    if delay > 0:
        print(f"Scheduling email for {email} at {launch_time} (in {delay} seconds)")

        def task():
            time.sleep(delay)
            send_email({"email": email, "title": event_title, "launch_time": launch_time})

        thread = threading.Thread(target=task)
        thread.start()
    else:
        print(f"Launch time {launch_time} has already passed. Email not scheduled.")

@app.route('/notify', methods=['POST'])
def notify():
    """API endpoint to schedule an email notification."""
    try:
        data = request.get_json()
        email = data.get("email")
        event_title = data.get("event_title")
        launch_time = data.get("launch_time")

        if not email or not event_title or not launch_time:
            return jsonify({"error": "Missing required fields"}), 400

        schedule_email(email, event_title, launch_time)

        return jsonify({"message": "Notification scheduled successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)