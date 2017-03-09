var express = require('express');
var passport = require('passport');
var procedures = require('../procedures/users.proc');
var auth = require('../middleware/auth.mw');
var utils = require('../utils');

var router = express.Router();

//you only get to this point once you are past /api/users

//this is actually /api/users/login
router.post('/login', function(req, res, next){//its a post request because you are sending data to the database
    passport.authenticate('local', function(err, user, info){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        if(!user){ //login failure
            return res.status(401).send(info);
        }
        req.login(user, function(err){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }else{
                return res.send(user);
            }
        });
    })(req, res, next);
});

router.route('*')//everything after this point, we are ensuring the user is logged in.
    .all(auth.isLoggedIn);//includes all methods 'get, put, post, delete, etc'

router.get('/logout', function(req, res){//it could be a post request, but its a get request just so we could go to /api/users/logout to logout
    req.session.destroy(function(){
        req.logOut();
        res.sendStatus(204);
    });
});

//really /api/users
router.get('/', auth.isAdmin, function(req, res){//includes isAdmin, i.e. you can only view all users if you are an admin
    procedures.all().then(function(users){
        res.send(users);
    }, function(err){
        res.status(500).send(err);
    });
});

router.post('/', auth.isAdmin, function(req, res){//you can only post/create a user if you are an admin //post = create in this case
    var u = req.body;
    utils.encryptPassword(u.password)//u.password is the plaintext password that user is trying to log in with
    .then(function(hash){
        return procedures.create(u.email, hash, u.firstname, u.lastname, u.role);// calls users.proc.js specifically the create function
    }).then(function(id){
        res.status(201).send(id);
    }).catch(function(err){
        console.log(err);
        res.sendStatus(500);
    })
});

router.get('/me', function(req, res){//get request to /api/users/me
    res.send(req.user);//we are guaranteed that we are going to be logged in, and we are sending a user object with the current logged in user back with its properties (id, email, firstname, lastname) // passport sets req.user
});

router.get('/:id', auth.isAdmin, function(req, res){
    procedures.read(req.params.id).then(function(user){
        res.send(user);
    }, function(err){
        res.status(500).send(err);
    });
});

router.put('/:id', auth.isAdmin, function(req, res){
    var u = req.body;

    console.log('users.ctrl.js/router.put/:id - the request body is: ' + u);

    console.log('users.ctrl.js/router.put/:id - the user password is: ' + u.password);
    
    console.log('users.ctrl.js/router.put/:id - the user name : ' + u.firstname + ' ' + u.lastname);
    console.log('users.ctrl.js/router.put/:id - the email : ' + u.email);
    console.log('users.ctrl.js/router.put/:id - the role : ' + u.role);

    utils.encryptPassword(u.password)//u.password is the plaintext password that user is trying to log in with
    .then(function(hash){
        return procedures.update(req.params.id, u.firstname, u.lastname, u.email, hash, u.role);
    }).then(function(){
        console.log('users.ctrl.js/router.put/:id - user updated!');
        res.sendStatus(204);
    }, function(err){
        console.log('users.ctrl.js/router.put/:id - The error is: ' + err);
        res.status(500).send(err);
    });
});

router.delete('/:id', auth.isAdmin, function(req, res, next) {
    if (req.user.id === Number(req.params.id)) { // If the user is trying to delete him/herself, say Unauthorized
        res.sendStatus(401);
    } else {
        next();
    }
    }, function(req, res){
        procedures.destroy(req.params.id)
        .then(function(){
            console.log('users.ctrl.js/deleteuser: user deleted!');
            res.sendStatus(204);
        }, function(err){
            console.log('users.ctrl.js/deleteuser: there is an error ' + err);
            res.status(500);
        });
});

module.exports = router;