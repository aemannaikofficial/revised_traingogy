const fs = require('fs');
const path = require('path');

const programmesDir = './programmes';
const files = fs.readdirSync(programmesDir).filter(f => f.endsWith('.html'));

files.forEach(fileName => {
    const filePath = path.join(programmesDir, fileName);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Fix HTML attributes (href, src) - handle both double and single quotes
    // Ensure we don't double-prefix if ../ is already there
    content = content.replace(/(href|src|srcset)=["'](?!https?:\/\/|\/|\.\.\/)(wp-content|wp-includes|images)/g, '$1="../$2');
    
    // Fix srcset specifically (it has multiple URLs)
    // Example: srcset="wp-content/uploads/2024/02/logo.webp 350w, wp-content/uploads/..."
    content = content.replace(/srcset=['"]([^'"]+)['"]/g, (match, p1) => {
        const parts = p1.split(',').map(part => {
            part = part.trim();
            if (part && !part.startsWith('http') && !part.startsWith('/') && !part.startsWith('../')) {
                return `../${part}`;
            }
            return part;
        });
        return `srcset="${parts.join(', ')}"`;
    });

    // Fix internal CSS url() paths
    content = content.replace(/url\(['"]?(?!https?:\/\/|\/|\.\.\/)(wp-content|wp-includes|images)/g, 'url(../$1');

    // Fix header navigation links
    // If they point to a local HTML file in the root, they need ../ prefix
    const rootLinks = ['about.html', 'all-programmes.html', 'contact.html', 'faqs.html', 'index.html', 'login.html'];
    rootLinks.forEach(link => {
        const regex = new RegExp(`href=["'](?!https?:\/\/|\/|\.\.\/)${link}["']`, 'g');
        content = content.replace(regex, `href="../${link}"`);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed paths in: ${filePath}`);
    }
});
