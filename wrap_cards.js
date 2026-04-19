const fs = require('fs');

const files = fs.readdirSync('.').filter(f => (f.endsWith('-programmes.html') || f.endsWith('-programme.html')) && f !== 'all-programmes.html');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Skip if already wrapped
    if (content.includes('class="page-wrapper-card"')) continue;

    // We want to replace individual backgrounds with a simple clean layout inside the wrapper
    // 1. the header section
    content = content.replace(/style="background:\s*rgba\(255,255,255,0\.85\);\s*padding:\s*70px\s*20px;\s*text-align:\s*center;"/g, 'style="padding: 50px 20px 20px; text-align: center;"');
    content = content.replace(/style="background:\s*#fff;\s*padding:\s*70px\s*20px;\s*text-align:\s*center;"/g, 'style="padding: 50px 20px 20px; text-align: center;"');
    
    // 2. the courses section
    content = content.replace(/style="background:\s*rgba\(241,\s*245,\s*249,\s*0\.7\);\s*padding:\s*60px\s*20px;"/g, 'style="padding: 30px 20px 50px;"');
    content = content.replace(/style="background:\s*linear-gradient[^;]+;\s*padding:\s*60px\s*20px;"/g, 'style="padding: 30px 20px 50px;"');
    
    // 3. the bottom programme categories list
    content = content.replace(/style="padding:\s*60px\s*20px;\s*background-color:\s*#f7fafc;\s*text-align:\s*center;"/g, 'style="padding: 50px 20px; text-align: center; border-top: 1px solid #e2e8f0;"');

    // Wrap the content
    // Find the first <div class="content-section"
    let wrapStartHtml = '<div class="page-wrapper-card" style="background: rgba(255,255,255,0.95); max-width: 1200px; margin: 40px auto; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">\n<div class="content-section"';
    
    content = content.replace('<div class="content-section"', wrapStartHtml);
    
    // Add the closing div right before the footer
    content = content.replace('<footer class="site-footer">', '</div>\n\n<footer class="site-footer">');
    
    fs.writeFileSync(file, content);
    console.log("Wrapped content in", file);
}
