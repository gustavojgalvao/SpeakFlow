const fs = require('fs');
let html = fs.readFileSync('e:\\\\Projetos\\\\SpeakFlow\\\\index.html', 'utf8');

// Store hero section to prevent removing its gsap-reveal
const heroMatch = html.match(/<section class="hero"[\\s\\S]*?<\/section>/);
if (heroMatch) {
    html = html.replace(heroMatch[0], heroMatch[0].replace(/gsap-reveal/g, 'HERO_REVEAL_TEMP'));
}

// Remove all other gsap-reveal
html = html.replace(/ gsap-reveal/g, '');
html = html.replace(/HERO_REVEAL_TEMP/g, 'gsap-reveal');

// Remove emojis
html = html.replace(/?? /g, '');
html = html.replace(/?? /g, '');

// Fix footer
html = html.replace(/Aulas de inglês particular em Camaçari, BA e online para todo o Brasil\./g, 'Aulas particulares de inglês com a professora Anna Luíza. Online para todo o Brasil, presenciais em Camaçari, BA, ou híbridas.');

fs.writeFileSync('e:\\\\Projetos\\\\SpeakFlow\\\\index.html', html);
console.log('Cleanup successful');
