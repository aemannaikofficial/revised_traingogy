const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('course_data.json', 'utf8'));

// Map: slug -> {price, duration, cert image, category img}
const courseExtras = {
    "executive-diploma-in-marketing":             { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Marketing.webp", thumb: "marketing-management.webp" },
    "executive-diploma-in-marketing-management":  { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Marketing-Management.webp", thumb: "Executive-Diploma-in-Marketing-Management.webp" },
    "executive-diploma-in-integrated-marketing-communication": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Integrated-Marketing-Communications.png", thumb: "integrated-marketing.webp" },
    "executive-diploma-in-logistics-management":  { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Logistics-Management.webp", thumb: "logistics-1.webp" },
    "executive-diploma-in-purchasing-supply-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Purchasing-Supply.webp", thumb: "purchasing-supply-chain-1.webp" },
    "executive-diploma-in-inventory-warehousing": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Inventory-and-Warehousing.webp", thumb: "inventory-warehousing.webp" },
    "executive-diploma-in-supply-chain-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Supply-Chain-Management.webp", thumb: "supply-chain-management-1.webp" },
    "executive-diploma-in-management":            { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Management.webp", thumb: "diploma-management.webp" },
    "executive-diploma-in-operations-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Operations-Management-1.webp", thumb: "operations-management-1-1.webp" },
    "executive-diploma-in-human-resource-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Human-Capital-Management.webp", thumb: "human-resource-management.webp" },
    "executive-diploma-in-human-capital-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Human-Capital-Management.webp", thumb: "human-capital-management.webp" },
    "executive-diploma-in-leadership-and-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Leadership-and-Management.webp", thumb: "Executive-Diploma-in-Leadership-and-Management.webp" },
    "executive-diploma-in-advanced-leadership-and-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Advanced-Leadership-and-Management.webp", thumb: "Executive-Diploma-in-Advanced-Leadership-and-Management.webp" },
    "executive-diploma-in-strategic-management":  { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Strategic-Management.webp", thumb: "strategic-management.webp" },
    "executive-diploma-in-retail-management":     { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Retail-Management.webp", thumb: "retail-management-1.webp" },
    "professional-certificate-in-new-retail-strategy": { price: "£200", duration: "6 Months", certImg: "Professional-Certificate-in-New-Retail-Management.webp", thumb: "new-retail-marketing-1.webp" },
    "executive-diploma-in-early-childhood-development": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Early-Childhood-Development.webp", thumb: "early-childhood.webp" },
    "executive-diploma-in-early-childhood-education-practice": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Early-Childhood-Practice.webp", thumb: "early-childhood2.webp" },
    "executive-diploma-in-customer-service-management": { price: "£200", duration: "6 Months", certImg: "Executive-Diploma-in-Customer-Service-Management.webp", thumb: "customer-service-management.webp" },
    "professional-diploma-in-islamic-conventional-trust-management": { price: "£200", duration: "6 Months", certImg: "Professional-Diploma-in-Islamic-Conventional-Trust-Management.webp", thumb: "Professional-Diploma-in-Islamic-Conventional-Trust-Management.webp" },
    "professional-diploma-in-islamic-conventional-estate-planning-asset-protection": { price: "£200", duration: "6 Months", certImg: "Professional-Diploma-in-Islamic-Conventional-Estate-Planning.webp", thumb: "Professional-Diploma-in-Islamic-Conventional-Estate-Planning.webp" },
    "level-2-certificate-in-bookkeeping":        { price: "£200", duration: "6 Months", certImg: "Copy-of-This-is-to-certify-that-2.png", thumb: "international-finance_0.webp" },
};

const categoriesSidebar = `
<h3 style="font-family:'Oswald',sans-serif;font-size:18px;color:#fff;background:#2D5DA7;padding:14px 20px;margin:0 0 0 0;letter-spacing:0.5px;text-transform:uppercase;">Programme Category</h3>
<ul style="list-style:none;padding:0;margin:0;border:1px solid #e2e8f0;border-top:none;">
    <li style="border-bottom:1px solid #e8edf2;"><a href="../marketing-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;transition:background 0.2s;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Marketing</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Management</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../retailing-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Retailing</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../customer-service-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Customer Service</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../early-childhood-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Early Childhood</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../human-resource-management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Human Resource Management</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../logistics-purchasing-and-supply-chain-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Logistics, Purchasing and SCM</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../leadership-and-strategic-management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Leadership and Strategic Management</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../islamic-trust-and-estate-management-programmes.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Islamic Trust and Estate Management</a></li>
    <li style="border-bottom:1px solid #e8edf2;"><a href="../data-science-and-analytic-programme.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Data Science and Analytic</a></li>
    <li><a href="../accounting-and-finance-programme.html" style="display:block;padding:12px 20px;color:#333;text-decoration:none;font-family:'Questrial',sans-serif;font-size:15px;" onmouseover="this.style.background='#f0f4f8'" onmouseout="this.style.background=''">Accounting and Finance</a></li>
</ul>`;

function extractRawContent(raw) {
    // Strip spam
    raw = raw.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'").replace(/&hellip;/g, '...').replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"');
    
    // Remove navigation-like junk at start (before PROGRAMME AIMS)
    const aimIdx = raw.indexOf('PROGRAMME AIMS');
    if (aimIdx > 0) raw = raw.substring(aimIdx);
    
    // Split into heading/paragraph sections preserving structure
    // Section headings are ALL CAPS words at word boundary
    const sectionPattern = /\b(PROGRAMME AIMS|PROGRAMME STRUCTURE|DELIVERY MODE|ADMISSION CRITERIA|ASSESSMENT STRUCTURE|UNIT SPECIFICATION|PROGRAMME OVERVIEW|PROGRAMME CONTENT|KEY FEATURES|ENTRY REQUIREMENTS|LEARNING OUTCOMES|TOPICS COVERED|COURSE CONTENT|ASSESSMENT|OBJECTIVES|OVERVIEW)\b/g;
    
    let parts = raw.split(sectionPattern);
    let html = '';
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part) continue;
        
        // Check if it's a heading
        if (/^[A-Z][A-Z\s\/]{4,}$/.test(part) && part.length < 60) {
            html += `<h2>${part}</h2>\n`;
        } else {
            // Process content lines
            const lines = part.split(/(?:\.\s+|\n)/).filter(l => l.trim().length > 2);
            let inList = false;
            for (const line of lines) {
                const t = line.trim();
                if (!t) continue;
                
                // Check if it looks like a list item (short, no period)
                const isBullet = t.length < 120 && !t.includes('. ') && lines.length > 3 && i > 0;
                
                if (isBullet && !inList) {
                    // Don't auto-bullet paragraphs
                    html += `<p>${t}.</p>\n`;
                } else {
                    html += `<p>${t}.</p>\n`;
                }
            }
        }
    }
    
    return html || `<p>${raw.substring(0, 1000)}</p>`;
}

// Better approach: directly use the scraped description text after cleaning
function buildContentHtml(course) {
    let html = '';
    for (const block of (course.description || [])) {
        if (!block || block.toLowerCase().includes('casino') || block.toLowerCase().includes('bingo')) continue;
        
        const clean = block
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&#8217;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#039;/g, "'")
            .replace(/&hellip;/g, '...')
            .replace(/\uFFFD/g, '');
        
        // Skip navigation blocks
        if (/^(Marketing|Management|Retailing|Customer|Early Childhood|Human Resource|Logistics|Leadership|Education and Tesol)\s*$/.test(clean.trim())) continue;
        
        // Find if starts with PROGRAMME AIMS etc
        const aimIdx = clean.indexOf('PROGRAMME AIMS');
        const useFrom = aimIdx >= 0 ? clean.substring(aimIdx) : clean;
        
        // Split by all-caps section headers
        const sections = useFrom.split(/(?=\b(?:PROGRAMME AIMS|PROGRAMME STRUCTURE|DELIVERY MODE|ADMISSION CRITERIA|ASSESSMENT STRUCTURE|UNIT SPECIFICATION|PROGRAMME OVERVIEW|PROGRAMME CATEGORY|MODE [AB]:)\b)/);
        
        for (const section of sections) {
            const trimmed = section.trim();
            if (!trimmed || trimmed.toLowerCase().includes('casino')) continue;
            
            // First line is heading if ALL CAPS
            const firstNewline = trimmed.search(/\s{2,}|(?<=[A-Z])\s(?=[A-Z][\w])/);
            const potentialHeading = trimmed.substring(0, 50);
            
            if (/^[A-Z][A-Z\s\/&]{4,}(?:\s|$)/.test(potentialHeading)) {
                // Extract heading and rest
                const match = trimmed.match(/^([A-Z][A-Z\s\/&:]+?)(?:\s{2,}|(?=\s[A-Za-z]))([\s\S]*)$/);
                if (match) {
                    html += `<h2>${match[1].trim()}</h2>\n`;
                    const body = match[2].trim();
                    if (body) html += formatBody(body);
                } else {
                    html += formatBody(trimmed);
                }
            } else {
                html += formatBody(trimmed);
            }
        }
    }
    
    return html || `<p>This programme is designed to equip learners with the knowledge and skills required for professional advancement. Contact us to find out more.</p>`;
}

function formatBody(text) {
    let html = '';
    // Split on double space or sentence breaks
    const sentences = text.split(/\.\s+/);
    let para = '';
    for (const s of sentences) {
        if (!s.trim()) continue;
        para += s.trim() + '. ';
        if (para.length > 250) {
            html += `<p>${para.trim()}</p>\n`;
            para = '';
        }
    }
    if (para.trim().length > 5) html += `<p>${para.trim()}</p>\n`;
    return html || `<p>${text}</p>\n`;
}

const navHtml = `<header class="site-header">
    <div class="header-inner">
        <div class="header-logo">
            <a href="../index.html"><img src="../images/Traingogy-logo.webp" alt="Traingogy Logo" width="200" height="33"></a>
        </div>
        <button class="menu-toggle" aria-label="Open menu" id="menuToggle">
            <span></span><span></span><span></span>
        </button>
        <ul class="main-nav" id="mainNav">
            <li><a href="../index.html">Home</a></li>
            <li><a href="../about.html">About</a></li>
            <li><a href="../all-programmes.html" class="active">Programmes</a></li>
            <li><a href="../faqs.html">FAQs</a></li>
            <li><a href="../contact.html">Contact</a></li>
        </ul>
        <div class="header-action"><a href="../login.html" class="btn-header-login">Login</a></div>
    </div>
</header>`;

const dir = 'programmes';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

let count = 0;
for (const [slug, course] of Object.entries(data)) {
    const extras = courseExtras[slug] || { price: '£200', duration: '6 Months', certImg: '', thumb: 'Traingogy-logo.webp' };
    const title = course.title.replace(/&amp;/g, '&').replace(/&#8217;/g, "'");
    const backPage = course.category_page || 'all-programmes.html';
    
    const certImgPath = extras.certImg ? `../images/${extras.certImg}` : '';
    const thumbPath = `../images/${extras.thumb}`;
    const contentHtml = buildContentHtml(course);
    
    const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Traingogy</title>
    <meta name="description" content="Learn about the ${title} programme offered by Traingogy UK. Flexible online learning with recognised qualifications.">
    <link rel="icon" href="../images/cropped-509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2-32x32.webp" sizes="32x32">
    <link rel="stylesheet" href="../css/style.css?v=2">
    <style>
        body { background: #f0f4f8; }

        .course-page-wrapper {
            max-width: 1140px;
            margin: 0 auto;
            padding: 40px 20px 60px;
        }

        /* Hero banner - course thumbnail full-width with title overlay */
        .course-hero-banner {
            width: 100%;
            height: 320px;
            position: relative;
            overflow: hidden;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
        }
        .course-hero-banner img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .course-hero-banner-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 30px 40px;
        }
        .course-hero-banner-overlay h1 {
            font-family: 'Oswald', sans-serif;
            font-size: 38px;
            color: #fff;
            margin: 0 0 8px;
            line-height: 1.2;
        }
        .breadcrumb-bar {
            font-size: 14px;
            color: rgba(255,255,255,0.85);
        }
        .breadcrumb-bar a {
            color: #CCFF00;
            text-decoration: none;
        }
        .breadcrumb-bar a:hover { text-decoration: underline; }

        /* Layout: sidebar + content */
        .course-layout {
            display: flex;
            gap: 30px;
            background: #fff;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.10);
            padding: 0;
            overflow: hidden;
        }

        /* LEFT SIDEBAR */
        .course-sidebar {
            width: 280px;
            flex-shrink: 0;
            background: #fff;
            border-right: 1px solid #e8edf2;
            padding: 30px 0 30px;
        }
        .sidebar-info-block {
            padding: 0 20px 25px;
            border-bottom: 1px solid #e8edf2;
            margin-bottom: 20px;
        }
        .sidebar-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
        }
        .sidebar-info-row .label {
            font-family: 'Questrial', sans-serif;
            font-size: 14px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .sidebar-info-row .value {
            font-family: 'Oswald', sans-serif;
            font-size: 22px;
            color: #2D5DA7;
            font-weight: 600;
        }
        .sidebar-info-row .value.duration {
            font-size: 16px;
            color: #333;
        }
        .sidebar-enrol-btn {
            display: block;
            width: calc(100% - 40px);
            margin: 0 20px 25px;
            background: #2D5DA7;
            color: #fff;
            text-align: center;
            padding: 14px 0;
            font-family: 'Oswald', sans-serif;
            font-size: 17px;
            letter-spacing: 0.5px;
            text-decoration: none;
            border-radius: 4px;
            transition: background 0.2s;
        }
        .sidebar-enrol-btn:hover { background: #1a3a6e; }

        .sidebar-cert-block {
            padding: 0 20px 25px;
            border-bottom: 1px solid #e8edf2;
            margin-bottom: 0;
        }
        .sidebar-cert-block h4 {
            font-family: 'Oswald', sans-serif;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #888;
            margin: 0 0 10px;
        }
        .sidebar-cert-block img {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        /* RIGHT CONTENT */
        .course-content {
            flex: 1;
            padding: 40px 40px 50px;
            font-family: 'Questrial', sans-serif;
            font-size: 17px;
            line-height: 1.9;
            color: #4a4a4a;
        }
        .course-content h2 {
            font-family: 'Oswald', sans-serif;
            font-size: 22px;
            color: #2D5DA7;
            margin: 32px 0 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #CCFF00;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .course-content h2:first-child { margin-top: 0; }
        .course-content p { margin: 0 0 16px; }
        .course-content ul, .course-content ol {
            padding-left: 24px;
            margin: 0 0 16px;
        }
        .course-content li { margin-bottom: 6px; }
        .course-content strong { color: #333; font-weight: 600; }

        @media (max-width: 768px) {
            .course-layout { flex-direction: column; }
            .course-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e8edf2; }
            .course-hero-banner { height: 220px; }
            .course-hero-banner-overlay h1 { font-size: 24px; }
            .course-content { padding: 25px 20px; }
        }
    </style>
</head>
<body>

${navHtml}

<div class="course-page-wrapper">
    <!-- Hero Banner -->
    <div class="course-hero-banner">
        <img src="${thumbPath}" alt="${title}">
        <div class="course-hero-banner-overlay">
            <div class="breadcrumb-bar">
                <a href="../all-programmes.html">Programmes</a> &rsaquo; <a href="../${backPage}">${backPage.replace(/-/g,' ').replace('.html','')}</a> &rsaquo; ${title}
            </div>
            <h1>${title}</h1>
        </div>
    </div>

    <!-- 2‑column layout -->
    <div class="course-layout">
        <!-- LEFT SIDEBAR -->
        <aside class="course-sidebar">
            <div class="sidebar-info-block">
                <div class="sidebar-info-row">
                    <span class="label">Price</span>
                    <span class="value">${extras.price}</span>
                </div>
                <div class="sidebar-info-row">
                    <span class="label">Duration</span>
                    <span class="value duration">${extras.duration}</span>
                </div>
            </div>

            <a href="../contact.html" class="sidebar-enrol-btn">Enquire / Enrol</a>

            ${certImgPath ? `
            <div class="sidebar-cert-block">
                <h4>Sample Certificate</h4>
                <img src="${certImgPath}" alt="Sample Certificate for ${title}">
            </div>` : ''}

            ${categoriesSidebar}
        </aside>

        <!-- RIGHT CONTENT -->
        <main class="course-content">
            ${contentHtml}
        </main>
    </div>
</div>

<footer class="site-footer">
    <img src="../images/509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2.webp" alt="Traingogy Logo">
    <p>&copy; 2024 Traingogy All Rights Reserved</p>
</footer>
<script src="../js/main.js?v=2"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(dir, `${slug}.html`), pageHtml);
    count++;
    console.log(`Generated: ${slug}.html`);
}

console.log(`\nTotal: ${count} pages rebuilt.`);
