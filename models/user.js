const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const userSchema = new Schema({
    email: {type: String, require: true},
    password: {type: String, require: true}
});

userSchema.method.encryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5), null);
};

userSchema.method.validPassword = function(password){
    return bcrypt.compareSync(password, this,password);
};

module.exports = mongoose.model('User', userSchema);