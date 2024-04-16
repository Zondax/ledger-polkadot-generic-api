# Ledger Polkadot Generic API

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

---

![zondax_light](docs/assets/zondax_light.png#gh-light-mode-only)
![zondax_dark](docs/assets/zondax_dark.png#gh-dark-mode-only)

_Please visit our website at [zondax.ch](https://zondax.ch)_

---

## Overview
This API service generates essential, shortened metadata from transaction blobs to facilitate signing transactions on a Ledger device. 
Designed as an external software component, it simplifies interactions with the Ledger Polkadot Generic app by abstracting mandatory steps of the signing process to a service. 
The service is delivered through a standardized REST API, ensuring easy integration and a streamlined user experience.

## Prerequisites
- **Node.js**: Version 20.0.0 or higher. You can download it from [Node.js official website](https://nodejs.org/).
- **Yarn**: Version 4.0.0 or higher. Install Yarn globally using npm with `npm install --global corepack` and `corepack enable`.
- **Rust**: Necessary for compiling Rust dependencies. Install Rust through [rustup](https://rustup.rs/).

## Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/zondax/ledger-polkadot-generic-api.git
cd ledger-polkadot-generic-api
yarn install
```

## Building the Project
To build the project, run:
```bash
yarn build
```
This command will compile Rust modules and TypeScript files.

### Detailed Build Commands
- **Build Rust Modules**: `yarn build:rust`
- **Build Node.js Modules (TypeScript)**: `yarn build:node`

## Cleaning the Build
To clean your project (remove compiled modules and distribution files), run:
```bash
yarn clean
```

## Formatting Code
To format the project code, use:
```bash
yarn format
```

## Linting
To lint your code, run:
```bash
yarn lint
```
To automatically fix linting errors, run:
```bash
yarn lint:fix
```

## Running the Project
After building the project, you can start it with:
```bash
yarn start
```

## Testing
Run tests using:
```bash
yarn test
```

## Using Docker
To build and run the project using Docker:
```bash
yarn docker
```
Detailed Docker commands:
- **Build Docker Image**: `yarn docker:build`
- **Run Docker Container**: `yarn docker:run`

## Contributing
Guidelines for how to contribute to the project. You can detail how to fork the repository, create a new branch, make changes, and pull requests.

## License
Apache 2.0

```
