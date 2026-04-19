const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\PMLS\\Desktop\\traingogy-main\\traingogy-main';
const targetDir = 'c:\\Users\\PMLS\\Desktop\\revised Traingogy';

const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html') && f.includes('programme'));
if (!srcFiles.length) {
    console.log("No programme files found in source.");
}

const categoriesHtml = `
<div class="programmes-section" style="padding: 60px 20px; background-color: #f7fafc; text-align: center;">
    <h2 style="font-size: 32px; color: #2D5DA7; margin-bottom: 40px; font-family: 'Oswald', sans-serif;">Programme Categories</h2>
    <div class="categories-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; max-width: 1140px; margin: 0 auto;">
        <a href="marketing-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/3b0f8f145e3945f5858fae9cb6eca217.jpg" alt="Marketing" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Marketing</h3>
        </a>
        <a href="management-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/nsplsh_75c035620c1b4c9fa17b92acf9f382c4mv2-1.jpg" alt="Management" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Management</h3>
        </a>
        <a href="retailing-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/nsplsh_838b5c0886ee44ae8fd79bf060b7742fmv2.jpg" alt="Retailing" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Retailing</h3>
        </a>
        <a href="customer-service-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/nsplsh_4a6f42ab84f442d28e4fbdb835f98e1emv2-1.jpg" alt="Customer Service" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Customer Service</h3>
        </a>
        <a href="early-childhood-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/11062b_3214740e10c14a57915f9fd64011fad0mv2.jpg" alt="Early Childhood" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Early Childhood</h3>
        </a>
        <a href="human-resource-management-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/509f3b_d4924098b5fe4f7689bfe63309300f75mv2-1.jpg" alt="Human Resource Management" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Human Resource Management</h3>
        </a>
        <a href="logistics-purchasing-and-supply-chain-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/nsplsh_002d9a5110a1434982632801d969a414mv2-2.jpg" alt="Logistics, Purchasing and SCM" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Logistics, Purchasing and SCM</h3>
        </a>
        <a href="leadership-and-strategic-management-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/e1f88fe1ad0f4844b50abde26bfc0a45.jpg" alt="Leadership and Strategic Management" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Leadership and Strategic Management</h3>
        </a>
        <a href="islamic-trust-and-estate-management-programmes.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/509f3b_d1eac689b6f84fae8166ea4ac55572efmv2.jpeg" alt="Islamic Trust and Estate Management Programmes" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Islamic Trust and Estate Management Programmes</h3>
        </a>
        <a href="data-science-and-analytic-programme.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/509f3b_4185d39b91884de893259412ce4d4dbdmv2-1.jpg" alt="Data Science and Analytic" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Data Science and Analytic</h3>
        </a>
        <a href="accounting-and-finance-programme.html" class="category-card" style="text-decoration:none; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.07); display:block; transition:transform 0.2s;">
            <img src="images/509f3b_a6cfe42311ac4bce859a7bf8f1c54c40mv2-1.webp" alt="Accounting and Finance" style="width:100%; height:160px; object-fit:cover;">
            <h3 style="margin:0; padding:20px 15px; font-family:'Oswald', sans-serif; font-size:18px; color:#333;">Accounting and Finance</h3>
        </a>
    </div>
</div>
`;

srcFiles.forEach(file => {
    if (file === 'all-programmes.html') return;
    
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    
    // Extract title
    let titleMatch = content.match(/<h2 class="elementor-heading-title elementor-size-default">(.*?)<\/h2>/);
    let title = titleMatch ? titleMatch[1] : '';
    
    // Extract description
    let descMatch = content.match(/<div class="elementor-element elementor-element-[^"]+ elementor-widget elementor-widget-text-editor"[^>]*>\s*<div class="elementor-widget-container">\s*([\s\S]*?)\s*<\/div>/);
    let desc = descMatch ? descMatch[1].trim() : '';
    // Strip empty tags or weird elementor things
    desc = desc.replace(/<p>&nbsp;<\/p>/g, '').replace(/<span.*?>/g, '').replace(/<\/span>/g, '');

    // Extract courses List
    const courseRegex = /<article class="elementor-post [\s\S]*?<img [^>]*src="([^"]+)"[\s\S]*?<h3 class="elementor-post__title">\s*<a href="([^"]+)"[^>]*>\s*(.*?)\s*<\/a>[\s\S]*?<\/article>/g;
    
    let courses = [];
    let match;
    while ((match = courseRegex.exec(content)) !== null) {
        let imgSrc = match[1];
        let link = match[2];
        let courseTitle = match[3];
        
        // Convert paths
        let localImg = 'images/' + imgSrc.split('/').pop().replace(/-\d+x\d+(\.\w+)$/, '$1');
        // Let's just use the basename and .webp handling
        let imgName = imgSrc.split('/').pop();
        
        courses.push({
            title: courseTitle,
            link: link,
            img: 'images/' + imgName
        });
    }

    let cardsHtml = courses.map(c => `
        <div class="course-card" style="background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.05); transition:transform 0.2s;">
            <a href="#">
                <img src="${c.img}" alt="${c.title}" style="width:100%; height:220px; object-fit:cover;">
            </a>
            <div style="padding:20px; text-align:center;">
                <h3 style="font-size:18px; margin:0; font-family:'Oswald', sans-serif;"><a href="#" style="color:#333; text-decoration:none;">${c.title}</a></h3>
            </div>
        </div>
    `).join('');

    let newHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Traingogy</title>
    <link rel="icon" href="images/cropped-509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2-32x32.webp" sizes="32x32">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

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
</header>

<div class="content-section" style="background: #fff; padding: 70px 20px; text-align: center;">
    <h2 style="font-size: 38px; color: #32373c; font-family: 'Oswald', sans-serif;">${title}</h2>
    <div style="max-width: 800px; margin: 0 auto; color: #7A7A7A; font-family: 'Questrial', sans-serif; font-size: 17px; line-height: 1.8;">
        ${desc}
    </div>
</div>

<div class="courses-section" style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 60px 20px;">
    <div class="courses-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1140px; margin: 0 auto;">
        ${cardsHtml}
    </div>
</div>

${categoriesHtml}

<footer class="site-footer">
    <img src="images/509f3b_feb28b364d7c48fda5c8f7cb95e32ad1mv2.webp" alt="Traingogy Logo">
    <p>© 2024 Traingogy All Rights Reserved</p>
</footer>
<script src="js/main.js"></script>
</body>
</html>
`;
    // Only write if title was found (meaning it's a valid programme page)
    if (title) {
        fs.writeFileSync(path.join(targetDir, file), newHtml);
        console.log("Rebuilt: " + file);
    }
});
