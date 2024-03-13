async function run (context) {
  // print out the help message of your plugin
  context.print.info('When mplementing this provider, the resources will be created into LocalStack')
}

module.exports = {
  run
}
