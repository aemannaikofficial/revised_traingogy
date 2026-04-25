import os
import re

def fix_broken_links(file_path, root_dir):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    rel_path = os.path.relpath(file_path, root_dir)
    depth = rel_path.count(os.sep)
    prefix = "../" * depth
    
    modified = False
    
    # 1. Fix enquire-now.html -> contact.html
    new_content = content.replace('href="enquire-now.html"', f'href="{prefix}contact.html"')
    new_content = new_content.replace('href="../enquire-now.html"', f'href="{prefix}contact.html"')
    
    # 2. Fix /lms.html -> login.html
    # Some files have absolute-ish paths like /lms.html
    new_content = new_content.replace('href="/lms.html"', f'href="{prefix}login.html"')
    
    # 3. Fix Read more '#' links on homepage to point to about.html
    if os.path.basename(file_path) == 'index.html':
        # Replace href="#" only for "Read more" buttons
        new_content = re.sub(r'href="#"([^>]*>[\s\S]*?<span class="elementor-button-text">Read more</span>)', r'href="about.html"\1', new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed broken links in {file_path}")
        modified = True
    
    return modified

def main():
    root_dir = r'c:\Users\PMLS\Desktop\revised Traingogy'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                fix_broken_links(file_path, root_dir)

if __name__ == "__main__":
    main()
