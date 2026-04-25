import re
import os

def clean_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove animation from data-settings
    # Example: data-settings="{&quot;animation&quot;:&quot;fadeIn&quot;}"
    # We want to remove the animation part but keep other settings like background_background
    
    def remove_animation(match):
        settings = match.group(0)
        # Remove _animation and animation keys
        settings = re.sub(r'&quot;_?animation&quot;:&quot;[^&]*&quot;,?', '', settings)
        settings = re.sub(r',?&quot;_?animation&quot;:&quot;[^&]*&quot;', '', settings)
        # Clean up commas
        settings = settings.replace('{,', '{').replace(',}', '}')
        return settings

    content = re.sub(r'data-settings="[^"]*"', remove_animation, content)
    
    # Remove animation classes
    content = content.replace('animated-slow', '')
    content = content.replace('elementor-invisible', '')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    clean_html('index.html')
    print("Cleaned index.html")
