import urllib.request
import re

req = urllib.request.Request('https://traingogy.uk/data-science-and-analytic-programme/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    courses = re.findall(r'href="(https://traingogy\.uk/programmes/[^"]+/)"', html)
    unique = list(set(courses))
    print(f"Data Science courses on live site: {len(unique)}")
    for u in unique:
        print(u)
except Exception as e:
    print(f"Error: {e}")
