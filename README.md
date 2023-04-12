# Amplify LocalStack Plugin

**Amplify** Plugin to support running against [LocalStack](https://github.com/localstack/localstack)

This plugin allows the amplify CLI tool to create resources directly on your local machine. Any request to AWS is redirected to a running LocalStack instance.

## Prerequisites
- LocalStack Pro

## Installation

### Installation with npm:
```sh
npm install -g amplify-localstack
amplify plugin add amplify-localstack
```

### Installation with local project (mostly for devs):
```sh
amplify plugin add amplify-localstack
# A message about the plugin not being found will appear
# Input the root path of this project as input
```

## Usage
After the installation of the plugin, everytime you run the commands `amplify init` or `amplify push` the console will prompt you to select if you want to deploy the resources into LocalStack.

### Parameters:
You can also add the parameters `--use-localstack true` to avoid being asked if you want to use localstack

Examples:
```sh
amplify init --use-localstack true
amplify add api
amplify push --use-localstack
```




### Configuration
The following environment variables can be configured:

* `EDGE_PORT`: Port under which LocalStack edge service is accessible (default: `4566`)
* `LOCALSTACK_HOSTNAME`: Target host under which LocalStack edge service is accessible (default: `localhost.localstack.cloud`)
* `LOCALSTACK_ENDPOINT`: Sets a custom endpoint directly. Overrides `EDGE_PORT` and `LOCALSTACK_HOSTNAME` (default `https://localhost.localstack.cloud:4566`)

## Change Log
* 0.1.0: aws-exports.js file patching
* 0.0.1: Initial version

## License

This code is distributed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
