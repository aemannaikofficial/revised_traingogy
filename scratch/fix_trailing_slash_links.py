import os
import re

def fix_links(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Fix links like "all-programmes/" to "all-programmes.html"
                # But only if it's not a remote URL or a hash link
                # Regex for href="something/" where something doesn't contain : or #
                new_content = re.sub(r'href="([^":#]+)/"', r'href="\1.html"', content)
                
                # Also fix href="../all-programmes/"
                new_content = re.sub(r'href="\.\./([^":#]+)/"', r'href="../\1.html"', new_content)

                if content != new_content:
                    print(f"Fixed links in {path}")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_links(".")
