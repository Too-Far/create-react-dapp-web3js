var colors = require('colors');
var bash = require('shelljs');
bash.config.silent = true;
const inquiry = require('inquirer');
const fsextra = require('fs-extra');
const _set = require('lodash.set');
const _ora = require('ora');
const hardhatConfigList = require('./config')

const createHardhatDirectory = (appDir: string): Promise<any> => {
    const spinner = _ora('Creating Hardhat directory').start();

    return new Promise((resolve, reject) => {
        fsextra.ensureDir(`/${appDir}/hardhat`, err => {
            if(err) {
                console.log(colors.red(err));
            }
        })
        const cdResult = bash.cd(`${appDir}/hardhat`);
        if(cdResult.code !== 0) {
            console.log(colors.red(`Error changing directory to: ${appDir}`));
            reject();
        }
        spinner.succeed();
        resolve('Success');
    })
}

const addDirectories = (): Promise<any> => {
    const spinner = _ora('Adding necessary hardhat directories...').start();

    const dirList = hardhatConfigList.reduce(
        (acc, val) => [...acc, ...val.directories],
        []
    )

    return new Promise(resolve => {
        dirList.forEach(dir => {
            fsextra.ensureDir(dir.path, err => {
                if(err) {
                    console.log(color.red(err));
                }
            })
        })
        spinner.succeed();
        resolve('Success');
    })
}

const createTemplates = (): Promise<any> => {
    const spinner = _ora('Adding hardhat templates...').start();

    const templateList = hardhatConfigList.reduce(
        (acc, val) => [...acc, ...val.templates],
        []
    )
    return new Promise(resolve => {
        templateList.forEach(template => {
            fsextra.outputFile(template.path, template.file, err => {
                if(err) {
                    return console.log(color.red(err));
                }
            })
        })
        spinner.succeed();
        resolve('Success');
    })
}

const gitCommit = ():Promise<any> => {
    const spinner = _ora('Committing new files to Git....').start();

    return new Promise(resolve => {
        bash.exec(
            `git add . && git commit --no-verify -m "Secondary commit from hardhat install"`,
            ()=> {
                spinner.succeed();
                resolve('success');
            }
        )
    })
}

const packageInstall = async (): Promise<any> => {
    await new Promise(resolve => {
        const spinner = _ora('Installing hardhat dependencies').start();

        bash.exec('yarn add', () => {
            spinner.succeed();
            resolve('success');
        })
    })
}

exports.create = async (appName: string, appDirectory: string): Promise<boolean> =>{
    await createHardhatDirectory(appDirectory);
    await addDirectories();
    await createTemplates();
    await packageInstall();
    await gitCommit();

    console.log(colors.green(`Created a hardhat app! To get started, cd into ${appName} and get started!`))
    return true;
}