import os
import re

base_dir = r"c:\Users\PMLS\Desktop\revised Traingogy"

def fix_html_content(content):
    # 1. Remove localized Elementor font links
    font_links_re = re.compile(r'<link rel=\'stylesheet\' id=\'elementor-gf-local-.*?\' href=\'wp-content/uploads/elementor/google-fonts/css/.*?\' media=\'all\' />')
    content = font_links_re.sub('', content)
    
    # 2. Add Google Fonts CDN link if not present
    google_fonts_cdn = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600;700&family=Questrial&family=Roboto:wght@300;400;500;700&display=swap">'
    if '</head>' in content and 'fonts.googleapis.com' not in content:
        content = content.replace('</head>', f'{google_fonts_cdn}\n</head>')
    
    # 3. Fix hardcoded URLs (escaped and unescaped)
    content = content.replace('https:\\/\\/traingogy.uk\\/', '\\/')
    content = content.replace('http:\\/\\/traingogy.uk\\/', '\\/')
    content = content.replace('https://traingogy.uk/', '/')
    content = content.replace('http://traingogy.uk/', '/')
    content = content.replace('https://traingogy.uk', '')
    content = content.replace('http://traingogy.uk', '')
    
    # 4. Remove Emoji script bloat
    emoji_settings_re = re.compile(r'<script id="wp-emoji-settings" type="application/json">.*?</script>', re.DOTALL)
    content = emoji_settings_re.sub('', content)
    
    emoji_loader_re = re.compile(r'<script type="module">.*?//\# sourceURL=wp-emoji-loader\.min\.js.*?</script>', re.DOTALL)
    content = emoji_loader_re.sub('', content)
    
    # Remove emoji style block
    emoji_styles_re = re.compile(r'<style id=\'wp-emoji-styles-inline-css\'>.*?</style>', re.DOTALL)
    content = emoji_styles_re.sub('', content)

    return content

def fix_css_content(content):
    # Fix absolute URLs in CSS
    content = content.replace('https://traingogy.uk/wp-content/', '/wp-content/')
    content = content.replace('http://traingogy.uk/wp-content/', '/wp-content/')
    content = content.replace('https://traingogy.uk/', '/')
    content = content.replace('http://traingogy.uk/', '/')
    return content

for root, dirs, files in os.walk(base_dir):
    for file in files:
        filepath = os.path.join(root, file)
        if file.endswith(".html"):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = fix_html_content(content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
        elif file.endswith(".css"):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = fix_css_content(content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print("Comprehensive site-wide link and font fix completed.")
