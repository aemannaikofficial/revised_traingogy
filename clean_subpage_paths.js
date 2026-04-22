const fs = require('fs');
const path = require('path');

const programmesDir = './programmes';
const files = fs.readdirSync(programmesDir).filter(f => f.endsWith('.html'));

files.forEach(fileName => {
    const filePath = path.join(programmesDir, fileName);
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the quote mismatch I introduced: href="../wp-content/...' or src="../wp-content/...'
    // Specifically looking for cases where it starts with " and ends with '
    content = content.replace(/(href|src)=["']\.\.\/(wp-content|wp-includes|images)([^"']*)['"]/g, '$1="../$2$3"');
    content = content.replace(/(href|src)=["']\.\.\/(wp-content|wp-includes|images)([^"']*)["']/g, '$1="../$2$3"');

    // A more robust replacement for the future:
    // Handle double quotes
    content = content.replace(/href="(?!\.\.\/|https?:\/\/|\/)(wp-content|wp-includes|images)/g, 'href="../$1');
    content = content.replace(/src="(?!\.\.\/|https?:\/\/|\/)(wp-content|wp-includes|images)/g, 'src="../$1');
    
    // Handle single quotes
    content = content.replace(/href='(?!\.\.\/|https?:\/\/|\/)(wp-content|wp-includes|images)/g, "href='../$1");
    content = content.replace(/src='(?!\.\.\/|https?:\/\/|\/)(wp-content|wp-includes|images)/g, "src='../$1");

    // Also fix the logo link which I missed
    content = content.replace(/href="https:\/\/traingogy\.uk"/g, 'href="../index.html"');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned up quotes and logo links in: ${filePath}`);
});
