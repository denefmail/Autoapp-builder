function deploySandbox(appName) {
  return {
    sandbox_url: `https://sandbox.mock/${appName}`,
    code_repo_url: `https://git.mock/${appName}`,
    deployment_status: 'success',
    smoke_tests_passed: true
  };
}

module.exports = { deploySandbox };