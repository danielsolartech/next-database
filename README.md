# nextDatabase

![NPM Downloads](https://img.shields.io/npm/dt/next-database)
![Version](https://img.shields.io/github/package-json/v/danielsolartech/next-database)

![Build](https://img.shields.io/github/workflow/status/danielsolartech/next-database/Node.JS)
[![License](https://img.shields.io/github/license/danielsolartech/next-database)](./LICENSE)
![Code Size](https://img.shields.io/github/languages/code-size/danielsolartech/next-database)

ORM for MySQL.

## Table of Contents
* [Getting Started](#Getting-Started)
* [License](#License)
* [Contributors](#Contributors)

## Getting Started
First, you need build the source code; for this, run `npm run build` and then you can run the examples from the `examples` directory.

### Configuring the .env file (Optional)
Before of run the examples you can configure the `.env` file with the following variables (This is optional):

```
host=localhost
port=3306
user=root
password=YOUR PASSWORD HERE
database=nextDatabase
```

The default database is `nextDatabase`, it is created to init the process and deleted at the end.

### Commands
```sh
# Create table example
npm run create-table-example-ts # TypeScript
npm run create-table-example-js # JavaScript

# Insert table example
npm run insert-table-example-ts # TypeScript
npm run insert-table-example-js # JavaScript

# Truncate table example
npm run truncate-table-example-ts # TypeScript
npm run truncate-table-example-js # JavaScript
```

## [License](./LICENSE)

## Contributors
* **Daniel Solarte** [GitHub](https://github.com/danielsolartech)
