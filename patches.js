const fs = require('fs')

const DEFAULT_EDGE_PORT = 4566
const DEFAULT_HOSTNAME = 'localhost.localstack.cloud'

// TODO make configurable?
const AWS_ACCESS_KEY_ID = 'test'
const AWS_SECRET_ACCESS_KEY = 'test'
const AWS_DEFAULT_REGION = 'us-east-1'

// const snapshotPath = '/snapshot/repo/build/node_modules/'
const snapshotPath = '/snapshot/amplify-cli/build/node_modules/'
const getLocalEndpoint = () => {
  const port = process.env.EDGE_PORT || DEFAULT_EDGE_PORT
  const host = process.env.LOCALSTACK_HOSTNAME || DEFAULT_HOSTNAME
  return process.env.LOCALSTACK_ENDPOINT || `https://${host}:${port}`
}

// Patchs the awscloudformation provider plugin to deploy the resources into LocalStack
const patchConfigManagerLoader = (context) => {
  try {
    const configManagerPath = `${snapshotPath}@aws-amplify/amplify-provider-awscloudformation/lib/configuration-manager.js`
    const sysConfigManager = require(configManagerPath)

    sysConfigManager.loadConfiguration = () => {
      const config = {}
      config.endpoint = getLocalEndpoint()
      config.accessKeyId = AWS_ACCESS_KEY_ID
      config.secretAccessKey = AWS_SECRET_ACCESS_KEY
      config.s3ForcePathStyle = true
      config.region = AWS_DEFAULT_REGION
      return config
    }
  } catch (error) {
    context.print.error('Error:\t\tLocalStack plugin unable to patch Configuration Manager', error)
  }
}

// Patchs the utility that copy files from .ejs to replace the hardcoded AWS domains with LocalStack domains
const patchCopyBatch = (context) => {
  const newDomain = getLocalEndpoint().replace('https://', '').replace('http://', '')
  const port = newDomain.split(':').pop()
  const copyBatchPath = `${snapshotPath}@aws-amplify/cli-internal/lib/extensions/amplify-helpers/copy-batch`

  try {
    const copyBatchLib = require(copyBatchPath)
    const oldMethod = copyBatchLib.copyBatch
    copyBatchLib.copyBatch = async (context, jobs, props, force, writeParams) => {
      await oldMethod(context, jobs, props, force, writeParams)

      //
      jobs.forEach(job => {
        // console.log(`LS Plugin is patching file: ${job.template}`)
        const file = job.target
        const content = fs.readFileSync(file).toString()
        const newContent = content.replace(new RegExp(`amazonaws.com(:${port})?`, 'gm'), newDomain)
        fs.writeFileSync(file, newContent)
      })
    }
  } catch (error) {
    context.print.error('Error:\t\tLocalStack Plugin unable to patch CopyBatch Utility', error)
  }
}

// Patchs the utility that generates json files replacing the hardcoded AWS domains with LocalStack domains
const patchWriteJsonFileUtility = (context) => {
  const jsonUtilitiesPath = `${snapshotPath}@aws-amplify/amplify-cli-core/lib/jsonUtilities`
  const newDomain = getLocalEndpoint().replace('https://', '').replace('http://', '')
  const port = newDomain.split(':').pop()

  try {
    const jsonUtilities = require(jsonUtilitiesPath)
    const oldMethod = jsonUtilities.JSONUtilities.writeJson
    jsonUtilities.JSONUtilities.writeJson = (fileName, data, options) => {
      // console.log(`LS Plugin is patching file: ${fileName}`)
      const stringData = JSON.stringify(data).replace(new RegExp(`amazonaws.com(:${port})?`, 'gm'), newDomain)

      const newData = JSON.parse(stringData)
      oldMethod(fileName, newData, options)
    }
  } catch (error) {
    context.print.error('Error:\t\tLocalstack Plugin unable to patch WriteJsonFile Utility', error)
  }
}

const patchAwsSdkConfig = function (context) {
  const awsCorePath = `${snapshotPath}aws-sdk/lib/core`
  const endpoint = getLocalEndpoint()

  try {
    const awsConfig = require(awsCorePath)
    awsConfig.config.endpoint = endpoint
  } catch (error) {
    context.print.error('Error:\t\tLocalstack Plugin unable to patch AWS SDK Config', error)
  }
}

const patchEverything = (context) => {
  context.print.info('Info:\t Patching AWS Amplify libs')
  patchAwsSdkConfig(context)
  patchConfigManagerLoader(context)
  patchCopyBatch(context)
  patchWriteJsonFileUtility(context)
}

module.exports = {
  patchEverything,
  getLocalEndpoint
}
