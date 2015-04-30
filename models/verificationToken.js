var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uuid = require('time-uuid');

var verificationToken = new Schema({
  _userId: { type: String, required: true },
  token: { type: String, required: true },
  created_at: { type: Date, required: true, default: Date.now, expires: '6h' }
}, { collection: 'verificationTokens' });

verificationToken.methods.createToken = function(cb) {
  var verificationToken = this;
  var token = uuid();
  verificationToken.token = token;
  verificationToken.save(function(err, token){
    if (err) { cb(err)};
    cb(null,token);
  })
}

module.exports = mongoose.model('VerificationToken', verificationToken);
