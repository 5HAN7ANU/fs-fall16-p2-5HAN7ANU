var bcrypt = require('bcrypt');
const saltRounds = 12;

exports.encryptPassword = function(pw){
    return new Promise(function(resolve, reject){
        bcrypt.hash(pw, saltRounds, function(err, hash){//pw=plaintext password, constant saltRounds
            if(err){
                reject(err);
            }else{
                resolve(hash);//returns the generated hash on resolve
            }
        });
    });
}

exports.checkPassword = function(pw, hash){
    return new Promise(function(resolve, reject){
        bcrypt.compare(pw, hash, function(err, passwordMatches){//passwordMatches is either going to be true or false
            if(err){
                reject(err);
            }else{
                resolve(passwordMatches);
            }
        })
    })
}