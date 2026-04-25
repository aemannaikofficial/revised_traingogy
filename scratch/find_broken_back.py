import os
import re

def find_broken_back_buttons(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Find the Back button
                # <a ...> ... Back ... </a>
                matches = re.finditer(r'<a [^>]*>.*?Back.*?</a>', content, re.DOTALL)
                for match in matches:
                    tag = match.group(0)
                    if 'href="../all-programmes.html"' not in tag and 'href="all-programmes.html"' not in tag:
                        print(f"Broken Back button in {path}: {tag}")

if __name__ == "__main__":
    find_broken_back_buttons(".")
