import urllib.request
import json
import os
import time

def download_image(url, dest_dir="images"):
    if not url: return None
    filename = url.split('/')[-1]
    # Clean up filename (remove dimensions etc from filename if needed, but let's keep original for parity)
    filepath = os.path.join(dest_dir, filename)
    
    if os.path.exists(filepath):
        print(f"Skipping (exists): {filename}")
        return filename
        
    print(f"Downloading: {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            with open(filepath, 'wb') as f:
                f.write(response.read())
        return filename
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def main():
    if not os.path.exists("images"): os.mkdir("images")
    
    with open("scraped_courses_full.json", "r", encoding='utf-8') as f:
        data = json.load(f)
        
    for course in data:
        print(f"\nCourse: {course['title']}")
        if course.get('thumb'):
            download_image(course['thumb'])
        if course.get('cert'):
            download_image(course['cert'])
        time.sleep(0.5)

if __name__ == "__main__":
    main()
