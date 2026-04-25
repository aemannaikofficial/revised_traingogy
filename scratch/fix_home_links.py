import os
import re

def fix_links():
    root_dir = r"c:\Users\PMLS\Desktop\revised Traingogy"
    files = [f for f in os.listdir(root_dir) if f.endswith(".html")]
    
    # We want to replace "https://traingogy.uk" and "https://traingogy.uk/" with "index.html"
    # only when they are part of an href attribute.
    pattern = re.compile(r'href="https://traingogy\.uk/?(?=")')
    
    for filename in files:
        file_path = os.path.join(root_dir, filename)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        new_content = pattern.sub('href="index.html', content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed links in {filename}")
        else:
            print(f"No hardcoded home links found in {filename}")

if __name__ == "__main__":
    fix_links()
