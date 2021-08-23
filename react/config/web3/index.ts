const connectors = require('./templates/connectors')
const networks = require('./templates/networks')
const addressStore = require('./templates/addressStore')
module.exports = {
    name: 'withWeb3',
    question: 'Is this a Web3 based project?',
    dependencies: [
        "@web3-react/authereum-connector",
        "@web3-react/core",
        "@web3-react/fortmatic-connector",
        "@web3-react/frame-connector",
        "@web3-react/injected-connector",
        "@web3-react/ledger-connector",
        "@web3-react/magic-connector",
        "@web3-react/network-connector",
        "@web3-react/portis-connector",
        "@web3-react/torus-connector",
        "@web3-react/trezor-connector",
        "@web3-react/walletconnect-connector",
        "@web3-react/walletlink-connector",
        "ethers",
        'web3',
        'web3-react'
    ],
    devDependencies: [
        '@types/3box',
    ],
    packageEntries: [
        {
            key: 'scripts.typeGen',
            value: "typechain --target ethers-v5 src/types \"src/lib/abis/*.json\""
        }
    ],
    templates: [
        {path: 'src/lib/connectors.ts', file: connectors},
        {path: 'src/lib/networks.ts', file: networks},
        {path: 'ref/addressStore.ts', file: addressStore},
    ],
    directories: [
        {path: 'src/lib/abis'},
        {path: 'src/lib/contract'},
        {path: 'src/lib/hooks'},
        {path: 'ref'}
    ]
}