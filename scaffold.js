function scaffoldApp(spec) {
  const features = spec.essential_features.concat(spec.optional_features);
  return {
    repo_url: `https://git.mock/${spec.app_name}`,
    status: 'scaffolded',
    features,
    screens: spec.screens,
    models: spec.data_models
  };
}

module.exports = { scaffoldApp };