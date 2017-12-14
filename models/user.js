//how a user is saved into the databse
const mongoose= require("mongoose");
const UserSchema = mongoose.Schema ({
    email: {
        type:String, 
        required: true
    },
    username: {
        type:String, 
        required: true
    },
    password: {
        type:String, 
        required: true
    },
    access_token: {
        type:String, 
        required:true
    },
    refresh_token: {
        type:String, 
        required:true
    },
    cal_id: {
        type: String, 
        required:true
    }

});


const User = module.exports = mongoose.model('User', UserSchema);