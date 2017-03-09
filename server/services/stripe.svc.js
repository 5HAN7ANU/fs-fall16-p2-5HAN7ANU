var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.chargeCard = function(token, amountToCharge, descriptionOfCharge){
    return stripe.charges.create({
        amount: amountToCharge,
        currency: 'usd',
        source: token,
        description: descriptionOfCharge//what will appear on the credit card statement
    });
}