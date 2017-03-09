var express = require('express');
var stripeSVC = require('../services/stripe.svc');

var router = express.Router();

//actually /api/donations/
router.post('/', function(req, res){
    var amount = Number(req.body.amount);
    amount = amount*100;//stripe works with pennies

    //assuming front-end is sending POST request here with a request body with properties amount and token
    stripeSVC.chargeCard(req.body.token, amount, 'Donation for Shantanu')
    .then(function(success){
        console.log(success);
        res.sendStatus(204);
    }, function(err){
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;