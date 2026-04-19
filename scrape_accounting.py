import urllib.request
import re
import json

# Step 1: Get all course URLs from accounting page
req = urllib.request.Request(
    'https://traingogy.uk/accounting-and-finance-programme/',
    headers={"User-Agent": "Mozilla/5.0"}
)
html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')

links = re.findall(r'href="(https://traingogy\.uk/programmes/[^"]+)"', html)
unique = list(dict.fromkeys(links))
print("Accounting course links found:")
for l in unique:
    print(" ", l)

# Step 2: Scrape each one
results = {}
for url in unique:
    slug = url.rstrip('/').split('/')[-1]
    try:
        req2 = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        page = urllib.request.urlopen(req2, timeout=10).read().decode('utf-8', errors='ignore')

        # Title
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.DOTALL)
        title = re.sub('<[^>]+>', '', h1.group(1)).strip() if h1 else slug

        # Get full post content (the main body)
        post_content = re.search(r'elementor-widget-theme-post-content.*?<div class="elementor-widget-container">([\s\S]*?)</div>\s*</div>\s*</div>', page)
        raw_content = post_content.group(1).strip() if post_content else ""

        # Price/Duration
        price_match = re.findall(r'<h2[^>]*>&pound;[\d,]+</h2>', page)
        price = re.sub('<[^>]+>', '', price_match[0]).strip() if price_match else "£200"

        dur_match = re.findall(r'<h2[^>]*>\d+ Months?</h2>', page, re.IGNORECASE)
        duration = re.sub('<[^>]+>', '', dur_match[0]).strip() if dur_match else "6 Months"

        # Sample certificate image
        cert_match = re.search(r'SAMPLE CERTIFICATE.*?<img[^>]+src="([^"]+)"', page, re.DOTALL)
        cert_img = cert_match.group(1).split('/')[-1] if cert_match else ""

        # Thumbnail from OG tag
        og_img = re.search(r'property="og:image" content="([^"]+)"', page)
        thumb = og_img.group(1).split('/')[-1] if og_img else ""

        results[slug] = {
            "title": title,
            "url": url,
            "category_page": "accounting-and-finance-programme.html",
            "raw_content": raw_content,
            "price": price,
            "duration": duration,
            "cert_img": cert_img,
            "thumb": thumb
        }
        print(f"OK: {slug} => {title}")
    except Exception as e:
        print(f"ERR: {slug} => {e}")

with open("accounting_courses.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nSaved to accounting_courses.json")
