var WooCommerceAPI = require('woocommerce-api');
 
var WooCommerce = new WooCommerceAPI({
  url: 'https://jetkart.co/',
  consumerKey: 'ck_3d47c6699695eceeae381ccfeec6da974df97008',
  consumerSecret: 'cs_26a3907adbf24451a534ffaec92fc24b923135a4',
  wpAPI: true,
  version: 'wc/v1'
})
WooCommerce.getAsync('products/categories?page=3').then((result) => {
    console.log(JSON.stringify(result.body));
 this.WooCommerceResult=result.toJSON().body;
    //return Promise.resolve(JSON.parse(result.toJSON().body));
 
   // return JSON.parse(result.toJSON().body);
  });