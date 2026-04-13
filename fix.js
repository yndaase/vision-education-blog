const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update the About link
html = html.replace(
  /<a href="#" class=\"text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer\">About<\/a>/g,
  '<a href="about.html" class="text-navy hover:text-vibrantBlue font-semibold text-sm transition-colors cursor-pointer">About</a>'
);

// Remove the Detailed Content Section (from <!-- Detailed Content Section --> to <!-- Footer -->)
html = html.replace(/<!-- Detailed Content Section -->[\s\S]*?<!-- Footer -->/m, '<!-- Footer -->');

fs.writeFileSync('index.html', html);
console.log('Successfully updated index.html');
