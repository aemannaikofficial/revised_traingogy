import os
import re
import urllib.request
import urllib.parse

class SiteLocalizer:
    def __init__(self, base_url="https://traingogy.uk/", local_root="."):
        self.base_url = base_url
        self.local_root = local_root
        self.downloaded = set()

    def ensure_dir(self, file_path):
        directory = os.path.dirname(file_path)
        if not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)

    def download_asset(self, url):
        # Remove query strings for local filenames
        clean_url = url.split('?')[0]
        if not clean_url.startswith(self.base_url):
            return url # Skip external assets for now (keep as absolute)

        rel_path = clean_url.replace(self.base_url, "")
        local_path = os.path.join(self.local_root, rel_path)
        
        if local_path in self.downloaded or os.path.exists(local_path):
            return rel_path

        try:
            print(f"Downloading: {url}")
            self.ensure_dir(local_path)
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as response:
                with open(local_path, 'wb') as f:
                    f.write(response.read())
            self.downloaded.add(local_path)
            return rel_path
        except Exception as e:
            print(f"Error downloading {url}: {e}")
            return url

    def localize_html(self, html_content, output_name):
        # 1. Localize Assets (src and href for CSS/JS/Images)
        def asset_repl(match):
            url = match.group(1)
            if url.startswith(self.base_url) or url.startswith("/wp-content") or url.startswith("/wp-includes"):
                full_url = urllib.parse.urljoin(self.base_url, url)
                return match.group(0).replace(url, self.download_asset(full_url))
            return match.group(0)

        # Match src="..." and href="..."
        html_content = re.sub(r'src=["\']([^"\']+)["\']', asset_repl, html_content)
        html_content = re.sub(r'href=["\']([^"\']+\.(?:css|js|png|jpg|jpeg|gif|webp|svg|pdf|zip)(?:\b[^"\']*))["\']', asset_repl, html_content)

        # 2. Localize Inline Background Images
        def bg_repl(match):
            url = match.group(1)
            if url.startswith(self.base_url) or url.startswith("/wp-content"):
                full_url = urllib.parse.urljoin(self.base_url, url)
                return f'url({self.download_asset(full_url)})'
            return match.group(0)
        
        html_content = re.sub(r'url\(["\']?([^"\')]+)["\']?\)', bg_repl, html_content)

        # 3. Rewrite Site Links (e.g. /about/ -> about.html)
        def link_repl(match):
            url = match.group(1)
            if url.startswith(self.base_url) or url.startswith("/") and not url.startswith("/wp-"):
                clean = url.replace(self.base_url, "").strip("/")
                if not clean: return match.group(0).replace(url, "index.html")
                return match.group(0).replace(url, f"{clean}.html")
            return match.group(0)

        html_content = re.sub(r'href=["\'](https://traingogy\.uk/[^"\']*/|/[^"\']*/)["\']', link_repl, html_content)

        with open(output_name, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"Localized HTML saved to: {output_name}")

if __name__ == "__main__":
    localizer = SiteLocalizer()
    with open('original_index.html', 'r', encoding='utf-8') as f:
        localizer.localize_html(f.read(), 'index.html')
