const fs = require('fs');
const path = require('path');

async function generateSpec(description, buildpack) {
  const base = {
    app_name: buildpack + 'App',
    app_type: buildpack,
    primary_function: description,
    essential_features: [],
    optional_features: [],
    screens: [],
    data_models: [],
    integrations: [],
    security_considerations: ['HTTPS', 'input validation'],
    feature_toggles: {},
    decision_trace: []
  };

  const templatePath = path.join(__dirname, 'buildpacks', `${buildpack}.json`);
  if (fs.existsSync(templatePath)) {
    const tpl = JSON.parse(fs.readFileSync(templatePath));
    base.screens = tpl.screens;
    base.data_models = tpl.models.map(m => ({ name: m, fields: [] }));
    base.essential_features = tpl.essential_features;
  }

  const opt = [];
  if (description.includes('rating') || description.includes('review')) opt.push('ratings_reviews');
  if (description.includes('wishlist')) opt.push('wishlist');
  if (description.includes('notifications')) opt.push('push_notifications');
  base.optional_features = opt;

  base.decision_trace.push(`Loaded template for ${buildpack}`);
  if (opt.length) base.decision_trace.push(`Added optional features: ${opt.join(', ')}`);

  return base;
}

module.exports = { generateSpec };