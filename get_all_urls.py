import urllib.request
import re

def get_all_course_urls():
    # Fetch all-programmes page to find category links
    try:
        req = urllib.request.Request('https://traingogy.uk/all-programmes/', headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
        
        # Category links are like https://traingogy.uk/marketing-programmes/
        category_links = re.findall(r'href="(https://traingogy\.uk/[a-z0-9-]+-programmes?/)"', html)
        category_links = list(set(category_links))
        print(f"Found {len(category_links)} category pages.")
        
        all_course_links = set()
        
        # For each category page, find course links
        for cat_url in category_links:
            try:
                print(f"Scanning category: {cat_url}")
                req_cat = urllib.request.Request(cat_url, headers={'User-Agent': 'Mozilla/5.0'})
                cat_html = urllib.request.urlopen(req_cat, timeout=15).read().decode('utf-8', errors='ignore')
                
                # Course links are like https://traingogy.uk/programmes/slug/
                courses = re.findall(r'href="(https://traingogy\.uk/programmes/[a-z0-9-]+/)"', cat_html)
                for c in courses:
                    all_course_links.add(c)
            except Exception as e:
                print(f"Error scanning {cat_url}: {e}")
        
        # Also check all-programmes directly one more time
        courses_direct = re.findall(r'href="(https://traingogy\.uk/programmes/[a-z0-9-]+/)"', html)
        for c in courses_direct:
            all_course_links.add(c)
            
        return sorted(list(all_course_links))
    except Exception as e:
        print(f"Error fetching main page: {e}")
        return []

if __name__ == "__main__":
    urls = get_all_course_urls()
    print(f"\nTotal unique courses found: {len(urls)}")
    with open("all_course_urls.txt", "w") as f:
        for url in urls:
            f.write(url + "\n")
    print("Saved to all_course_urls.txt")
