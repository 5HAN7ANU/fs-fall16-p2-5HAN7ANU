var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var prerender = require('prerender-node');
var path = require('path');
var api = require('./api');
var configurePassport = require('./config/passport');

var clientPath = path.join(__dirname, '../client');
var app = express();

prerender.set('prerenderToken', process.env.PRERENDER_TOKEN);
app.use(prerender);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(clientPath));

configurePassport(app);

app.use('/api', api);//api router

app.get('*', function(req, res, next){
    if(isAsset(req.url)){
        return next();
    }
    else{
        res.sendFile(path.join(clientPath, 'index.html'));
    }
});

app.listen(process.env.PORT || 3000);

function isAsset(path){
    var pieces = path.split('/');
    if(pieces.length === 0){
        return false;
    }
    var lastPiece = pieces[pieces.length - 1];
    if(path.indexOf('/api') !== -1 || path.indexOf('/?') !== -1){
        return true;
    }
    else if (lastPiece.indexOf('.') !== -1){
        return true;
    }
    else{
        return false;
    }
}