const fs = require('fs');
let content = fs.readFileSync('all-programmes.html', 'utf8');

// Remove the fake accounting course cards:
// "Executive Diploma in Accounting", "Executive Diploma in Finance", "Executive Diploma in Islamic Finance"
// These have href="accounting-and-finance-programme.html" and wrong titles

const fakeNames = ['Executive Diploma in Accounting', 'Executive Diploma in Finance', 'Executive Diploma in Islamic Finance'];

for (const name of fakeNames) {
    // Match a course-card block containing this name
    const start = content.indexOf(name);
    if (start < 0) { console.log('Not found:', name); continue; }
    
    // Find the surrounding course-card div start
    const cardStart = content.lastIndexOf('<div class="course-card"', start);
    if (cardStart < 0) { console.log('No card start for:', name); continue; }
    
    // Find the closing </div></div> after the name
    const endTag = '</div>\n            </div>';
    const cardEnd = content.indexOf(endTag, start);
    
    if (cardEnd < 0) {
        // Try alternate closing
        const altEnd = content.indexOf('</div>\n        ', start);
        if (altEnd > 0) {
            content = content.substring(0, cardStart) + content.substring(altEnd + '</div>\n        '.length);
            console.log('Removed (alt):', name);
        } else {
            console.log('Could not find end for:', name);
        }
    } else {
        content = content.substring(0, cardStart) + content.substring(cardEnd + endTag.length);
        console.log('Removed:', name);
    }
}

// Now fix the Level 2 Certificate in Bookkeeping link if it's pointing to accounting-and-finance-programme.html
content = content.replace(
    /href="accounting-and-finance-programme\.html"([^>]*)>([\s\S]*?)Level 2 Certificate in Bookkeeping/g,
    'href="programmes/level-2-certificate-in-bookkeeping.html"$1>$2Level 2 Certificate in Bookkeeping'
);

// Also fix image link for bookkeeping card
content = content.replace(
    /<a href="accounting-and-finance-programme\.html">\s*<img[^>]+alt="Level 2 Certificate in Bookkeeping"[^>]*>\s*<\/a>/g,
    '<a href="programmes/level-2-certificate-in-bookkeeping.html"><img src="images/international-finance_0.webp" alt="Level 2 Certificate in Bookkeeping" style="width:100%; height:220px; object-fit:cover;"></a>'
);

fs.writeFileSync('all-programmes.html', content);
console.log('\nDone. Saved all-programmes.html');
