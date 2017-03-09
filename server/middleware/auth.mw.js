exports.isLoggedIn = function(req, res, next){
    if(req.user){
        next();
    }else{
        res.sendStatus(401);
    }
}

exports.isAdmin = function(req, res, next){
    console.log('checking to see if the user ' + req.user.firstname + ' is an admin');
    console.log('the user object is: ' + req.user);
    console.log('the user role is: ' + req.user.role);
    if(req.user.role === 'admin'){
        console.log('the logged in user is an admin');
        next();
    }else{
        console.log('the user is not an admin');
        res.sendStatus(401);
    }
}