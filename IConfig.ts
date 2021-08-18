interface IConfig {
    name: string;
    description?: string;
    dependencies: string[];
    devDependencies: string[];
    packageEntries: Array<{
        key: string;
        value: string;
    }>;
    templates: Array<{
        path: string;
        file: File;
    }>
}