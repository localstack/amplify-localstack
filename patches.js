// const fs = require('fs')

const DEFAULT_EDGE_PORT = 4566
const DEFAULT_HOSTNAME = 'localhost.localstack.cloud'

// TODO make configurable?
const AWS_ACCESS_KEY_ID = 'test'
const AWS_SECRET_ACCESS_KEY = 'test'
const AWS_DEFAULT_REGION = 'us-east-1'

// const snapshotPath = '/snapshot/repo/build/node_modules/'
const snapshotPath = '/snapshot/amplify-cli/build/node_modules/'
const getLocalEndpoint = () => {
  return process.env.LOCALSTACK_ENDPOINT || `https://${DEFAULT_HOSTNAME}:${DEFAULT_EDGE_PORT}`
}

// Patchs the awscloudformation provider plugin to deploy the resources into LocalStack
const patchConfigManagerLoader = (context) => {
  try {
    const configManagerPath = `${snapshotPath}@aws-amplify/amplify-provider-awscloudformation/lib/configuration-manager.js`
    const sysConfigManager = require(configManagerPath)

    sysConfigManager.loadConfiguration = () => {
      const config = {}
      config.endpoint = getLocalEndpoint()
      config.accessKeyId = process.env.LOCALSTACK_ACCESS_KEY_ID || AWS_ACCESS_KEY_ID
      config.secretAccessKey = process.env.LOCALSTACK_ACCESS_KEY_SECRET || AWS_SECRET_ACCESS_KEY
      config.s3ForcePathStyle = process.env.LOCALSTACK_S3_FORCE_PATH_STYLE !== '0'
      config.region = process.env.LOCALSTACK_REGION || AWS_DEFAULT_REGION
      return config
    }
  } catch (error) {
    context.print.error('Error:\t\tLocalStack plugin unable to patch Configuration Manager', error)
  }
}

// This functions main objective is to replace all amazonaws.com encounters except the ones under the Principal key
// as such case are meant for IAM policies
function replaceInObject (obj) {
  const newDomain = getLocalEndpoint().replace('https://', '').replace('http://', '')
  const port = newDomain.split(':').pop()
  const regex = new RegExp(`amazonaws\\.com(:${port})?`, 'gm')

  function traverse (node, parentKeys = []) {
    if (typeof node === 'string') {
      // Perform the replacement only if "Principal" is not in parent keys
      if (!parentKeys.includes('Principal')) {
        return node.replace(regex, '')
      }
      return node // Return unmodified value if "Principal" is a parent
    }

    if (Array.isArray(node)) {
      return node.map(item => traverse(item, parentKeys))
    }

    if (node !== null && typeof node === 'object') {
      return Object.keys(node).reduce((acc, key) => {
        acc[key] = traverse(node[key], [...parentKeys, key])
        return acc
      }, {})
    }

    return node // Return the value if it is not an object, array, or string
  }

  return traverse(obj)
}

// Patches the utility that generates json files replacing the hardcoded AWS domains with LocalStack domains
// These EJS tend to be AWS Cloudformation JSON templates
const patchWriteJsonFileUtility = (context) => {
  const jsonUtilitiesPath = `${snapshotPath}@aws-amplify/amplify-cli-core/lib/jsonUtilities`

  try {
    const jsonUtilities = require(jsonUtilitiesPath)
    const oldMethod = jsonUtilities.JSONUtilities.writeJson
    jsonUtilities.JSONUtilities.writeJson = (fileName, data, options) => {
      // console.log(`LS Plugin is patching file: ${fileName}`)
      const copyOfData = JSON.parse(JSON.stringify(data))
      const newData = replaceInObject(copyOfData)
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
  patchWriteJsonFileUtility(context)
}

module.exports = {
  patchEverything,
  getLocalEndpoint
}
