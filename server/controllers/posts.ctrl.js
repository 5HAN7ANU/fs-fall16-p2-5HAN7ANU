var express = require('express');
var procedures = require('../procedures/posts.proc');
var auth = require('../middleware/auth.mw');

var router = express.Router();

router.route('/')
    .get(function(req, res){
        procedures.all()
        .then(function(posts){
            res.send(posts);
        }, function(err){
            console.log(err);
            res.status(500).send(err);
        });
    })
    .post(auth.isLoggedIn, function(req, res){
        procedures.create(req.body.title, req.body.userid, req.body.categoryid, req.body.content)
        .then(function(id){
            res.status(201).send(id);
        }, function(err){
            console.log(err);
            res.send(500).send(err);
        });
    });

router.route('/:id')
    .get(function(req, res){
        procedures.read(req.params.id)
        .then(function(post){
            res.send(post);
        }, function(err){
            console.log(err);
            res.status(500).send(err);
        });
    })
    .put(auth.isLoggedIn, function(req, res){
        procedures.update(req.params.id, req.body.title, req.body.content, req.body.categoryid)
        .then(function(){
            res.sendStatus(204);
        }, function(err){
            console.log(err);
            res.status(500).send(err);
        });
    })
    .delete(auth.isLoggedIn, auth.isAdmin, function(req, res){
        procedures.destroy(req.params.id)
        .then(function(){
            res.sendStatus(204);
        }, function(err){
            console.log(err);
            res.status(500).send(err);
        });
    });

module.exports = router;