var express = require('express');
var emailSvc = require('../services/email.svc');

var router = express.Router();

router.get('/test', function(req, res){
    emailSvc.sendEmail('5han7anu@gmail.com', 'no-reply@shantanu.org', 'Testing Email', 'Hello World!')
    .then(function(success){
        console.log(success);
        res.send('Email sent!');
    }, function(err){
        console.log(err);
        res.sendStatus(500);
    });
});

router.post('/', function(req, res){
    var contactEmail = req.body;
    var fromAddress = contactEmail.fromAddress;
    var subject = contactEmail.subject;
    var body = contactEmail.body;
    emailSvc.sendEmail('5han7anu@gmail.com', fromAddress, subject, body)
    .then(function(success){
        console.log('contact.ctrl.js: The email was sent!');
        console.log(success);
        res.sendStatus(204).send('Email sent');
    }, function(err){
        console.log('contact.ctrl.js: There is an error' + err);
        res.status(500);
    });
});

module.exports = router;