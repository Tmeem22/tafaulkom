const fs = require('fs');
const path = 'src/app/dashboard/account/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Regex to find and remove the button with "اختبار الهدية"
const buttonRegex = /<button[\s\S]*?اختبار الهدية 🎁[\s\S]*?<\/button>/g;
content = content.replace(buttonRegex, '');

fs.writeFileSync(path, content);
console.log('Button removed successfully');
