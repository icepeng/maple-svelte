const ghpages = require('gh-pages');
const loadConfigFile = require('rollup/dist/loadConfigFile');
const path = require('path');
const rollup = require('rollup');

loadConfigFile(path.resolve(__dirname, 'rollup.config.js')).then(
  async ({ options, warnings }) => {
    warnings.flush();

    for (const optionsObj of options) {
      const bundle = await rollup.rollup(optionsObj);
      await Promise.all(optionsObj.output.map(bundle.write));
    }

    ghpages.publish('public', () => {
      console.log('Deploy Complete!');
    });
  },
);
