import os
import re

def wrap_footer_logo(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Check for footer logo image (wp-image-20)
                # It's inside a div with class elementor-widget-container
                
                is_in_subfolder = "programmes" in root
                home_link = "../index.html" if is_in_subfolder else "index.html"
                
                # Robust regex: Find the img tag with wp-image-20
                # and wrap it if not already wrapped
                
                # First, find all img tags with wp-image-20
                matches = re.finditer(r'<img [^>]*wp-image-20[^>]*>', content)
                new_content = content
                offset = 0
                
                for match in matches:
                    start, end = match.span()
                    img_tag = match.group(0)
                    
                    # Check if already wrapped in <a>
                    before = content[max(0, start-50):start]
                    if '<a' in before and '</a>' not in before:
                        continue
                        
                    # Wrap it
                    wrapped = f'<a href="{home_link}">{img_tag}</a>'
                    new_content = new_content[:start+offset] + wrapped + new_content[end+offset:]
                    offset += len(wrapped) - (end - start)

                if content != new_content:
                    print(f"Wrapped logo in {path}")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)

if __name__ == "__main__":
    wrap_footer_logo(".")
