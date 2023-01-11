const yesno = require('yesno'); 
const patches = require("../patches")

async function run(context, args) {
  const doPatch = await yesno({
      question: 'Do you want to push the resources into LocalStack? [y/N]',
      defaultValue: "n"
  });
  if (doPatch == true){
    patches.patchEverything()
  }
}

module.exports = {
  run,
};
