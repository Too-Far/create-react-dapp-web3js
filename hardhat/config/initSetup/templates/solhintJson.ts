module.exports = `
{
    "extends": "solhint:recommended",
    "rules": {
        "compiler-version": ["error", "^0.8.0"],
        "func-visibility": ["warn", {"ignoreConstructors": true}]
    }
}
`