from localize_site import SiteLocalizer
import urllib.request
import os

pages = {
    "about": "https://traingogy.uk/about/",
    "faqs": "https://traingogy.uk/faqs/",
    "contact": "https://traingogy.uk/contact/",
    "all-programmes": "https://traingogy.uk/all-programmes/",
    "marketing-programmes": "https://traingogy.uk/marketing-programmes/",
    "management-programmes": "https://traingogy.uk/management-programmes/",
    "retailing-programmes": "https://traingogy.uk/retailing-programmes/",
    "customer-service-programmes": "https://traingogy.uk/customer-service-programmes/",
    "early-childhood-programmes": "https://traingogy.uk/early-childhood-programmes/",
    "human-resource-management-programmes": "https://traingogy.uk/human-resource-management-programmes/",
    "logistics-purchasing-and-supply-chain-programmes": "https://traingogy.uk/logistics-purchasing-and-supply-chain-programmes/",
    "leadership-and-strategic-management-programmes": "https://traingogy.uk/leadership-and-strategic-management-programmes/",
    "islamic-trust-and-estate-management-programmes": "https://traingogy.uk/islamic-trust-and-estate-management-programmes/",
    "data-science-and-analytic-programme": "https://traingogy.uk/data-science-and-analytic-programme/",
    "accounting-and-finance-programme": "https://traingogy.uk/accounting-and-finance-programme/"
}

def fetch_and_localize():
    localizer = SiteLocalizer()
    for name, url in pages.items():
        print(f"\nProcessing Page: {name} ({url})")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as response:
                html = response.read().decode('utf-8', errors='ignore')
                localizer.localize_html(html, f"{name}.html")
        except Exception as e:
            print(f"Error processing {name}: {e}")

if __name__ == "__main__":
    fetch_and_localize()
