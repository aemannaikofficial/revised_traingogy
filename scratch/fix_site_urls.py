import os
import re

# Directory to process
base_dir = r"c:\Users\PMLS\Desktop\revised Traingogy"

def fix_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Clean up Elementor Config URLs (replace traingogy.uk with empty string or relative path)
    content = content.replace("https:\\/\\/traingogy.uk\\/", "\\/")
    content = content.replace("http:\\/\\/traingogy.uk\\/", "\\/")
    content = content.replace("https://traingogy.uk", "") # for non-escaped ones
    
    # 2. Fix localized font 404s - Replace with actual Google Fonts link
    font_links_re = re.compile(r'<link rel=\'stylesheet\' id=\'elementor-gf-local-.*?\' href=\'wp-content/uploads/elementor/google-fonts/css/.*?\' media=\'all\' />')
    content = font_links_re.sub('', content)
    
    # Add Google Fonts link if not present and if it was a page with those fonts
    if 'head' in content and 'fonts.googleapis.com' not in content:
        google_fonts_link = '\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600;700&family=Questrial&family=Roboto:wght@300;400;500;700&display=swap">'
        content = content.replace('</head>', f'{google_fonts_link}\n</head>')

    # 3. Disable Emoji script (it causes 404 and is bloat)
    content = content.replace('"concatemoji":"wp-includes\\/js\\/wp-emoji-release.min.js?ver=6.9.1"', '"concatemoji":""')
    
    # 4. Fix absolute paths in common scripts if any left
    content = content.replace('src="https://traingogy.uk/', 'src="')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_css_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace absolute URLs with relative ones
    content = content.replace("https://traingogy.uk/", "../../../") # Approximate depending on depth
    # Actually, better to just make them relative to root /
    content = content.replace("https://traingogy.uk/wp-content/", "/wp-content/")
    content = content.replace("http://traingogy.uk/wp-content/", "/wp-content/")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Process all HTML files
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".html"):
            fix_html_file(os.path.join(root, file))
        elif file.endswith(".css"):
            fix_css_file(os.path.join(root, file))

print("Site URLs and Fonts fixed successfully.")
