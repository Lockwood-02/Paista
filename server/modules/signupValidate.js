const bcrypt = require('bcrypt');
const { Users } = require('../dataAccessLayer/sequelize');

function signupIsValid(data){
    //check that the username does not already exist
    const existingName = Users.findOne({
        where:{
            username:data.username
        }
    })
    if(existingName){
        console.log("Username already exists");
        return false;
    }
    //check email does not exist
    const existingEmail = Users.findOne({
        where:{
            email:data.email
        }
    })
    if(existingEmail){
        console.log("email already exists");
        return false;
    }
    //check the password strength
    if(!passwordIsStrong(data.password)){
        console.log("weak password");
        return false;
    }
    return true;
}

function passwordIsStrong(password){
    if(password.length < 8){
        console.log('short');
        return false;
    }else if(!(/[A-Z]/.test(password))){
        console.log('no uppers');
        return false
    }else if( !(/[a-z]/.test(password))){
        console.log('no lowers');
        return false;
    }else if(!(/[!@#$%^&*()]/.test(password))){
        console.log('not special')
        return false;
    }else if(!(/[1234567890]/.test(password))){
        console.log('no number');
        return false
    }else{
        return true;
    }
}


module.exports = signupValidate;