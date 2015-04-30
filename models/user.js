var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

var user = new Schema({
  _id: Schema.Types.ObjectId,
  role: { type: String, default: 'user' },
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  last_logged_in: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  braids: [{ type: Schema.Types.ObjectId, ref: 'Braid'}],
  modifiers: [{ type: Schema.Types.ObjectId, ref: 'Modifier'}]
});

user.pre('save', function(cb){
  var user = this;

  if (!user.isModified('password')) { return cb(); };

  bcrypt.genSalt(5, function(err, salt) {
    if (err) { return cb(err); };

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if (err) { return cb(err); };

      user.password = hash;
      cb();
    });
  })
});

user.methods.verifyPassword = function(password, cb) {
  var user = this;

  bcrypt.compare(password, user.password, function(err, isMatch){
    if (err) { return cb(err); };
    cb(null,isMatch);
  })
}

user.virtual('fullname').get(function(name){
  return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('User', user);
