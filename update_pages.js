const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\PMLS\\Desktop\\revised Traingogy';

const categoryHtml = `
<section class="programme-categories" style="padding: 60px 20px; background-color: #f7fafc; text-align: center;">
    <h2 style="font-size: 32px; color: #2D5DA7; margin-bottom: 40px;">Programme Categories</h2>
    <div class="categories-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto;">
        <a href="marketing-programmes.html" class="category-card">
            <img src="images/3b0f8f145e3945f5858fae9cb6eca217.jpg" alt="Marketing">
            <h3>Marketing</h3>
        </a>
        <a href="management-programmes.html" class="category-card">
            <img src="images/nsplsh_75c035620c1b4c9fa17b92acf9f382c4mv2-1.jpg" alt="Management">
            <h3>Management</h3>
        </a>
        <a href="retailing-programmes.html" class="category-card">
            <img src="images/nsplsh_838b5c0886ee44ae8fd79bf060b7742fmv2.jpg" alt="Retailing">
            <h3>Retailing</h3>
        </a>
        <a href="customer-service-programmes.html" class="category-card">
            <img src="images/nsplsh_4a6f42ab84f442d28e4fbdb835f98e1emv2-1.jpg" alt="Customer Service">
            <h3>Customer Service</h3>
        </a>
        <a href="early-childhood-programmes.html" class="category-card">
            <img src="images/11062b_3214740e10c14a57915f9fd64011fad0mv2.jpg" alt="Early Childhood">
            <h3>Early Childhood</h3>
        </a>
        <a href="human-resource-management-programmes.html" class="category-card">
            <img src="images/509f3b_d4924098b5fe4f7689bfe63309300f75mv2-1.jpg" alt="Human Resource Management">
            <h3>Human Resource Management</h3>
        </a>
        <a href="logistics-purchasing-and-supply-chain-programmes.html" class="category-card">
            <img src="images/nsplsh_002d9a5110a1434982632801d969a414mv2-2.jpg" alt="Logistics, Purchasing and SCM">
            <h3>Logistics, Purchasing and SCM</h3>
        </a>
        <a href="leadership-and-strategic-management-programmes.html" class="category-card">
            <img src="images/e1f88fe1ad0f4844b50abde26bfc0a45.jpg" alt="Leadership and Strategic Management">
            <h3>Leadership and Strategic Management</h3>
        </a>
        <a href="islamic-trust-and-estate-management-programmes.html" class="category-card">
            <img src="images/509f3b_d1eac689b6f84fae8166ea4ac55572efmv2.jpeg" alt="Islamic Trust and Estate Management Programmes">
            <h3>Islamic Trust and Estate Management Programmes</h3>
        </a>
        <a href="data-science-and-analytic-programme.html" class="category-card">
            <img src="images/509f3b_4185d39b91884de893259412ce4d4dbdmv2-1.jpg" alt="Data Science and Analytic">
            <h3>Data Science and Analytic</h3>
        </a>
        <a href="accounting-and-finance-programme.html" class="category-card">
            <img src="images/509f3b_a6cfe42311ac4bce859a7bf8f1c54c40mv2-1.webp" alt="Accounting and Finance">
            <h3>Accounting and Finance</h3>
        </a>
    </div>
</section>
`;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');

    // 1. Fix the header to have a distinct login button
    const oldHeader = `<li><a href="login.html" class="btn-login">Login</a></li>`;
    const oldHeaderActive = `<li><a href="login.html" class="btn-login active">Login</a></li>`;
    
    // We will change the menu so it drops the li wrapper around login, 
    // or keep it but style it better. Let's just remove it and add a div outside the ul.
    let newHeaderContent = content.replace(
        /<ul class="main-nav" id="mainNav">([\s\S]*?)<li><a href="login.html" class="btn-login.*?>Login<\/a><\/li>([\s\S]*?)<\/ul>/,
        '<ul class="main-nav" id="mainNav">$1$2</ul>\n        <div class="header-action"><a href="login.html" class="btn-header-login">Login</a></div>'
    );
    
    // Fallback if the regex missed it
    if(newHeaderContent === content && content.includes('btn-login')) {
        newHeaderContent = content.replace(/<li><a href="login.html" class="btn-login.*?">Login<\/a><\/li>/, '');
        newHeaderContent = newHeaderContent.replace(/<\/ul>/, '</ul>\n        <div class="header-action"><a href="login.html" class="btn-header-login">Login</a></div>');
    }
    content = newHeaderContent;

    // 2. Append categories to programme pages
    if (file.includes('programme') && file !== 'all-programmes.html') {
        if(!content.includes('programme-categories')) {
            content = content.replace('</section>\n\n<footer', '</section>\n' + categoryHtml + '\n<footer');
        }
    }

    fs.writeFileSync(path.join(dir, file), content);
});

console.log("HTML files updated successfully.");
