import 'colors'
import * as shell from 'shelljs'
shell.config.silent = true;
import * as inquirer from 'inquirer'
import * as fse from 'fs-extra';
const reactConfigList = require('./config')
import { set } from 'lodash'
import * as ora from 'ora';

const askQuestions = async (): Promise<string[]> => {
    const selectedConfigList = [];
    const questions = reactConfigList.map(config => ({
        type: 'list',
        name: config.name,
        message: config.question,
        choices: ['yes', 'no']
    }))

    const answers = await inquirer.prompt(questions);
    reactConfigList.forEach(config => {
        const matchingAnswer = answers[config.name];
        if (matchingAnswer == answers[config.name]) {
            selectedConfigList.push(config)
        }
    })

    return selectedConfigList;
}

const createReactApp = (appName: string) => {
    const spinner = ora('Running create-react-app....').start();

    return new Promise((resolve, reject) => {
        shell.exec(
            `npx create-react-app ${appName} --template typescript`,
            () => {
                const cdRes = shell.cd(appName);
                if(cdRes.code !== 0) {
                    console.log(`Error changing directory to: ${appName}`.red);
                    reject();
                }
                spinner.succeed();
                resolve('Success');
            }
        )
    })
}

const installPackages = async (configList: any) => {
    let dependencies = [];
    let devDependencies = [];

    configList.forEach(config => {
        dependencies = [...dependencies, ...config.dependencies];
        devDependencies = [...devDependencies, ...config.devDependencies];
    });

    await new Promise(resolve => {
        const spinner = ora('Installing additional dependencies...').start();

        shell.exec(`yarn add ${dependencies.join(' ')}`, () => {
            spinner.succeed();
            resolve('success');
        })
    })

    await new Promise(resolve => {
        const spinner = ora('Installing additional dev dependencies...').start();
        shell.exec(`yarn add ${devDependencies.join(' ')} --dev`, () => {
            spinner.succeed();
            resolve('success');
        })
    })
}

const updatePackageDotJson = (configList: any) => {
    const spinner = ora('Updating package.json scripts...');

    let packageEntries = configList.reduce(
        (acc, val) => [...acc, ...val.packageEntries],
        []
    );

    return new Promise(resolve => {
        const rawPackage = fse.readFileSync('package.json');
        const pack = JSON.parse(rawPackage);

        // If scripts do not update appropriately will need to re-do how scripts are stored in config.
        packageEntries.forEach(script => {
            set(pack, script.key, script.value);
        });
        fse.writeFile('package.json', JSON.stringify(pack, null, 2), function(
            err
        ) {
            if (err) {
                spinner.fail();
                return console.log(err);
            }

            spinner.succeed();
            resolve('success');
        })
    })
}

const addTemplates = (configList: any) => {
    const spinner = ora('Adding templates...');

    const templateList = configList.reduce(
        (acc, val) => [...acc, ...val.templates],
        []
    )

    return new Promise(resolve => {
        templateList.forEach(template => {
            fse.outputFile(template.path, template.file, err => {
                if (err) {
                    return console.log(err);
                }
            })
        })

        spinner.succeed();
        resolve('success');
    })
}

const commitGit = () => {
    const spinner = ora('Committing new files to Git....');

    return new Promise(resolve => {
        shell.exec(
            `git add . && git commit --no-verify -m "Secondary commit from boilerplate"`,
            ()=> {
                spinner.succeed();
                resolve('success');
            }
        )
    })
}

exports.create = async (appName, appDirectory): Promise<boolean> =>{
    const selectedConfigList = await askQuestions();

    await createReactApp(appName);
    await installPackages(selectedConfigList);
    await updatePackageDotJson(selectedConfigList);
    await addTemplates(selectedConfigList);
    await commitGit();

    console.log(
        `Created your new dApp! To get started cd into ${appName}`.green
    )
    return true
}