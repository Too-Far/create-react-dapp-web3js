const lint = require('./templates/eslint');
const lintIgnore = require('./templates/eslintIgnore');
const gitIgnore = require('./templates/gitIgnore');
const hardhatConfig = require('./templates/hardhatConfig');
const packageJSON = require('./templates/package');
const prettierIgnore = require('./templates/prettierIgnore');
const solhintIgnore = require('./templates/solhintIgnore');
const solhint = require('./templates/solhintJson');
const sampleTest = require('./templates/sample-test');
const deploy = require('./templates/scripts');
const greeter = require('./templates/Greeter')

module.exports = {
    name: 'withHardhat',
    question: 'Do you want to include a hardhat config?',
    dependencies: [],
    devDependencies: [],
    packageEntries: [],
    templates: [
        {path: './.eslintrc.ts', file: lint},
        {path: './.eslintignore', file: lintIgnore},
        {path: './.gitignore', file: gitIgnore},
        {path: './hardhat.config.ts', file: hardhatConfig},
        {path: './package.json', file: packageJSON},
        {path: './.prettierignore', file: prettierIgnore},
        {path: './.solhintignore', file: solhintIgnore},
        {path: './.solhint.json', file: solhint},
        {path: './test/sample-test.js', file: sampleTest},
        {path: './scripts/deploy.ts', file: deploy},
        {path: './contracts/Greeter.sol', file: greeter}

    ],
    directories: [
        {path: "./test"},
        {path: "./scripts"},
        {path: "./contracts"}
    ]
}