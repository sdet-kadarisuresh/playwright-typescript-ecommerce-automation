const fs = require('node:fs');
const path = require('node:path');

const resultsDir = path.resolve('allure-results');

fs.mkdirSync(resultsDir, { recursive: true });

const isCI = process.env.CI === 'true';

const environment = [
  'Project=Playwright TypeScript E-commerce Automation',
  'Application=SauceDemo',
  'Test_Framework=Playwright',
  `Execution_Environment=${isCI ? 'GitHub Actions' : 'Local'}`,
  `Operating_System=${process.platform}`,
  `Node_Version=${process.version}`,
  `CI=${isCI}`,
].join('\n') + '\n';

fs.writeFileSync(
  path.join(resultsDir, 'environment.properties'),
  environment,
  'utf8'
);

console.log('Allure environment metadata generated.');
console.log(environment);