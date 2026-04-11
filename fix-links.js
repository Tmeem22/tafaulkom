const fs = require('fs');

const dirs = [
  'src/app/dashboard/account/page.tsx',
  'src/app/dashboard/affiliate/page.tsx',
  'src/app/dashboard/analytics/page.tsx',
  'src/app/dashboard/cart/page.tsx',
  'src/app/dashboard/deposit/page.tsx',
  'src/app/dashboard/orders/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/points/page.tsx',
  'src/app/dashboard/support/page.tsx'
];

dirs.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const target = /{ label: 'التسويق بالعمولة', href: '\/dashboard\/affiliate', icon: 'https:\/\/img.icons8.com\/fluency\/256\/share.png'(, active: true)? },/g;
    const replacement = "$&\n  { label: 'صالة الألعاب', href: '/dashboard/games', icon: 'https://img.icons8.com/fluency/256/controller.png' },\n  { label: 'خزنتي والسلة', href: '/dashboard/inventory', icon: 'https://img.icons8.com/fluency/256/treasure-chest.png' },";
    
    if (!content.includes('/dashboard/games')) {
      content = content.replace(target, replacement);
      fs.writeFileSync(file, content, 'utf8');
    }
  }
});
console.log('Fixed sideLinks via Node safely!');
