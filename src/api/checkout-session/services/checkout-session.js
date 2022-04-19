'use strict';

/**
 * checkout-session service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::checkout-session.checkout-session', ({strapi})=>({
    async getSessionConfig(data){
        const line_items = await this.createLineItems(data.items);
        const sessionConfig = {
            success_url: `${data.callbackUrl}?success=true`,
            cancel_url: `${data.callbackUrl}?success=false`,
            line_items : line_items,
            mode: "payment"

        }
        return sessionConfig;
    },
    async createLineItems(data){
       try{
           const items = [];
           for (const item of data) {
               const product = await strapi.service('api::product.product').findOne(item.product.id);
               const line_items =  {
                   price_data: {
                       currency: 'EUR',
                       unit_amount: product.price,
                       product_data:{
                           name: product.name
                       }
                   },
                   quantity: item.quantity
               }
               items.push(line_items);
           }
           return items;
       }catch(e){
           return e
       }

    }
}));

