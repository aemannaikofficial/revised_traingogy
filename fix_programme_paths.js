const fs = require('fs');
const path = require('path');

const dir = 'programmes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix all relative paths: prepend ../ where needed
    // css/style.css -> ../css/style.css
    content = content.replace(/href="css\//g, 'href="../css/');
    // images/ -> ../images/
    content = content.replace(/src="images\//g, 'src="../images/');
    content = content.replace(/url\('images\//g, "url('../images/");
    // js/main.js -> ../js/main.js
    content = content.replace(/src="js\//g, 'src="../js/');
    // href links to local pages (not external, not already ../): index.html, about.html, etc.
    content = content.replace(/href="(?!http|#|\.\.)([a-zA-Z0-9_-]+\.html)/g, 'href="../$1');
    // Fix category page back links (e.g., href="../marketing-programmes.html" – already fixed above)
    // Also fix Back link: programmes/ subfolder links should go up
    content = content.replace(/href="programmes\//g, 'href="../programmes/');
    // Fix icon href
    content = content.replace(/href="images\//g, 'href="../images/');

    fs.writeFileSync(filePath, content);
    console.log('Fixed paths in:', file);
}

console.log('\nAll paths fixed.');
