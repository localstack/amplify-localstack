# Amplify LocalStack Plugin
![example workflow](https://github.com/localstack/amplify-localstack/actions/workflows/ci.yml/badge.svg)

**Amplify CLI** Plugin to support running against [LocalStack](https://github.com/localstack/localstack)

This plugin allows the amplify CLI tool to create resources directly on your local machine. Any request to AWS is redirected to a running LocalStack instance.

## Prerequisites
- LocalStack Pro
- Amplify CLI Tool >= 4.41.0

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
amplify push --use-localstack true
```

### Configuration
The following environment variables can be configured:

* `LOCALSTACK_ACCESS_KEY_ID`: Sets custom Access Key Id for the internal client to use (default `test`).
* `LOCALSTACK_ACCESS_KEY_SECRET`: Sets custom Access Key Secret for the internal client to use (default `test`).
* `LOCALSTACK_REGION`: Sets a custom region (default `us-east-1`).
* `LOCALSTACK_S3_FORCE_PATH_STYLE`: Sets the S3 path style (default `1`, accepted values: `1`as true and `0` as false)).
* `LOCALSTACK_ENDPOINT`: Sets a custom endpoint (default `https://localhost.localstack.cloud:4566`).

## Change Log
* 0.2.6: more and up to date settings
* 0.2.5: patch AWS-SDK Config
* 0.2.4: add missing handlers
* 0.2.3: fix paths for patching
* 0.2.2: command line parameters
* 0.1.0: aws-exports.js file patching
* 0.0.1: Initial version

## License

This code is distributed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
