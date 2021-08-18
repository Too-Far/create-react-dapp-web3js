module.exports = {
    name: 'withTypeGen',
    question: 'Do you want to include typeChain?',
    dependencies: [],
    devDependencies: [
        'typechain',
        '@typechain/ethers-v5',
        '@typechain/hardhat'
    ],
    packageEntries: [
        {
            key: 'scripts.typeGen',
            value: "typechain --target ethers-v5 src/types \"src/lib/abis/*.json\""
        }
    ],
    templates: []
}