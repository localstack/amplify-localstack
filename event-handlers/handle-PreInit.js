const eventName = 'PreInit';
const yesno = require('yesno'); 
const patches = require("../patches")

async function run(context, args) {
  const options = context.parameters.options
  let doPatch = false
  const value = options['use-localstack']
  if (value != undefined){
    if (value == 'true'){
      doPatch = true
    }else if(value == 'false'){
      doPatch = false
    }else{
      context.print.error(`ERROR: "${value}" is an invalid value for parameter --use-localstack. Please use true or false`)
    }

  }else{
    const doPatch = await yesno({
        question: 'Do you want to create the project in LocalStack? [y/N]',
        defaultValue: "n"
    });
  }

  if (doPatch == true){
    patches.patchEverything()
  }
}

module.exports = {
  run,
};
