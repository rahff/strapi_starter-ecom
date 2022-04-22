'use strict';

const stripePrvKey = process.env["STRIPE_PRVKEY"]
const stripePubKey = process.env["STRIPE_PUBKEY"]
const Stripe = require('stripe');
const stripe = Stripe(stripePrvKey);
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::checkout-session.checkout-session', ({ strapi }) =>  ({
    // Replacing a core action
    async create(ctx) {
        
            const { body } = ctx.request;
            const sessionConfig = await strapi.service('api::checkout-session.checkout-session').getSessionConfig(body);
            const session = await stripe.checkout.sessions.create(sessionConfig);
            if(session.id){
                const data = {checkoutItems: sessionConfig.line_items, sessionId: session.id, payement_process: body.paymentProcess, callbackUrl: body.callbackUrl}
                const entity = await strapi.service('api::checkout-session.checkout-session').create({data});
            }
            if(body.paymentProcess === "stripe"){
                ctx.body = { stripe: {sessionId: session.id, pubKey: stripePubKey}, paypal: null}
            }else{
                ctx.body = {paypal: {}}
            }
  }
}));
 
    
