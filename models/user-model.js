const {Schema,model} = require('mongoose')

const UserSchema = new Schema({
    email:{type:String,unique:true,require},
    password:{type:String,require}

});

module.exports = model('User',UserSchema);