var db = require('../config/db');

exports.all = function(){
    return db.rows('GetUsers');
}

exports.readByEmail = function(email){
    return db.row('GetUserByEmail', [email]);
}

exports.read = function(id){
    return db.row('GetUser', [id]);
}

exports.create = function(email, hash, firstname, lastname, role){
    return db.row('InsertUser', [email, hash, firstname, lastname, role]);
}

exports.destroy = function(id){
    return db.empty('deleteUser', [id]);
}

exports.update = function(id, firstname, lastname, email, password, role){
    console.log(arguments);
    return db.empty('UpdateUser', [id, firstname, lastname, email, password, role]).then(function() {
        console.log('made it!');
    });
}