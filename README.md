![Logo of the project](./src/assets/images/logo.jpeg)

# Cpp Package Manager &middot; [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Build status](https://dev.azure.com/lucaslacerdacl/cpp-package-manager/_apis/build/status/cpp-package-manager)](https://dev.azure.com/lucaslacerdacl/cpp-package-manager/_build/latest?definitionId=-1) [![codecov](https://codecov.io/gh/lucaslacerdacl/cpp-package-manager/branch/master/graph/badge.svg?token=UVMzsNr6HU)](https://codecov.io/gh/lucaslacerdacl/cpp-package-manager) [![npm version](https://badge.fury.io/js/cpp-package-manager.svg)](https://badge.fury.io/js/cpp-package-manager)
> This is a package manager for Cpp to give agility in development.

## Installing / Getting started

```shell
npm install cpp-package-manager -g
```

This project provide three features for manager cpp package.

### Init

```shell
cpm init
```

This command will generate a ```cpm.packages.json``` file with the following properties:

```json
{
  "name": "cpp-package-manager",
  "description": "This is a package manager for Cpp to give agility in development.",
  "version": "1.0.0"
}
```

After generate the file you can add packages hosted in ```GitHub```, just like the example:
```json
"dependencies": [
    {
      "name": "complex-number",
      "url": "https://github.com/lucaslacerdacl/complex-number.git"
    }
  ]
```

### Install

```shell
cpm install
```

This command will clone the projects and create the ```cpp_modules``` folder with packages already built in dist folder by each package.

    .
    └── cpp_modules
        └── complex_number
          ├── dist                   # Compiled files
          └── src

### Build

```shell
cpm build
```

This command will generate binaries files in dist folder for all packages in ```cpp_modules```.

### Log*

If any error occured a ```cpp.log.json``` file will be created showing date and the description of the error.

*This feature is not avaliable as command.

## Developing

### Built With
* Node
* NPM
* Typescript
* Chalk
* Figlet
* Inquirer
* Lodash
* Minimist
* Nodegit
* Jest

### Prerequisites
You will need install [Node](https://nodejs.org).


### Deploying / Publishing
The project is build and release in  [Azure DevOps](https://dev.azure.com/lucaslacerdacl/cpp-package-manager).

## Versioning

This project is using the pattern ```MAJOR.MINOR.PATCH```. You read more in [Semantic Versioning](http://semver.org/).


## Tests

You can run:

```shell
npm run test
```
This command will run ```jest``` with code coverage.

This project is using ```ts-jest``` preset and run on ```src``` folder.

```json
  "jest": {
    "preset": "ts-jest",
    "roots": [
      "src"
    ]
  }
```


## Style guide

### Options
All commands is in options folder.

    .
    └── src
        ├── assets
        ├── options
        └── index.ts
Each command has his own model and test.

### Assets
Created in first moment to store project logo. In the future can used to hosted static files.

### Index
Get command and choose the options.

## Api Reference
Check the proccess in Medium:
[SemVer](http://semver.org/)

## Licensing

License under MIT.




