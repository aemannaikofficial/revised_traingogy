import os
import re

programmes_dir = r"c:\Users\PMLS\Desktop\revised Traingogy\programmes"
root_pages = ["index.html", "about.html", "all-programmes.html", "faqs.html", "contact.html", "login.html"]

issues = []

for filename in os.listdir(programmes_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(programmes_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
            # Check for root pages without ../
            for page in root_pages:
                pattern = f'href="{page}"'
                if pattern in content:
                    issues.append(f"{filename}: Found {pattern} (missing ../)")
            
            # Check for lms.html
            if 'href="lms.html"' in content:
                issues.append(f"{filename}: Found href=\"lms.html\"")
            
            # Check for trailing slash links
            matches = re.findall(r'href="([^"]+)/"', content)
            for match in matches:
                issues.append(f"{filename}: Found trailing slash link: {match}/")

if issues:
    print("\n".join(issues))
else:
    print("No obvious navigation issues found in programmes/ directory.")
