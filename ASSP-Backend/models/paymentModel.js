// models/paymentModel.js
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); // Replace with your actual Stripe secret key

const createPaymentIntent = async (amount, currency, paymentMethodId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
        });
        return paymentIntent;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createPaymentIntent,
};
