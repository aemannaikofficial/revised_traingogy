const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => (f.endsWith('-programmes.html') || f.endsWith('-programme.html')) && f !== 'all-programmes.html');

let allCategoriesHtml = [];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Extract title
    let titleMatch = content.match(/<h2[^>]*>(.*?)<\/h2>/);
    let title = titleMatch ? titleMatch[1] : '';
    if (!title || title === "Programme Categories") {
        // Try to get title from head
        let headTitleMatch = content.match(/<title>(.*?) -/);
        title = headTitleMatch ? headTitleMatch[1] : 'Unknown';
    }

    // Extract courses List
    const courseRegex = /<div class="course-card"[^>]*>[\s\S]*?<img src="([^"]+)" alt="([^"]+)"[\s\S]*?<h3[^>]*>[\s\S]*?<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/div>/g;
    
    let courses = [];
    let match;
    while ((match = courseRegex.exec(content)) !== null) {
        courses.push({
            imgSrc: match[1],
            alt: match[2],
            link: match[3],
            title: match[4]
        });
    }

    if (courses.length > 0) {
        let cardsHtml = courses.map(c => `
            <div class="course-card" style="background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.05); transition:transform 0.2s;">
                <a href="${file}">
                    <img src="${c.imgSrc}" alt="${c.alt}" style="width:100%; height:220px; object-fit:cover;">
                </a>
                <div style="padding:20px; text-align:center;">
                    <h3 style="font-size:18px; margin:0; font-family:'Oswald', sans-serif;"><a href="${file}" style="color:#333; text-decoration:none;">${c.title}</a></h3>
                </div>
            </div>
        `).join('');

        allCategoriesHtml.push(`
            <div class="category-block" style="margin-bottom: 60px;">
                <h2 style="font-size: 32px; color: #2D5DA7; margin-bottom: 30px; font-family: 'Oswald', sans-serif; border-bottom: 2px solid #CCFF00; padding-bottom: 10px; display: inline-block;">${title}</h2>
                <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px;">
                    ${cardsHtml}
                </div>
            </div>
        `);
    }
}

let allProgrammesContent = fs.readFileSync('all-programmes.html', 'utf8');

// Replace everything between <section class="all-programmes-section"> and </section>
const newSectionHtml = `
<section class="all-programmes-section" style="padding: 60px 20px; background: rgba(255,255,255,0.95); max-width: 1200px; margin: 40px auto; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
    <div class="container">
        ${allCategoriesHtml.join('')}
    </div>
</section>
`;

allProgrammesContent = allProgrammesContent.replace(/<section class="all-programmes-section">[\s\S]*?<\/section>/, newSectionHtml);

fs.writeFileSync('all-programmes.html', allProgrammesContent);
console.log("Updated all-programmes.html with all courses.");
