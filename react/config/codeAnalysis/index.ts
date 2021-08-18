module.exports = {
    name: 'withLint',
    question: 'Do you want to include code analysis (TSLint, Prettier and EsLint)?',
    dependencies: [],
    devDependencies: [
        'tslint',
        'pre-commit',
        'prettier',
        'husky',
        'eslint',
        'eslint-config-prettier',
        'eslint-config-standard',
        'eslint-plugin-import',
        'eslint-plugin-node',
        'eslint-plugin-prettier',
        'eslint-plugin-react',
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
    ],
    packageEntries: [
        {
            key: 'pre-commit',
            value: ['prettier: check']
        },
        {
            key: 'scripts.lint',
            value: "eslint '*/**/*.{js,ts,tsx}' --quiet --fix",
        },
        {
            key: 'scripts.format',
            value: "prettier --write \"src/**/*.ts\"",
        },
        {
            key: 'scripts.prepare',
            value: 'husky install'
        },
        {
            key: 'eslintConfig',
            value: 'extends'
        },
        {
            key: 'eslintConfig.extends',
            value: [
                'react-app',
                'react-app/jest'
            ]
        },
        {
            key: 'eslintIgnore',
            value: [
                'README.md',
                'yarn.lock',
                '/build'
            ]
        },
        {
            key: 'husky',
            value: 'hooks'
        },
        {
            key: 'husky.hooks',
            value: {
                'pre-commit': 'lint-staged && pretty-quick --staged'
            }
        },
        {
            key: 'lint-staged',
            value: '*'
        },
        {
            key: 'lint-staged.*',
            value: [
                "eslint '*/**/*.{js,ts,tsx}' --quiet --fix",
                "prettier --write"
            ]
        }
    ],
    templates: []
}