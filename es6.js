import AWS from 'aws-sdk'
import amplifyAuth from '@aws-amplify/auth'
import { getLocalEndpoint } from './patches'

const patchAwsSdkEndpoints = (AWS) => {
  const _patch = () => {
    const createClientsOrig = AWS.CognitoIdentityCredentials.prototype.createClients
    AWS.CognitoIdentityCredentials.prototype.createClients = function () {
      this._clientConfig.endpoint = getLocalEndpoint()
      return createClientsOrig.bind(this)()
    }
  }
  try {
    _patch()
  } catch (e) {
    console.error('Error:\t\t Unable to patch AWS SDK enpoints', e)
  }
}

const patchAmplifyAuthEndpoint = (authInstance) => {
  // patch amplify Auth class to use local endpoints
  const _patch = (inst) => {
    const createCognitoUserOrig = inst.createCognitoUser
    inst.createCognitoUser = (username) => {
      const result = createCognitoUserOrig.bind(inst)(username)
      result.client.endpoint = getLocalEndpoint()
      return result
    }
    const configureOrig = inst.configure
    inst.configure = (config) => {
      if ((inst.userPool || {}).client) inst.userPool.client.endpoint = getLocalEndpoint()
      const result = configureOrig.bind(inst)(config)
      if (result.client) result.client.endpoint = getLocalEndpoint()
      return result
    }
  }
  try {
    authInstance = authInstance || require('@aws-amplify/auth')
    _patch(authInstance)
  } catch (e) {
    console.error('Error:\t\t Unable to patch Amplify Auth endpoint', e)
  }
}

const applyPatches = () => {
  patchAmplifyAuthEndpoint(amplifyAuth)
  patchAwsSdkEndpoints(AWS)
}

export default applyPatches
