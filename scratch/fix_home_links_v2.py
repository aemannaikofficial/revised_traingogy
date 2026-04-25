import os
import re

def fix_links():
    root_dir = r"c:\Users\PMLS\Desktop\revised Traingogy"
    
    # 1. Fix files in the root directory
    root_files = [f for f in os.listdir(root_dir) if f.endswith(".html")]
    # Replace href="" with href="index.html" specifically for the Home link
    home_link_pattern = re.compile(r'<a href="" class="ekit-menu-nav-link([^"]*)">Home</a>')
    # Also replace any remaining live URLs just in case
    live_url_pattern = re.compile(r'href="https://traingogy\.uk/?(?=")')
    
    for filename in root_files:
        file_path = os.path.join(root_dir, filename)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        new_content = home_link_pattern.sub(r'<a href="index.html" class="ekit-menu-nav-link\1">Home</a>', content)
        new_content = live_url_pattern.sub('href="index.html', new_content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed links in root: {filename}")

    # 2. Fix files in the programmes directory
    prog_dir = os.path.join(root_dir, "programmes")
    if os.path.exists(prog_dir):
        prog_files = [f for f in os.listdir(prog_dir) if f.endswith(".html")]
        for filename in prog_files:
            file_path = os.path.join(prog_dir, filename)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # For subpages, link should be ../index.html
            new_content = home_link_pattern.sub(r'<a href="../index.html" class="ekit-menu-nav-link\1">Home</a>', content)
            new_content = live_url_pattern.sub('href="../index.html', new_content)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed links in programmes: {filename}")

if __name__ == "__main__":
    fix_links()
