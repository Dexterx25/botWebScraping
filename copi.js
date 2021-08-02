const puppeteer = require('puppeteer')
const _ = require('lodash'); 
const fs  = require('fs')
const {sendProducts} = require('./submitProducts')
const config = require('../config')
const chalk = require('chalk');
const { resolve } = require('path');
const getDataProducts = async (section) =>{
 const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        executablePath: '/usr/local/bin/chromium',
           args: [
              '--no-sandbox',
           ],
     //  
     headless: false,
        timeout: 0,
        waitUntil: 'load',
        slowMo:300
    });
      let page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
  const InitialPage = section.pageName == 'CruzVerde' ? 0 : 1

let arrayConditional = []
async  function routingPages (pageNumber = InitialPage) {
//console.warn('go to-->', `${section.homeUrl}${section.path}?start=${pageNumber * 12}`)
  
    await page.setDefaultNavigationTimeout(0);

  if(section.pageName == 'Carulla'){
    console.warn(`${section.homeUrl}${section.path}`)
    await page.goto(`${section.homeUrl}${section.path}`, {
      waitUntil: 'load',
      timeout: 0
  });
}
    const RunActions = async(page, section, datas) =>{

      await page.setDefaultNavigationTimeout(0);
      process.setMaxListeners(Infinity)

       if(section.pageName == 'Carulla') 
       try {
              await page.waitForSelector('.css-1aihh89',{timeout: 120000});
              await page.click('#react-select-2-input')
              await page.type('#react-select-2-input', 'Barranquilla')
              await page.keyboard.press('Enter')
              await page.waitForSelector('button.exito-geolocation-3-x-primaryButton',  {timeout:0})
              await page.click('button.exito-geolocation-3-x-primaryButton')
              await page.waitForSelector('.vtex-search-result-3-x-galleryItem',   {timeout:0})
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
          await  new Promise((resolve, reject)=>{
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
    
          const $products = document.querySelectorAll(datas.productCardClass)
        
              const data = []
              
          $products.length && $products.forEach(($product)=>{
                  data.push({
                    id:$product.querySelector(datas.product_nameClass) == null ? '' : `${$product.querySelector(datas.product_nameClass).textContent.trim()+"__"+section.pageName}`,
                    product_name:$product.querySelector(datas.product_nameClass) == null ? '' : $product.querySelector(datas.product_nameClass).textContent.trim(),
                    image:$product.querySelector(datas.imageClass) ? section.pageName == 'LaRebaja'   ? section.homeUrl+$product.querySelector(datas.imageClass).getAttribute("src").trim() : section.pageName == 'Carulla' ? $product.querySelector(datas.imageClass).getAttribute("src").trim().replace("?width=500&height=auto&aspect=true",".jpg") : '' : '',
                    category:$product.querySelector(datas.categoryClass) ?  $product.querySelector(datas.categoryClass).textContent.replace("\n\t\t\t", "").replace("\t\t", "") : section.pageName == 'Carulla' ? section.path : '',
                    price:$product.querySelector(datas.priceClass) == null ?  $product.querySelector(datas.priceDelete).textContent : $product.querySelector(datas.priceClass).textContent.trim(),
                    price_offer:$product.querySelector(datas.priceOfferClass) == null ? '' :  $product.querySelector(datas.priceOfferClass).textContent.trim().trim(),
                    pageName:section.pageName,
                    tokenVendor:section.tokenVendor
                  })
                })
              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
            return{
                products:!data || undefined ? [] : data,
                totalPages:3,
                actualPage:pageNumber,
              }
            }, 1000)
          })
          }, {datas, pageNumber, section}) 
         console.warn('THIS DATA--->', thisdata)
    // arrayReturn.push(...thisdata.products)
      if(thisdata.products.length > 0){
        arrayConditional = [...arrayConditional, ...thisdata.products]
        console.warn('entra en la condicion mediatica')
        await page.waitForSelector('.vtex-button__label',{timeout:0})
        await page.click('.vtex-button__label')
      }
    
    if(thisdata.products !== undefined && thisdata.products.length){      
      await browser.close()

        // await sendProducts(thisdata.products)
         //.then(()=>{
        //   return false;
        // })
      }

    // if(thisdata.actualPage <= thisdata.totalPages && section.pageName !== 'Olimpica'){
    //   await routingPages(pageNumber + 1)
    //   }
      if(thisdata.products.length){
        return thisdata.$products
      }
      
      }catch(error){
          console.warn('Este es el Error--->', error)
          return false;
      }
  //console.warn('how-->', arrayReturn.length)
}
return new Promise(async(resolve, reject) =>{
    if(!arrayConditional.length){
      resolve(routingPages())
      //.then(async()=>{
      //})
    }
})  

}

module.exports = {
  getDataProducts
}

