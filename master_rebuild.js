const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('scraped_courses_full.json', 'utf8'));

// 1. Define Category Mapping (Based on the live site)
const categoryMap = {
    'marketing-programmes.html': [
        'executive-diploma-in-marketing',
        'executive-diploma-in-marketing-management',
        'executive-diploma-in-integrated-marketing-communication'
    ],
    'management-programmes.html': [
        'executive-diploma-in-management',
        'executive-diploma-in-operations-management'
    ],
    'retailing-programmes.html': [
        'executive-diploma-in-retail-management',
        'professional-certificate-in-new-retail-strategy'
    ],
    'customer-service-programmes.html': [
        'executive-diploma-in-customer-service-management'
    ],
    'early-childhood-programmes.html': [
        'executive-diploma-in-early-childhood-development',
        'executive-diploma-in-early-childhood-education-practice'
    ],
    'human-resource-management-programmes.html': [
        'executive-diploma-in-human-resource-management',
        'executive-diploma-in-human-capital-management'
    ],
    'logistics-purchasing-and-supply-chain-programmes.html': [
        'executive-diploma-in-logistics-management',
        'executive-diploma-in-purchasing-supply-management',
        'executive-diploma-in-inventory-warehousing',
        'executive-diploma-in-supply-chain-management'
    ],
    'leadership-and-strategic-management-programmes.html': [
        'executive-diploma-in-leadership-and-management',
        'executive-diploma-in-advancedleadership-and-management',
        'executive-diploma-in-strategic-management'
    ],
    'islamic-trust-and-estate-management-programmes.html': [
        'professional-diploma-in-islamic-conventional-trust-management',
        'professional-diploma-in-islamic-conventional-estate-planning-asset-protection'
    ],
    'accounting-and-finance-programme.html': [
        'level-2-certificate-in-bookkeeping'
    ],
    'data-science-and-analytic-programme.html': [] // No courses logic
};

// 2. Helper to find local image version
function getLocalImg(remoteUrl) {
    if (!remoteUrl) return '../images/Traingogy-logo.webp';
    const filename = remoteUrl.split('/').pop().split('?')[0];
    const localDir = 'images';
    if (fs.existsSync(path.join(localDir, filename))) return filename;
    
    // Try to find a match without dimensions
    const base = filename.replace(/-\d+x\d+/, '');
    const files = fs.readdirSync(localDir);
    const match = files.find(f => f.includes(base));
    return match || filename;
}

// 3. Template for Individual Programme Page
const programmeTemplate = (course) => {
    const title = course.title.replace(/&amp;/g, '&');
    const thumb = getLocalImg(course.thumb);
    const cert = getLocalImg(course.cert);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Traingogy</title>
    <link rel="icon" href="../images/cropped-509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2-32x32.webp" sizes="32x32">
    <link rel="stylesheet" href="../css/style.css?v=4">
    <style>
        body { background: #f0f4f8; }
        .course-page-wrapper { max-width: 1140px; margin: 0 auto; padding: 40px 20px 60px; }
        .course-hero-banner { width: 100%; height: 320px; position: relative; overflow: hidden; border-radius: 8px 8px 0 0; }
        .course-hero-banner img { width: 100%; height: 100%; object-fit: cover; }
        .course-hero-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 30px 40px; }
        .course-hero-banner-overlay h1 { font-family: 'Oswald', sans-serif; font-size: 38px; color: #fff; margin: 0 0 8px; line-height: 1.2; }
        .breadcrumb-bar { font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.85); margin-bottom: 5px; }
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
        @media (max-width: 768px) { .course-layout { flex-direction: column; } .course-sidebar { width: 100%; border-right: none; } }
    </style>
</head>
<body>
<header class="site-header">
    <div class="header-inner">
        <div class="header-logo"><a href="../index.html"><img src="../images/Traingogy-logo.webp" alt="Traingogy Logo" width="200" height="33"></a></div>
        <ul class="main-nav"><li><a href="../index.html">Home</a></li><li><a href="../about.html">About</a></li><li><a href="../all-programmes.html" class="active">Programmes</a></li><li><a href="../faqs.html">FAQs</a></li><li><a href="../contact.html">Contact</a></li></ul>
        <div class="header-action"><a href="../login.html" class="btn-header-login">Login</a></div>
    </div>
</header>
<div class="course-page-wrapper">
    <div class="course-hero-banner"><img src="../images/${thumb}" alt="${title}"><div class="course-hero-banner-overlay"><div class="breadcrumb-bar"><a href="../all-programmes.html">Programmes</a> &rsaquo; ${title}</div><h1>${title}</h1></div></div>
    <div class="course-layout">
        <aside class="course-sidebar">
            <div class="sidebar-info-block">
                <div class="sidebar-info-row"><span class="label">Price</span><span class="value">${course.price}</span></div>
                <div class="sidebar-info-row"><span class="label">Duration</span><span class="value duration">${course.duration}</span></div>
            </div>
            <a href="../contact.html" class="sidebar-enrol-btn">Enquire / Enrol</a>
            ${course.cert ? `<div class="sidebar-cert-block"><h4>Sample Certificate</h4><img src="../images/${cert}" alt="Sample Certificate"></div>` : ''}
            <h3 style="font-family:'Oswald',sans-serif;font-size:18px;color:#fff;background:#2D5DA7;padding:14px 20px;margin:0;letter-spacing:0.5px;text-transform:uppercase;">Categories</h3>
            <ul style="list-style:none;padding:0;margin:0;border:1px solid #e2e8f0;border-top:none;font-size:14px;">
                <li style="border-bottom:1px solid #eee;"><a href="../marketing-programmes.html" style="display:block;padding:10px 20px;color:#333;text-decoration:none;">Marketing</a></li>
                <li style="border-bottom:1px solid #eee;"><a href="../management-programmes.html" style="display:block;padding:10px 20px;color:#333;text-decoration:none;">Management</a></li>
                <li style="border-bottom:1px solid #eee;"><a href="../all-programmes.html" style="display:block;padding:10px 20px;color:#2D5DA7;text-decoration:none;">View All...</a></li>
            </ul>
        </aside>
        <main class="course-content">${formatDesc(course.description)}</main>
    </div>
</div>
<footer class="site-footer"><img src="../images/509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2.webp" alt="Traingogy Logo"><p>&copy; 2024 Traingogy All Rights Reserved</p></footer>
</body>
</html>`;
};

function formatDesc(text) {
    if (!text) return '<p>Description expected.</p>';
    return text.split('\n\n').map(p => {
        const t = p.trim();
        if (!t) return '';
        if (t.length < 60 && /^[A-Z\s\/&:]+$/.test(t)) return `<h2>${t}</h2>`;
        return `<p>${t}</p>`;
    }).join('');
}

// 4. Execution
const progDir = 'programmes';
if (!fs.existsSync(progDir)) fs.mkdirSync(progDir);

// Rebuild Individual Pages
data.forEach(course => {
    fs.writeFileSync(path.join(progDir, course.slug + '.html'), programmeTemplate(course));
    console.log(`Updated page: ${course.slug}.html`);
});

// Rebuild Category Pages
Object.entries(categoryMap).forEach(([file, slugs]) => {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');
    
    // Find the course-grid container
    const gridStart = html.indexOf('<div class="courses-grid"');
    if (gridStart === -1) return;
    const gridEnd = html.indexOf('<div class="programmes-section"', gridStart);
    if (gridEnd === -1) return;
    
    const before = html.substring(0, gridStart);
    const after = html.substring(gridEnd);
    
    let gridHtml = `<div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; max-width: 1140px; margin: 0 auto;">\n`;
    
    if (slugs.length === 0) {
        gridHtml += `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: #888; font-family: 'Questrial', sans-serif;">New programmes coming soon. Please contact us for details.</div>\n`;
    } else {
        slugs.forEach(slug => {
            const course = data.find(c => c.slug === slug);
            if (!course) return;
            const thumb = getLocalImg(course.thumb);
            const title = course.title.replace(/&amp;/g, '&');
            gridHtml += `
            <div class="course-card" style="background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.05); transition:transform 0.2s;">
                <a href="programmes/${slug}.html"><img src="images/${thumb}" alt="${title}" style="width:100%; height:220px; object-fit:cover;"></a>
                <div style="padding:20px; text-align:center;">
                    <h3 style="font-size:18px; margin:0; font-family:'Oswald', sans-serif;"><a href="programmes/${slug}.html" style="color:#333; text-decoration:none;">${title}</a></h3>
                </div>
            </div>`;
        });
    }
    gridHtml += `\n    </div>\n</div>\n\n`;
    
    fs.writeFileSync(file, before + gridHtml + after);
    console.log(`Rebuilt Category: ${file}`);
});

// Rebuild All Programmes aggregate
let allHtml = fs.readFileSync('all-programmes.html', 'utf8');
const sections = [];
Object.entries(categoryMap).forEach(([file, slugs]) => {
    const catName = file.replace(/-programmes?\.html/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' Programme';
    let block = `<div class="category-block" style="margin-bottom: 60px;">
        <h2 style="font-size: 32px; color: #2D5DA7; margin-bottom: 30px; font-family: 'Oswald', sans-serif; border-bottom: 2px solid #CCFF00; padding-bottom: 10px; display: inline-block;">${catName}</h2>
        <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">`;
    
    if (slugs.length === 0) {
        block += `<p style="color:#888; font-family:'Questrial', sans-serif;">Coming soon...</p>`;
    } else {
        slugs.forEach(slug => {
            const course = data.find(c => c.slug === slug);
            if (!course) return;
            const thumb = getLocalImg(course.thumb);
            const title = course.title.replace(/&amp;/g, '&');
            block += `
            <div class="course-card" style="background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.05); transition:transform 0.2s;">
                <a href="programmes/${slug}.html"><img src="images/${thumb}" alt="${title}" style="width:100%; height:220px; object-fit:cover;"></a>
                <div style="padding:20px; text-align:center;">
                    <h3 style="font-size:18px; margin:0; font-family:'Oswald', sans-serif;"><a href="programmes/${slug}.html" style="color:#333; text-decoration:none;">${title}</a></h3>
                </div>
            </div>`;
        });
    }
    block += `</div></div>`;
    sections.push(block);
});

const startTag = '<div class="container">';
const endTag = '</section>';
const startIdx = allHtml.indexOf(startTag) + startTag.length;
const endIdx = allHtml.indexOf(endTag, startIdx);
allHtml = allHtml.substring(0, startIdx) + '\n' + sections.join('\n') + '\n    </div>' + allHtml.substring(allHtml.lastIndexOf('</div>', endIdx));

fs.writeFileSync('all-programmes.html', allHtml);
console.log('Rebuilt all-programmes.html');
