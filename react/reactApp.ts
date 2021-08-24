var colors = require('colors')
const shell = require('shelljs')
shell.config.silent = true;
const inquirer = require('inquirer')
const fse = require('fs-extra')
const set = require('lodash.set')
const ora = require('ora')
const reactConfigList = require('./config')


const askQuestions = async () => {
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

const createAppDirectory = (appDirectory: string): Promise<any> => {
    const spinner = ora('Creating app directory...').start();

    return new Promise((resolve, reject) => {
        fse.ensureDir(appDirectory, err => {
            if(err) {
                console.log(colors.blue("Error with fse.ensureDir"))
            }
        })
        const cdRes = shell.cd(appDirectory);
        if(cdRes.code !== 0) {
            console.log(colors.red(`Error changing directory to: ${appDirectory}`))
            reject();
        }
        spinner.succeed();
        resolve('Success')
    })
}

const createReactApp = (appName: string): Promise<any> => {
    const spinner = ora('Running create-react-app....').start();

    return new Promise((resolve, reject) => {
        shell.exec(
            `npx create-react-app ${appName}-frontend --template typescript`,
            () => {
                const cdRes = shell.cd(`${appName}-frontend`);
                if(cdRes.code !== 0) {
                    console.log(colors.red(`Error changing directory to: ${appName}`));
                    reject();
                }
                spinner.succeed();
                resolve('Success');
            }
        )
    })
}

const installPackages = async (configList: Array<any>): Promise<any> => {
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

const updatePackageDotJson = (configList: Array<any>): Promise<any> => {
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

const addDirs = (configList: Array<any>): Promise<any> => {
    const spinner = ora('Adding additional directories...')

    const dirList = configList.reduce(
        (acc, val) => [...acc, ...val.directories],
        []
    )

    return new Promise(resolve => {
        dirList.forEach(dir => {
            fse.ensureDir(dir.path, err => {
                if(err) {
                    console.log(err)
                }
            })
        })

        spinner.succeed();
        resolve('success');
    })
}

const addTemplates = (configList: Array<any>): Promise<any> => {
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

const commitGit = ():Promise<any> => {
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

exports.create = async (appName, appDirectory) =>{
    const selectedConfigList = await askQuestions();

    await createAppDirectory(appDirectory);
    await createReactApp(appName);
    await installPackages(selectedConfigList);
    await updatePackageDotJson(selectedConfigList);
    await addDirs(selectedConfigList)
    await addTemplates(selectedConfigList);
    await commitGit();

    console.log(
        colors.green(`Created your new dApp! To get started cd into ${appName}`)
    )
    return true
}