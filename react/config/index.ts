const withCodeAnalysis = require('./codeAnalysis');
const withTypeGen = require('./typeGen');
const withWeb3 = require('./web3')

module.exports = [withCodeAnalysis, withTypeGen, withWeb3]