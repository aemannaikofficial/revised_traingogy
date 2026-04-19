import urllib.request
import re
import json
import os
import time

def clean_content(html_chunk):
    # Remove script and style
    html_chunk = re.sub(r'<(script|style).*?>.*?</\1>', '', html_chunk, flags=re.DOTALL | re.IGNORECASE)
    # Remove tags but keep paragraph structure if possible
    # Replace <p> with newlines to help formatting later
    html_chunk = html_chunk.replace('<p>', '\n\n').replace('</p>', '')
    html_chunk = html_chunk.replace('<br>', '\n').replace('<br/>', '\n')
    
    # Remove all remaining HTML tags
    clean = re.sub(r'<[^>]+>', ' ', html_chunk)
    
    # Unescape HTML entities
    import html
    clean = html.unescape(clean)
    
    # Clean up whitespace
    clean = re.sub(r'[ \t]+', ' ', clean)
    clean = re.sub(r'\n\s*\n', '\n\n', clean)
    return clean.strip()

def scrape_course(url):
    print(f"Scraping: {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html_content = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
        
        # Extract title
        title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html_content, re.DOTALL)
        title = re.sub('<[^>]+>', '', title_match.group(1)).strip() if title_match else "Unknown Course"
        
        # Try to find price
        price = "£200"
        price_match = re.search(r'(?:Price|Fee|&pound;|£)\s*(\d+)', html_content, re.IGNORECASE)
        if price_match:
            price = f"£{price_match.group(1)}"
        
        # Try to find duration
        duration = "6 Months"
        dur_match = re.search(r'(\d+)\s*(Months|Weeks)', html_content, re.IGNORECASE)
        if dur_match:
            duration = f"{dur_match.group(1)} {dur_match.group(2)}"
            
        # Find main content
        # Look for the section specifically that contains "PROGRAMME AIMS"
        # Often it's in <div class="elementor-widget-container">
        content_found = ""
        
        # Strategy 1: Look for Elementor post content widget
        post_content_match = re.search(r'class="elementor-widget-theme-post-content".*?<div class="elementor-widget-container">(.*?)</div>\s*</div>\s*</div>', html_content, re.DOTALL)
        if post_content_match:
            content_found = post_content_match.group(1)
        
        # Strategy 2: If Strategy 1 is too small or fails, look for large blocks of text containing "PROGRAMME AIMS"
        if len(content_found) < 200:
            blocks = re.findall(r'<div class="elementor-widget-container">(.*?)</div>', html_content, re.DOTALL)
            for b in blocks:
                if "PROGRAMME AIMS" in b:
                    content_found = b
                    break
        
        # Strategy 3: Search for all text that looks like description
        if not content_found:
             post_content_match = re.search(r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)</div>', html_content, re.DOTALL)
             if post_content_match:
                 content_found = post_content_match.group(1)

        # Strategy 4: Fallback to searching around keywords
        if not content_found:
            aims_pos = html_content.find("PROGRAMME AIMS")
            if aims_pos != -1:
                # Get a large chunk and hope for the best
                content_found = html_content[aims_pos:aims_pos+4000]

        # Final cleaning
        description = clean_content(content_found)
        
        # Remove junk at the end if we overshot (like SEO spam or footer content)
        if "Bingo" in description:
            description = description.split("Bingo")[0].strip()
        if "Casino" in description:
            description = description.split("Casino")[0].strip()

        # Images
        thumb_img = ""
        og_img = re.search(r'property="og:image" content="([^"]+)"', html_content)
        if og_img:
            thumb_img = og_img.group(1)
            
        cert_img = ""
        cert_match = re.search(r'SAMPLE CERTIFICATE.*?(https://traingogy\.uk/wp-content/uploads/[^"]+\.(webp|jpg|png|jpeg))', html_content, re.IGNORECASE | re.DOTALL)
        if cert_match:
            cert_img = cert_match.group(1)
            
        return {
            "url": url,
            "title": title,
            "price": price,
            "duration": duration,
            "description": description,
            "thumb": thumb_img,
            "cert": cert_img,
            "slug": url.split('/')[-2] if url.endswith('/') else url.split('/')[-1]
        }
        
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def main():
    with open("all_course_urls.txt", "r") as f:
        urls = [line.strip() for line in f if line.strip()]
        
    scraped_data = []
    for url in urls:
        data = scrape_course(url)
        if data:
            scraped_data.append(data)
        time.sleep(1)
        
    with open("scraped_courses_full.json", "w", encoding='utf-8') as f:
        json.dump(scraped_data, f, indent=2, ensure_ascii=False)
    print(f"\nScraped {len(scraped_data)} courses.")

if __name__ == "__main__":
    main()
