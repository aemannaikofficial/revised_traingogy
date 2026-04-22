from localize_site import SiteLocalizer
import urllib.request
import json
import os

def mirror_courses():
    if not os.path.exists("programmes"):
        os.makedirs("programmes")
    
    with open("scraped_courses_full.json", "r", encoding='utf-8') as f:
        courses = json.load(f)
    
    # We use a base_url of root for assets consistently
    localizer = SiteLocalizer()
    
    for course in courses:
        url = course['url']
        slug = course['slug']
        print(f"\nMirroring Course: {course['title']} ({url})")
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as response:
                html = response.read().decode('utf-8', errors='ignore')
                
                # Note: For pages in a subdirectory, the asset paths in index.html like 'wp-content/...' 
                # will need to be '../wp-content/...' in the course pages if they are in 'programmes/'.
                # I'll handle this by adjusting the HTML after localization.
                
                output_path = os.path.join("programmes", f"{slug}.html")
                localizer.localize_html(html, output_path)
                
                # Fix relative paths in the newly created sub-page
                with open(output_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Prefix wp-content/ and wp-includes/ and images/ with ../
                content = content.replace('src="wp-', 'src="../wp-')
                content = content.replace('href="wp-', 'href="../wp-')
                content = content.replace('src="images/', 'src="../images/')
                content = content.replace('url(wp-', 'url(../wp-')
                
                # Also fix the links back to home/other root pages
                # The localizer changed them to "about.html", they should be "../about.html"
                content = content.replace('href="index.html"', 'href="../index.html"')
                content = content.replace('href="about.html"', 'href="../about.html"')
                content = content.replace('href="faqs.html"', 'href="../faqs.html"')
                content = content.replace('href="contact.html"', 'href="../contact.html"')
                content = content.replace('href="all-programmes.html"', 'href="../all-programmes.html"')
                
                # And category pages
                content = content.replace('href="marketing-programmes.html"', 'href="../marketing-programmes.html"')
                # ... repeat for all or use a regex
                content = re.sub(r'href="(?!http|#|../)([^"]+-programmes?\.html)"', r'href="../\1"', content)

                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
        except Exception as e:
            print(f"Error mirroring {slug}: {e}")

if __name__ == "__main__":
    import re # Needed for the regex fix
    mirror_courses()
