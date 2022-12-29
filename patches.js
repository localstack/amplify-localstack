
const DEFAULT_EDGE_PORT = 4566;
const DEFAULT_HOSTNAME = 'localhost.localstack.cloud';

// TODO make configurable?
const AWS_ACCESS_KEY_ID = 'test';
const AWS_SECRET_ACCESS_KEY = 'test';
const AWS_DEFAULT_REGION = "us-east-1"

const snapshot_path = "/snapshot/repo/build/node_modules/"
// packageLocation: '/snapshot/repo/build/node_modules/amplify-provider-awscloudformation',

const getLocalEndpoint = () => {
  const port = process.env.EDGE_PORT || DEFAULT_EDGE_PORT;
  const host = process.env.LOCALSTACK_HOSTNAME || DEFAULT_HOSTNAME;
  return process.env.LOCALSTACK_ENDPOINT || `https://${host}:${port}`;
};

const patchConfigManagerLoader =  () => {
  try {
    const configManagerPath = snapshot_path+'amplify-provider-awscloudformation/lib/configuration-manager';
    const sysConfigManager = require(configManagerPath);

    sysConfigManager.loadConfiguration = () => {
      const config = {}
      config.endpoint = getLocalEndpoint();
      config.accessKeyId = AWS_ACCESS_KEY_ID;
      config.secretAccessKey = AWS_SECRET_ACCESS_KEY;
      config.s3ForcePathStyle = true;
      config.region = AWS_DEFAULT_REGION
      return config
    }
    
  } catch (error) {
    console.error("Error:\t\tLocalstack Plugin unable to patch Configuration Manager", error)
  }
}

const patchEverything = ()=> {
    console.info("Info:\t\t Patching AWS Amplify libs")
    patchConfigManagerLoader()
}

module.exports = {
    patchConfigManagerLoader,
    patchEverything
}