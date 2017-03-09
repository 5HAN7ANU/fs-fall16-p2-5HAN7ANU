var passport = require('passport');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);//requires mysql-session brings in a function, and we tell it to execute with session as a parameter// links mysql session to express
var LocalStrategy = require('passport-local').Strategy;//enables passport to authenticate un and pw
var userProc = require('../procedures/users.proc');
var pool = require('./db').pool;
var utils = require('../utils');

function configurePassport(app){
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done){//changed this part in class 10/13/16
        userProc.readByEmail(email)
        .then(function(user){
            console.log('got user for authenticate');
            console.log(user);
            if(!user){
                return done(null, false, { message: 'Incorrect Login!' });
            }
            console.log('checking password');
            utils.checkPassword(password, user.password)//new code
            .then(function(passwordMatches){
                console.log('password checked!');
                console.log(passwordMatches);
                if(passwordMatches){
                    // delete user.password;
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Incorrect Login!'});
                }
            }, console.log);
        }, function(err){
            return done(err); 
        });
    }));

    passport.serializeUser(function(user, done){
        done(null, user.id);//this is the bare minimum required for passport to uniquely identify a user in the session
    });

    passport.deserializeUser(function(id, done){
        userProc.read(id).then(function(user){//references the procedure function that eventually calls getUsers()
            done(null, user);//this happens after you have already logged in. this is what sets req.user
        }, function(err){
            done(err);
        });
    });

    var sessionStore = new MySQLStore({//basically we are ensuring that the sessions are maintained by express in a table in the db and not in memory
        createDatabaseTable: true
    }, pool);

    app.use(session({//starting the express session. session is the variable declared at the top of the page.
        secret: 'u6hK5Zx2lx1N',//encrypts the cookie
        store: sessionStore,
        resave: false,//performance thing 
        saveUninitialized: false//only create sessions and save them to db from users that are logged in
    }));

    app.use(passport.initialize());//starts up passport
    app.use(passport.session());//telling passport that express is going to be cooperating with the session
}

module.exports = configurePassport;