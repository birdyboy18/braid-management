//require default looks for an entry point of index.js this sets up a 
//pattern where I can access models as follows: Models.:objectKey and then all methods beloning to the module that requires in
module.exports = {
  'User': require('./user'),
  'Braid': require('./braid'),
  'Thread': require('./thread'),
  'Modifier': require('./modifier'),
  'Entry': require('./entry'),
  'VerificationToken': require('./verificationToken')
}
