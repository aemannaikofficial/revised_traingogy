const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.includes('programme') && f.endsWith('.html'));

files.forEach(f => {
    let html = fs.readFileSync(f, 'utf8');
    html = html.split('style="background: #fff;').join('style="background: rgba(255,255,255,0.85);');
    html = html.split('style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);').join('style="background: rgba(241, 245, 249, 0.7);');
    fs.writeFileSync(f, html);
});
console.log('Fixed opacity for ' + files.length + ' files');
