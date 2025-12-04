const fs = require('fs');
const path = require('path');

const buildpacks = ['marketplace', 'booking', 'blog', 'chatbot', 'pos'];

function selectBuildpack(description) {
  description = description.toLowerCase();
  let selected = 'marketplace';
  if (description.includes('book')) selected = 'booking';
  else if (description.includes('blog')) selected = 'blog';
  else if (description.includes('chat')) selected = 'chatbot';
  else if (description.includes('pos') || description.includes('point of sale')) selected = 'pos';
  
  const templatePath = path.join(__dirname, 'buildpacks', `${selected}.json`);
  const template = fs.existsSync(templatePath) ? JSON.parse(fs.readFileSync(templatePath)) : null;

  return { selected, confidence: 0.9, reasoning: [`Selected ${selected} based on keywords`], template };
}

module.exports = { selectBuildpack };