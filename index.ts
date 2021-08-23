#!/usr/bin/env node
const inq = require('inquirer')
const color = require('colors')
const reactApp = require('./react/reactApp');

const askQuestion = (): any => {
    const questions = [
        {
            type: 'input',
            name: 'appName',
            message: 'What would you like to name your app? The name should be in kebab case i.e `my-awesome-app`?'
        },
    ];
    return inq.prompt(questions)
};

const appDict = {
    react: reactApp
};

const checkKebab = (str: string): string => {
    str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-')
    return str;
}

const execute = async (): Promise<any> => {
    const answer = await askQuestion();
    const { appName } = answer;
    const appType = 'react'; // Temp
    let kebabName;

    if(appName && appName.length >0) {
        kebabName = checkKebab(appName);
    }

    if(!kebabName || kebabName.length <= 0) {
        console.log(color.red('Please enter a valid name for your new app!'))
        return process.exit(0);
    }

    const app = appDict[appType];

    if(!app) {
        console.log(color.red(
            `App type: ${appType} is not yet supported by this CLI tool.`
        ))
        return process.exit(0);
    }

    const appDirectory = `${process.cwd()}/${appName}`;
    const res = await app.create(kebabName, appDirectory);

    if(!res) {
        console.log(color.red('There was an error generating your app!'))
        return process.exit(0)
    }
    return process.exit(0)
}

execute();