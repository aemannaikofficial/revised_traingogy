const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('scraped_courses_full.json', 'utf8'));

// Helper to find local image version
function getLocalImg(remoteUrl) {
    if (!remoteUrl) return '../images/Traingogy-logo.webp';
    const filename = remoteUrl.split('/').pop();
    if (fs.existsSync(path.join('images', filename))) {
        return '../images/' + filename;
    }
    // Try to find a partial match (e.g. without dimensions)
    const base = filename.replace(/-\d+x\d+/, '');
    const images = fs.readdirSync('images');
    const match = images.find(img => img.includes(base));
    if (match) return '../images/' + match;
    
    return remoteUrl; // Fallback to remote
}

const sidebarTemplate = (course) => `
<aside class="course-sidebar">
    <div class="sidebar-info-block">
        <div class="sidebar-info-row">
            <span class="label">Price</span>
            <span class="value">${course.price || '£200'}</span>
        </div>
        <div class="sidebar-info-row">
            <span class="label">Duration</span>
            <span class="value duration">${course.duration || '6 Months'}</span>
        </div>
    </div>

    <a href="../contact.html" class="sidebar-enrol-btn">Enquire / Enrol</a>

    ${course.cert ? `
    <div class="sidebar-cert-block">
        <h4>Sample Certificate</h4>
        <img src="${getLocalImg(course.cert)}" alt="Sample Certificate">
    </div>` : ''}

    <h3 style="font-family:'Oswald',sans-serif;font-size:18px;color:#fff;background:#2D5DA7;padding:14px 20px;margin:0;letter-spacing:0.5px;text-transform:uppercase;">Programme Category</h3>
    <ul style="list-style:none;padding:0;margin:0;border:1px solid #e2e8f0;border-top:none;">
        <li style="border-bottom:1px solid #e8edf2;"><a href="../marketing-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Marketing</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Management</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../retailing-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Retailing</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../customer-service-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Customer Service</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../early-childhood-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Early Childhood</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../human-resource-management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Human Resource Management</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../logistics-purchasing-and-supply-chain-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Logistics, Purchasing and SCM</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../leadership-and-strategic-management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Leadership and Strategic Management</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../islamic-trust-and-estate-management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Islamic Trust and Estate Management</a></li>
        <li style="border-bottom:1px solid #e8edf2;"><a href="../data-science-and-analytic-programme.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Data Science and Analytic</a></li>
        <li><a href="../accounting-and-finance-programme.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;">Accounting and Finance</a></li>
    </ul>
</aside>`;

function formatContent(text) {
    if (!text) return '<p>Description coming soon...</p>';
    // Convert newlines to paragraphs
    let paragraphs = text.split('\n\n');
    let html = '';
    paragraphs.forEach(p => {
        let trimmed = p.trim();
        if (!trimmed) return;
        
        // If it's a heading (all caps)
        if (trimmed.length < 50 && /^[A-Z][A-Z\s\/&:]+$/.test(trimmed)) {
            html += `<h2>${trimmed}</h2>`;
        } else {
            html += `<p>${trimmed}</p>`;
        }
    });
    return html;
}

const programmesDir = 'programmes';
if (!fs.existsSync(programmesDir)) fs.mkdirSync(programmesDir);

data.forEach(course => {
    const slug = course.slug;
    const title = course.title;
    const thumb = getLocalImg(course.thumb);
    const content = formatContent(course.description);
    
    const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Traingogy</title>
    <link rel="icon" href="../images/cropped-509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2-32x32.webp" sizes="32x32">
    <link rel="stylesheet" href="../css/style.css?v=2">
    <style>
        body { background: #f0f4f8; }
        .course-page-wrapper { max-width: 1140px; margin: 0 auto; padding: 40px 20px 60px; }
        .course-hero-banner { width: 100%; height: 320px; position: relative; overflow: hidden; border-radius: 8px 8px 0 0; }
        .course-hero-banner img { width: 100%; height: 100%; object-fit: cover; }
        .course-hero-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px 40px; }
        .course-hero-banner-overlay h1 { font-family: 'Oswald', sans-serif; font-size: 38px; color: #fff; margin: 0 0 8px; line-height: 1.2; }
        .breadcrumb-bar { font-size: 14px; color: rgba(255,255,255,0.85); }
        .breadcrumb-bar a { color: #CCFF00; text-decoration: none; }
        .course-layout { display: flex; gap: 30px; background: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .course-sidebar { width: 280px; flex-shrink: 0; background: #fff; border-right: 1px solid #e8edf2; padding: 30px 0; }
        .sidebar-info-block { padding: 0 20px 25px; border-bottom: 1px solid #e8edf2; margin-bottom: 20px; }
        .sidebar-info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
        .sidebar-info-row .label { font-family: 'Questrial', sans-serif; font-size: 14px; color: #888; text-transform: uppercase; }
        .sidebar-info-row .value { font-family: 'Oswald', sans-serif; font-size: 22px; color: #2D5DA7; font-weight: 600; }
        .sidebar-enrol-btn { display: block; width: calc(100% - 40px); margin: 0 20px 25px; background: #2D5DA7; color: #fff; text-align: center; padding: 14px 0; font-family: 'Oswald', sans-serif; font-size: 17px; text-decoration: none; border-radius: 4px; }
        .sidebar-cert-block { padding: 0 20px 25px; border-bottom: 1px solid #e8edf2; margin-bottom: 20px; }
        .sidebar-cert-block h4 { font-family: 'Oswald', sans-serif; font-size: 14px; color: #888; margin: 0 0 10px; text-transform: uppercase; }
        .sidebar-cert-block img { width: 100%; border: 1px solid #ddd; border-radius: 4px; }
        .course-content { flex: 1; padding: 40px 40px 50px; font-family: 'Questrial', sans-serif; font-size: 17px; line-height: 1.9; color: #4a4a4a; }
        .course-content h2 { font-family: 'Oswald', sans-serif; font-size: 22px; color: #2D5DA7; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #CCFF00; text-transform: uppercase; }
        .course-content h2:first-child { margin-top: 0; }
        .course-content p { margin: 0 0 16px; }
        @media (max-width: 768px) {
            .course-layout { flex-direction: column; }
            .course-sidebar { width: 100%; border-right: none; }
            .course-content { padding: 30px 20px; }
        }
    </style>
</head>
<body>
<header class="site-header">
    <div class="header-inner">
        <div class="header-logo"><a href="../index.html"><img src="../images/Traingogy-logo.webp" alt="Traingogy Logo" width="200" height="33"></a></div>
        <ul class="main-nav">
            <li><a href="../index.html">Home</a></li>
            <li><a href="../about.html">About</a></li>
            <li><a href="../all-programmes.html" class="active">Programmes</a></li>
            <li><a href="../faqs.html">FAQs</a></li>
            <li><a href="../contact.html">Contact</a></li>
        </ul>
        <div class="header-action"><a href="../login.html" class="btn-header-login">Login</a></div>
    </div>
</header>

<div class="course-page-wrapper">
    <div class="course-hero-banner">
        <img src="${thumb}" alt="${title}">
        <div class="course-hero-banner-overlay">
            <div class="breadcrumb-bar"><a href="../all-programmes.html">Programmes</a> &rsaquo; ${title}</div>
            <h1>${title}</h1>
        </div>
    </div>
    <div class="course-layout">
        ${sidebarTemplate(course)}
        <main class="course-content">${content}</main>
    </div>
</div>

<footer class="site-footer">
    <img src="../images/509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2.webp" alt="Traingogy Logo">
    <p>&copy; 2024 Traingogy All Rights Reserved</p>
</footer>
<script src="../js/main.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(programmesDir, slug + '.html'), pageHtml);
    console.log(`Generated: ${slug}.html`);
});

// Update Category files links
const categoryFiles = fs.readdirSync('.').filter(f => f.endsWith('-programmes.html') || f.endsWith('-programme.html'));
categoryFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    data.forEach(course => {
        // Find links with this course name as alt or text
        const slug = course.slug;
        const name = course.title;
        // Replace href="#" or anything with programmes/slug.html if name matches
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`href="[^"]*"([^>]*)>\\s*${escapedName}\\s*</a>`, 'g');
        content = content.replace(re, `href="programmes/${slug}.html"$1>${name}</a>`);
        
        // Also fix image link wraps
        const imgRe = new RegExp(`(<a href="[^"]*">\\s*<img[^>]+alt="${escapedName}"[^>]*>\\s*</a>)`, 'g');
        content = content.replace(imgRe, (match) => {
            return match.replace(/href="[^"]*"/, `href="programmes/${slug}.html"`);
        });
    });
    fs.writeFileSync(file, content);
    console.log(`Updated links in: ${file}`);
});

// Update all-programmes.html
let allProg = fs.readFileSync('all-programmes.html', 'utf8');
data.forEach(course => {
    const slug = course.slug;
    const name = course.title;
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`href="[^"]*"([^>]*)>\\s*${escapedName}\\s*</a>`, 'g');
    allProg = allProg.replace(re, `href="programmes/${slug}.html"$1>${name}</a>`);
    
    // Also fix image link wraps
    const imgRe = new RegExp(`(<a href="[^"]*">\\s*<img[^>]+alt="${escapedName}"[^>]*>\\s*</a>)`, 'g');
    allProg = allProg.replace(imgRe, (match) => {
        return match.replace(/href="[^"]*"/, `href="programmes/${slug}.html"`);
    });
});
fs.writeFileSync('all-programmes.html', allProg);
console.log('Updated links in: all-programmes.html');

console.log('Done!');
