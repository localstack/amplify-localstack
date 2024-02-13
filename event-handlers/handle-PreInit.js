const yesno = require('yesno')
const patches = require('../patches')

async function run (context, args) {
  const options = context.parameters.options
  const inputValue = options['use-localstack']
  let doPatch = false
  if (inputValue === undefined) {
    doPatch = await yesno({
      question: 'Do you want to create the project in LocalStack? [y/N]',
      defaultValue: 'n'
    })
  } else if (['true', 'yes'].includes(inputValue.toLowerCase())) {
    doPatch = true
  } else if (['false', 'no'].includes(inputValue.toLowerCase())) {
    doPatch = false
  } else {
    context.print.error(`ERROR: "${inputValue}" is an invalid value for parameter --use-localstack. Please use true or false`)
  }

  if (doPatch === true) {
    patches.patchEverything(context)
  }
}

module.exports = {
  run
}
