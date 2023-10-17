const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('creates.create_person', () => {
  it('should run', async () => {
    const bundle = {
      authData: {apiKey: process.env.ZAPIER_TEST_VALID_API_KEY},
      inputData: {firstName: "John", lastName: "Doe", email: "johndoe@gmail.com", phone: "+33610203040", city: "Paris"},
    };
    const results = await appTester(
      App.creates.create_person.operation.perform,
      bundle
    );
    expect(results).toBeDefined();
    expect(results.data?.createOnePerson?.id).toBeDefined();
  });
});
