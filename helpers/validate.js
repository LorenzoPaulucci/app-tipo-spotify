const validator = require("validator"); 
const { param } = require("../routes/user");

const validate = (params) => {
    let name = !validator.isEmpty(params.name) && validator.isAlpha(params.name, "es-ES", {ignore: " "}) && validator.isLength(params.name, {min: 3, max: undefined}); 
    let nick = !validator.isEmpty(params.nick) && validator.isLength(params.nick, {min: 3, max: 12});
    let email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    let password = !validator.isEmpty(params.password) && validator.isLength(params.password, {min: 4, max: undefined});

    if(!name || !nick || !email || !password) {
        return false;
    } else {
        return true;
    }   
}

const validateUpdate = (params) => {
    let name = true , nick = true, email = true, password = true;

    if(params.name) { name = validator.isAlpha(params.name, "es-ES", {ignore: " "}) && validator.isLength(params.name, {min: 3, max: undefined});}
    if(params.nick) { nick = validator.isLength(params.nick, {min: 3, max: 12});}
    if(params.email) { email = validator.isEmail(params.email);}
    if(params.password) { password = validator.isLength(params.password, {min: 4, max: undefined});}
    
    if( !name || !nick || !email || !password) {
        return false;
    } else {
        return true;
    }   
}

module.exports = { validate, validateUpdate };