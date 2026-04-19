import re

with open('live_marketing_course.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the main content section
content_match = re.search(r'class="entry-content[^"]*"', html)
if content_match:
    start = content_match.start()
    print('ENTRY-CONTENT FOUND at', start)
    print(html[start:start+5000])
else:
    print('No entry-content. Trying post-content...')
    sec = re.search(r'<section[^>]+elementor-section[^>]>', html)
    if sec:
        print('SECTION at', sec.start())
        print(html[sec.start():sec.start()+3000])
    else:
        # Just print relevant portions
        idx = html.find('PROGRAMME AIMS')
        if idx > 0:
            print('FOUND PROGRAMME AIMS section:')
            print(html[idx-2000:idx+3000])
        else:
            print('Looking for any heading...')
            hx = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', html, re.DOTALL)
            for h in hx[:20]:
                clean = re.sub('<[^>]+>', '', h).strip()
                if clean and 'casino' not in clean.lower():
                    print('HEADING:', clean)
