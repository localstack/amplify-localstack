const eventName = 'PreInit';
const yesno = require('yesno'); 
const patches = require("../patches")

async function run(context, args) {
  // console.log("preinit")
  const doPatch = await yesno({
      question: 'Do you want to create the project in LocalStack? [y/N]',
      defaultValue: "n"
  });
  if (doPatch == true){
    patches.patchEverything()
  }
}

module.exports = {
  run,
};
