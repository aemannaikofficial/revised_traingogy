import os

def fix_all_programmes_links(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Replace broken "programmes.html" with "all-programmes.html"
                # But be careful about paths.
                # If we are in programmes/ folder, ../all-programmes.html is correct.
                # If we are in root, all-programmes.html is correct.
                
                new_content = content.replace('href="programmes.html"', 'href="all-programmes.html"')
                new_content = new_content.replace('href="../programmes.html"', 'href="../all-programmes.html"')

                if content != new_content:
                    print(f"Fixed programmes link in {path}")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_all_programmes_links(".")
