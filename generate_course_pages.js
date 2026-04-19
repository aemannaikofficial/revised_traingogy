const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('course_data.json', 'utf8'));

// Find a good local image for the course based on slug
function findLocalImage(slug, title) {
    const imgDir = 'images';
    const files = fs.readdirSync(imgDir);
    
    // Try to match by slug keywords
    const keywords = slug.toLowerCase().replace(/-/g, ' ').split(' ');
    for (const file of files) {
        const lname = file.toLowerCase();
        // Skip tiny icons
        if (lname.includes('32x32') || lname.includes('logo') || lname.includes('cropped')) continue;
        // Check for keyword matches
        for (const kw of keywords) {
            if (kw.length > 4 && lname.includes(kw) && (lname.includes('300') || lname.includes('244'))) {
                return `images/${file}`;
            }
        }
    }
    // Fallback: look for the main thumbnail
    for (const file of files) {
        const lname = file.toLowerCase();
        if (lname.includes('32x32') || lname.includes('logo') || lname.includes('cropped')) continue;
        for (const kw of keywords) {
            if (kw.length > 4 && lname.includes(kw)) {
                return `images/${file}`;
            }
        }
    }
    return 'images/Traingogy-logo.webp';
}

// Break long text into paragraphs (split on caps + full sentence patterns)
function formatDescription(raw) {
    if (!raw) return '';
    // Unescape HTML entities
    raw = raw.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").trim();
    
    // Split on section headings like "PROGRAMME AIMS", "PROGRAMME STRUCTURE", etc.
    const sections = raw.split(/\b([A-Z][A-Z ]{5,})\b/g);
    
    let html = '';
    let i = 0;
    while (i < sections.length) {
        const part = sections[i].trim();
        if (!part) { i++; continue; }
        
        // If part looks like a heading (all caps, short-ish)
        if (/^[A-Z][A-Z\s\/&]{4,}$/.test(part) && part.length < 60) {
            html += `<h3 style="font-size: 20px; color: #2D5DA7; margin: 28px 0 10px; font-family: 'Oswald', sans-serif; border-left: 4px solid #CCFF00; padding-left: 12px;">${part}</h3>`;
        } else {
            // Split into sentences for paragraphing
            const sentences = part.split(/(?<=[.!?])\s+/);
            let para = '';
            for (const s of sentences) {
                para += s + ' ';
                if (para.length > 300) {
                    html += `<p style="margin-bottom: 16px; color: #4a4a4a;">${para.trim()}</p>`;
                    para = '';
                }
            }
            if (para.trim().length > 0) {
                html += `<p style="margin-bottom: 16px; color: #4a4a4a;">${para.trim()}</p>`;
            }
        }
        i++;
    }
    return html;
}

const navHtml = (backHref, backLabel) => `
<header class="site-header">
    <div class="header-inner">
        <div class="header-logo">
            <a href="index.html"><img src="images/Traingogy-logo.webp" alt="Traingogy Logo" width="200" height="33"></a>
        </div>
        <button class="menu-toggle" aria-label="Open menu" id="menuToggle">
            <span></span><span></span><span></span>
        </button>
        <ul class="main-nav" id="mainNav">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="all-programmes.html" class="active">Programmes</a></li>
            <li><a href="faqs.html">FAQs</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
        <div class="header-action"><a href="login.html" class="btn-header-login">Login</a></div>
    </div>
</header>`;

const footerHtml = `
<footer class="site-footer">
    <img src="images/509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2.webp" alt="Traingogy Logo">
    <p>&copy; 2024 Traingogy All Rights Reserved</p>
</footer>
<script src="js/main.js?v=2"></script>`;

let generatedCount = 0;
const outputDir = 'programmes';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

for (const [slug, course] of Object.entries(data)) {
    const title = course.title || slug;
    const localImg = findLocalImage(slug, title);
    const backPage = course.category_page || 'all-programmes.html';
    const backLabel = backPage.replace(/-/g, ' ').replace('.html', '');
    
    // Build description HTML
    let descHtml = '';
    for (const block of (course.description || [])) {
        if (block && !block.includes('casino') && !block.includes('bingo')) {
            descHtml += formatDescription(block);
        }
    }
    
    // Build list items if description is thin
    if (descHtml.length < 200 && course.lists) {
        for (const list of course.lists) {
            const items = list.filter(i => i && !i.toLowerCase().includes('casino') && i.length > 3);
            if (items.length > 2) {
                descHtml += `<ul style="padding-left: 24px; margin-bottom: 20px; color: #4a4a4a;">${items.map(i => `<li style="margin-bottom: 8px;">${i}</li>`).join('')}</ul>`;
            }
        }
    }
    
    if (!descHtml) {
        descHtml = `<p style="color:#4a4a4a;">This programme is designed to provide learners with comprehensive knowledge and practical skills in ${title.replace('Executive Diploma in','').replace('Professional Diploma in','').replace('Professional Certificate in','').trim()}. Join Traingogy's flexible online learning and earn a recognised qualification at your own pace.</p>`;
    }
    
    const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Traingogy</title>
    <meta name="description" content="Learn about the ${title} programme offered by Traingogy UK. Flexible online learning with recognised qualifications.">
    <link rel="icon" href="images/cropped-509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2-32x32.webp" sizes="32x32">
    <link rel="stylesheet" href="css/style.css?v=2">
    <style>
        body { background: url('images/programme-bg.webp') no-repeat center center fixed; background-size: cover; }
        .course-detail-wrap { max-width: 1000px; margin: 40px auto 60px; background: #fff; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.13); overflow: hidden; }
        .course-hero { position: relative; height: 340px; overflow: hidden; background: #1a3a6e; }
        .course-hero img { width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
        .course-hero-title { position: absolute; bottom: 0; left: 0; right: 0; padding: 30px 40px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: #fff; }
        .course-hero-title h1 { font-family: 'Oswald', sans-serif; font-size: 36px; margin: 0; line-height: 1.2; }
        .course-breadcrumb { font-size: 14px; margin-bottom: 8px; opacity: 0.85; }
        .course-breadcrumb a { color: #CCFF00; text-decoration: none; }
        .course-body { padding: 50px 50px 60px; font-family: 'Questrial', sans-serif; font-size: 17px; line-height: 1.85; }
        .enrol-btn { display: inline-block; margin-top: 30px; background: #2D5DA7; color: #fff; padding: 14px 40px; border-radius: 4px; font-family: 'Oswald', sans-serif; font-size: 18px; text-decoration: none; letter-spacing: 0.5px; transition: background 0.2s; }
        .enrol-btn:hover { background: #1a3a6e; }
        @media (max-width: 768px) {
            .course-body { padding: 30px 20px; }
            .course-hero-title h1 { font-size: 24px; }
        }
    </style>
</head>
<body>

${navHtml(backPage, backLabel)}

<div class="course-detail-wrap">
    <div class="course-hero">
        <img src="${localImg}" alt="${title}">
        <div class="course-hero-title">
            <div class="course-breadcrumb">
                <a href="${backPage}">&larr; Back to Programmes</a>
            </div>
            <h1>${title}</h1>
        </div>
    </div>
    <div class="course-body">
        ${descHtml}
        <a href="contact.html" class="enrol-btn">Enquire / Enrol Now</a>
    </div>
</div>

${footerHtml}
</body>
</html>`;

    const outFile = path.join(outputDir, `${slug}.html`);
    fs.writeFileSync(outFile, pageHtml);
    generatedCount++;
    console.log(`Generated: ${outFile}`);
}

console.log(`\nTotal pages generated: ${generatedCount}`);
console.log('\nNow updating course card links in category pages...');

// Update all course card links in category pages to point to the new detail pages
const categoryFiles = fs.readdirSync('.').filter(f => f.endsWith('-programmes.html') || f.endsWith('-programme.html'));

for (const catFile of categoryFiles) {
    let content = fs.readFileSync(catFile, 'utf8');
    
    for (const [slug, course] of Object.entries(data)) {
        const title = course.title.replace(/&amp;/g, '&').replace(/&#8217;/g, "'");
        const newHref = `programmes/${slug}.html`;
        
        // Replace href="#" or original live URLs for this course title in the file
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Match cards that have this course title and update their hrefs
        // Pattern: href="[something]" ... title or href="#"
        content = content.replace(
            new RegExp(`href="[^"]*"([^>]*)>\\s*${escapedTitle}\\s*</a>`, 'g'),
            `href="${newHref}"$1>${title}</a>`
        );
        
        // Also fix the image link wrapping the course card
        content = content.replace(
            new RegExp(`(<a href="[^"]*">\\s*<img[^>]+alt="${escapedTitle}"[^>]*>\\s*</a>)`, 'g'),
            (match) => match.replace(/href="[^"]*"/, `href="${newHref}"`)
        );
    }
    
    fs.writeFileSync(catFile, content);
    console.log(`Updated links in: ${catFile}`);
}

// Also update all-programmes.html  
let allProg = fs.readFileSync('all-programmes.html', 'utf8');
for (const [slug, course] of Object.entries(data)) {
    const title = course.title.replace(/&amp;/g, '&').replace(/&#8217;/g, "'");
    const newHref = `programmes/${slug}.html`;
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    allProg = allProg.replace(
        new RegExp(`href="[^"]*"([^>]*)>\\s*${escapedTitle}\\s*</a>`, 'g'),
        `href="${newHref}"$1>${title}</a>`
    );
    allProg = allProg.replace(
        new RegExp(`(<a href="[^"]*">\\s*<img[^>]+alt="${escapedTitle}"[^>]*>\\s*</a>)`, 'g'),
        (match) => match.replace(/href="[^"]*"/, `href="${newHref}"`)
    );
}
fs.writeFileSync('all-programmes.html', allProg);
console.log('Updated links in: all-programmes.html');

console.log('\nAll done!');
