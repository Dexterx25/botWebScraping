const puppeteer = require('puppeteer')
const _ = require('lodash'); 
const fs  = require('fs')
const {sendProducts} = require('./submitProducts')
const config = require('../config')
const chalk = require('chalk')
const getDataProducts = async (section) =>{
 const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
       executablePath: '/usr/local/bin/chromium',
           args: [
              '--no-sandbox',
           ],
     //   headless: false,
        timeout: 0,
        waitUntil: 'load',
        slowMo:300
    });
      let page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
  const InitialPage = section.pageName == 'CruzVerde' ? 0 : 1


async  function routingPages (pageNumber = InitialPage) {
//console.warn('go to-->', `${section.homeUrl}${section.path}?start=${pageNumber * 12}`)
  
    await page.setDefaultNavigationTimeout(0);

   if(section.pageName == 'Carulla'){
    console.warn(`${section.homeUrl}${section.path}`)
    await page.goto(`${section.homeUrl}${section.path}`, {
      timeout: 0,
      waitUntil: 'networkidle2'

  });
}
await page.waitForNavigation({
  waitUntil: 'domcontentloaded'
})        

await page.setDefaultNavigationTimeout(0);
process.setMaxListeners(Infinity)
    const RunActions = async(page, section, datas) =>{

       if(section.pageName == 'Carulla') 
       try {
              await page.waitForSelector('#react-select-2-input',{timeout: 0});
              await page.click('#react-select-2-input')
              await page.type('#react-select-2-input', 'Barranquilla')
              await page.keyboard.press('Enter')
              await page.waitForSelector('button.exito-geolocation-3-x-primaryButton',  {timeout:0})
               await page.click('button.exito-geolocation-3-x-primaryButton')
              await page.waitForSelector('.vtex-search-result-3-x-galleryItem',   {timeout:0})
              await page.waitForSelector('section.vtex-product-summary-2-x-container', {timeout:0})
            //   await page.evaluate(async () => {
            //     await new Promise((resolve, reject) => {
            //         var totalHeight = 0;
            //         var distance = 100;
            //         var timer = setInterval(() => {
            //             var scrollHeight = document.body.scrollHeight;
            //             window.scrollBy(0, distance);
            //             totalHeight += distance;
        
            //             if(totalHeight >= scrollHeight){
            //                 clearInterval(timer);
            //                 resolve();
            //             }
            //         }, 100);
            //     });
            // });
        } catch (error) {
          console.warn(`there is a error ---> ${chalk.red([error])}`)
          return false;
        }


    }

  process.setMaxListeners(Infinity)
  
try{
  let datas = section.data
   let arrayReturn = []

  await RunActions(page, section, datas)
        let thisdata = await page.evaluate( async({datas, pageNumber, section} ) =>{
           
          const $products = document.querySelectorAll(datas.productCardClass)
          
              const data = []
              
          $products.length && $products.forEach(($product)=>{
                  data.push({
                    id:$product.querySelector(datas.product_nameClass) == null ? '' : `${$product.querySelector(datas.product_nameClass).textContent.trim()+"__"+section.pageName}`,
                    product_name:$product.querySelector(datas.product_nameClass) == null ? '' : $product.querySelector(datas.product_nameClass).textContent.trim(),
                    image:$product.querySelector(datas.imageClass) ? section.pageName == 'LaRebaja'   ? section.homeUrl+$product.querySelector(datas.imageClass).getAttribute("src").trim() : section.pageName == 'Carulla' ? $product.querySelector(datas.imageClass).getAttribute("src").trim().replace("?width=500&height=auto&aspect=true",".jpg") : '' : '',
                    category:$product.querySelector(datas.categoryClass) ?  $product.querySelector(datas.categoryClass).textContent.replace("\n\t\t\t", "").replace("\t\t", "") : section.pageName == 'Carulla' ? section.path : '',
                    price:$product.querySelector(datas.priceClass) ?  $product.querySelector(datas.priceClass).textContent.trim() : $product.querySelector(datas.priceDelete) ? $product.querySelector(datas.priceDelete) : '',
                    price_offer:$product.querySelector(datas.priceOfferClass) == null ? '' :  $product.querySelector(datas.priceOfferClass).textContent.trim().trim(),
                    pageName:section.pageName,
                    tokenVendor:section.tokenVendor
                  })
                })
            return{
                products:!data || data == undefined ? [] : data
              }
          }, {datas, pageNumber, section}) 
         console.warn('THIS DATA--->', thisdata)
   
       if(thisdata.products !== undefined && thisdata.products.length){   
          console.warn('entra en la condicion mediatica')
          await sendProducts(thisdata.products)
         
       }else{
       
       }
      }catch(error){
          console.warn('Este es el Error--->', error)
          return false;
      }
}
await routingPages()
 

}

module.exports = {
  getDataProducts
}
