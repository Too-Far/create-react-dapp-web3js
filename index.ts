#!/usr/bin/env node
const inquirer = require('inquirer')
const colors = require('colors')
const reactApp = require('./react/reactApp');

const askQuestions = () => {
    const questions = [
        {
            type: 'input',
            name: 'appName',
            message: 'What would you like to name your app? The name should be in kebab case i.e `my-awesome-app`?'
        },
    ];
    return inquirer.prompt(questions)
};

const appDict = {
    react: reactApp
};

const checkKebab = (str) => {
    str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-')
    return str;
}

const run = async () => {
    const answer = await askQuestions();
    const { appName } = answer;
    const appType = 'react'; // Temp
    let kebabName;

    if(appName && appName.length >0) {
        kebabName = checkKebab(appName);
    }

    if(!kebabName || kebabName.length <= 0) {
        console.log(colors.red('Please enter a valid name for your new app!'))
        return process.exit(0);
    }

    const app = appDict[appType];

    if(!app) {
        console.log(colors.red(
            `App type: ${appType} is not yet supported by this CLI tool.`
        ))
        return process.exit(0);
    }

    const appDirectory = `${process.cwd()}/${appName}`;
    const res = await app.create(kebabName, appDirectory);

    if(!res) {
        console.log(colors.red('There was an error generating your app!'))
        return process.exit(0)
    }
    return process.exit(0)
}

run();