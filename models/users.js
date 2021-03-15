const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create user Schema & model
const UserSchema = new Schema({
    prenom : {type: String},
    nom : {type: String},
    email : {type: String},
    password : {type: String},
});

const User = mongoose.model('user', UserSchema);
module.exports = User;