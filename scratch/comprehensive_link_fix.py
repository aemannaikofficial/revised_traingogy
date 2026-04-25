import os
import re

def comprehensive_link_fix(directory):
    # List of root pages to check for in links
    root_pages = [
        "index.html", "about.html", "all-programmes.html", "contact.html", "faqs.html", 
        "marketing-programmes.html", "management-programmes.html", "retailing-programmes.html",
        "customer-service-programmes.html", "early-childhood-programmes.html", 
        "human-resource-management-programmes.html", "logistics-purchasing-and-supply-chain-programmes.html",
        "leadership-and-strategic-management-programmes.html", "islamic-trust-and-estate-management-programmes.html",
        "accounting-and-finance-programme.html", "data-science-and-analytic-programme.html", "login.html"
    ]

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                is_in_subfolder = "programmes" in root
                
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                
                # 1. Fix root pages links
                for page in root_pages:
                    if is_in_subfolder:
                        # If in programmes/, links to root pages should be ../page.html
                        # Regex to match href="page.html" but NOT ../page.html
                        pattern = r'href="(?!\.\./)' + re.escape(page) + r'"'
                        replacement = f'href="../{page}"'
                        new_content = re.sub(pattern, replacement, new_content)
                    else:
                        # If in root, links should be page.html (remove ./ if present for consistency)
                        pattern = r'href="\./' + re.escape(page) + r'"'
                        replacement = f'href="{page}"'
                        new_content = re.sub(pattern, replacement, new_content)

                # 2. Wrap footer logos in links
                # Pattern: <div class="elementor-widget-container">\s*<img ... wp-image-20" alt="" />\s*</div>
                # Note: wp-image-20 is the footer logo ID I saw earlier.
                
                footer_logo_pattern = r'(<div class="elementor-widget-container">\s*)(<img [^>]*wp-image-20"[^>]*>)(\s*</div>)'
                if is_in_subfolder:
                    link_href = "../index.html"
                else:
                    link_href = "index.html"
                
                # Check if already wrapped
                if f'<a href="{link_href}"' not in new_content:
                    replacement = r'\1<a href="' + link_href + r'">\2</a>\3'
                    new_content = re.sub(footer_logo_pattern, replacement, new_content)

                if content != new_content:
                    print(f"Fixed content in {path}")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)

if __name__ == "__main__":
    comprehensive_link_fix(".")
