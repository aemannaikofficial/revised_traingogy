import os
from bs4 import BeautifulSoup
import re

def fix_nested_anchors(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if there are nested anchors
    # A simple regex to find nested anchors is hard, so we use BeautifulSoup
    soup = BeautifulSoup(content, 'html.parser')
    
    modified = False
    
    # Find all anchor tags
    anchors = soup.find_all('a')
    
    for a in anchors:
        # Find if this anchor has another anchor inside it
        inner_anchors = a.find_all('a')
        if inner_anchors:
            for inner in inner_anchors:
                # We want to keep the content of the inner anchor but remove the tag itself
                # or remove the inner anchor if it was added by mistake.
                # In our case, the inner anchor was added by the faulty regex script.
                # It usually wraps an img tag.
                
                # If the inner anchor points to index.html and was added to an image,
                # it's likely the one we want to remove.
                if inner.get('href') in ['index.html', '../index.html']:
                    inner.unwrap()
                    modified = True
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Fixed nested anchors in {file_path}")
    return modified

def fix_login_links(file_path, root_dir):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    rel_path = os.path.relpath(file_path, root_dir)
    depth = rel_path.count(os.sep)
    prefix = "../" * depth
    
    login_target = f"{prefix}login.html"
    
    # Replace lms.html with login.html
    new_content = content.replace('href="lms.html"', f'href="{login_target}"')
    new_content = new_content.replace('href="../lms.html"', f'href="{login_target}"')
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed login links in {file_path}")
        return True
    return False

def main():
    root_dir = r'c:\Users\PMLS\Desktop\revised Traingogy'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                fix_nested_anchors(file_path)
                fix_login_links(file_path, root_dir)

if __name__ == "__main__":
    main()
