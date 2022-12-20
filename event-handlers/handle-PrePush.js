const eventName = 'PrePush';
const patches = require("../patches")

async function run(context, args) {
  patches.patchConfigManagerLoader()
}

module.exports = {
  run,
};
