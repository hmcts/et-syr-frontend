const frontend = process.env.TEST_URL || 'http://localhost:3003';
const { I } = inject();
Feature('Health');

Scenario('The API is up, healthy and responding to requests to /health', () => {
  I.amOnPage(frontend + '/health');
  I.retry({
    minTimeout: 15000,
    maxTimeout: 15000,
  }).see('"status":"UP"');
});
