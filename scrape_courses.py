import urllib.request
import re
import json
import os

courses = [
    # Marketing
    ("executive-diploma-in-marketing", "https://traingogy.uk/programmes/executive-diploma-in-marketing/", "marketing-programmes.html"),
    ("executive-diploma-in-marketing-management", "https://traingogy.uk/programmes/executive-diploma-in-marketing-management/", "marketing-programmes.html"),
    ("executive-diploma-in-integrated-marketing-communication", "https://traingogy.uk/programmes/executive-diploma-in-integrated-marketing-communication/", "marketing-programmes.html"),
    # Logistics
    ("executive-diploma-in-logistics-management", "https://traingogy.uk/programmes/executive-diploma-in-logistics-management/", "logistics-purchasing-and-supply-chain-programmes.html"),
    ("executive-diploma-in-purchasing-supply-management", "https://traingogy.uk/programmes/executive-diploma-in-purchasing-supply-management/", "logistics-purchasing-and-supply-chain-programmes.html"),
    ("executive-diploma-in-inventory-warehousing", "https://traingogy.uk/programmes/executive-diploma-in-inventory-warehousing/", "logistics-purchasing-and-supply-chain-programmes.html"),
    ("executive-diploma-in-supply-chain-management", "https://traingogy.uk/programmes/executive-diploma-in-supply-chain-management/", "logistics-purchasing-and-supply-chain-programmes.html"),
    # Management
    ("executive-diploma-in-management", "https://traingogy.uk/programmes/executive-diploma-in-management/", "management-programmes.html"),
    ("executive-diploma-in-operations-management", "https://traingogy.uk/programmes/executive-diploma-in-operations-management/", "management-programmes.html"),
    # HRM
    ("executive-diploma-in-human-resource-management", "https://traingogy.uk/programmes/executive-diploma-in-human-resource-management/", "human-resource-management-programmes.html"),
    ("executive-diploma-in-human-capital-management", "https://traingogy.uk/programmes/executive-diploma-in-human-capital-management/", "human-resource-management-programmes.html"),
    # Leadership
    ("executive-diploma-in-leadership-and-management", "https://traingogy.uk/programmes/executive-diploma-in-leadership-and-management/", "leadership-and-strategic-management-programmes.html"),
    ("executive-diploma-in-advanced-leadership-and-management", "https://traingogy.uk/programmes/executive-diploma-in-advancedleadership-and-management/", "leadership-and-strategic-management-programmes.html"),
    ("executive-diploma-in-strategic-management", "https://traingogy.uk/programmes/executive-diploma-in-strategic-management/", "leadership-and-strategic-management-programmes.html"),
    # Retailing
    ("executive-diploma-in-retail-management", "https://traingogy.uk/programmes/executive-diploma-in-retail-management/", "retailing-programmes.html"),
    ("professional-certificate-in-new-retail-strategy", "https://traingogy.uk/programmes/professional-certificate-in-new-retail-strategy/", "retailing-programmes.html"),
    # Early Childhood
    ("executive-diploma-in-early-childhood-development", "https://traingogy.uk/programmes/executive-diploma-in-early-childhood-development/", "early-childhood-programmes.html"),
    ("executive-diploma-in-early-childhood-education-practice", "https://traingogy.uk/programmes/executive-diploma-in-early-childhood-education-practice/", "early-childhood-programmes.html"),
    # Customer Service
    ("executive-diploma-in-customer-service-management", "https://traingogy.uk/programmes/executive-diploma-in-customer-service-management/", "customer-service-programmes.html"),
    # Islamic
    ("professional-diploma-in-islamic-conventional-trust-management", "https://traingogy.uk/programmes/professional-diploma-in-islamic-conventional-trust-management/", "islamic-trust-and-estate-management-programmes.html"),
    ("professional-diploma-in-islamic-conventional-estate-planning-asset-protection", "https://traingogy.uk/programmes/professional-diploma-in-islamic-conventional-estate-planning-asset-protection/", "islamic-trust-and-estate-management-programmes.html"),
    # Accounting
    ("level-2-certificate-in-bookkeeping", "https://traingogy.uk/programmes/level-2-certificate-in-bookkeeping/", "accounting-and-finance-programme.html"),
]

results = {}

for slug, url, category_page in courses:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8", errors="ignore")
        
        # Get title from h1 or page title
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
        title_tag = re.search(r'<title>(.*?) -', html)
        title = ""
        if h1:
            title = re.sub('<[^>]+>', '', h1.group(1)).strip()
        elif title_tag:
            title = title_tag.group(1).strip()
        
        # Get all text paragraphs from elementor widget containers
        blocks = re.findall(r'<div class="elementor-widget-container">([\s\S]*?)</div>\s*</div>', html)
        desc_parts = []
        for block in blocks:
            text = re.sub('<[^>]+>', ' ', block).strip()
            text = re.sub(r'\s+', ' ', text)
            if len(text) > 80 and 'casino' not in text.lower() and 'bingo' not in text.lower():
                desc_parts.append(text)
        
        # Also extract list items (learning objectives, modules)
        lists = re.findall(r'<ul[^>]*>([\s\S]*?)</ul>', html)
        list_parts = []
        for lst in lists:
            items = re.findall(r'<li[^>]*>([\s\S]*?)</li>', lst)
            clean_items = [re.sub('<[^>]+>', '', item).strip() for item in items]
            clean_items = [i for i in clean_items if len(i) > 5 and 'casino' not in i.lower()]
            if clean_items:
                list_parts.append(clean_items)
        
        # Get cover image
        img_match = re.search(r'<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"', html)
        if not img_match:
            img_match = re.search(r'<img[^>]+src="([^"]+/wp-content/uploads/[^"]+244x300[^"]+)"', html)
        img_src = img_match.group(1) if img_match else ""
        
        results[slug] = {
            "title": title,
            "url": url,
            "category_page": category_page,
            "description": desc_parts[:3],
            "lists": list_parts[:2],
            "img": img_src
        }
        print(f"OK: {slug} - {title}")
    except Exception as e:
        print(f"ERR: {slug} - {e}")
        results[slug] = {"title": slug, "url": url, "category_page": category_page, "description": [], "lists": [], "img": ""}

with open("course_data.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nDone. Saved to course_data.json")
