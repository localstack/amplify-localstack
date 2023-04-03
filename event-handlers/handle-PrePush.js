const yesno = require('yesno'); 
const patches = require("../patches")

async function run(context, args) {
  const options = context.parameters.options
  const inputValue = options['use-localstack']
  let doPatch = false
  if (inputValue == undefined){
    doPatch = await yesno({
        question: 'Do you want to create the resource in LocalStack? [y/N]',
        defaultValue: "n"
    });
  }else if (inputValue == 'true'){
    doPatch = true
  }else if (inputValue == 'false'){
    doPatch = false
  }else{
    context.print.error(`ERROR: "${value}" is an invalid value for parameter --use-localstack. Please use true or false`)
  }

  if (doPatch == true){
    patches.patchEverything()
  }
}

module.exports = {
  run,
};
