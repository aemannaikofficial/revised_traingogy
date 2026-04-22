import re

def analyze_html(filename):
    print(f"Analyzing {filename}...")
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # CSS links
    css = re.findall(r'href=["\']([^"\']+\.css\b[^"\']*)["\']', html)
    # JS scripts
    js = re.findall(r'src=["\']([^"\']+\.js\b[^"\']*)["\']', html)
    # Images
    img = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|gif|webp|svg)\b[^"\']*)["\']', html)
    # Background images in style tags or inline styles
    bg_img = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', html)
    
    print("\nCSS Dependencies:")
    for l in sorted(set(css)): print(l)
    
    print("\nJS Dependencies:")
    for l in sorted(set(js)): print(l)
    
    print("\nImage Dependencies (Sample):")
    for l in sorted(set(img))[:20]: print(l)
    
    print("\nBackground Image Dependencies:")
    for l in sorted(set(bg_img))[:20]: print(l)

if __name__ == "__main__":
    analyze_html('original_index.html')
