const puppeteer = require('puppeteer')
const _ = require('lodash'); 
const fs  = require('fs')
const {sendProducts} = require('./submitProducts')
const config = require('../config')
const chalk = require('chalk')

let finalArray = []
let arrayToSend = []
const getDataProducts = async (section) =>{
 const browser = await puppeteer.launch({
       ignoreHTTPSErrors: true,
       executablePath: '/usr/local/bin/chromium',
        args: [
          '--no-sandbox',
         ],
       // headless: false,
        timeout: 0,
        slowMo:300,
        defaultViewport:null,
        waitUntil: 'load',
    });
   
    let page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
  const InitialPage = section.pageName == 'CruzVerde' ? 0 : 2


async  function routingPages (pageNumber = InitialPage, intervalScrollDown = 3000, trys = 1) {

    await page.setDefaultNavigationTimeout(0);

  if(section.pageName == 'Carulla'){
    console.warn('iniciando con carulla')

    console.warn(`${section.homeUrl}${section.path}?page=${pageNumber}`)
    console.warn('THIS IS THE INTERVALSCROLLDOWN--->', intervalScrollDown)
    await page.goto(`${section.homeUrl}${section.path}?page=${pageNumber}`, {
      waitUntil:'load',
      timeout: 0
  });
}
    const RunActions = async(page, section, datas) =>{
      await page.setDefaultNavigationTimeout(0);
      process.setMaxListeners(Infinity)
       if(section.pageName == 'Carulla'){   
       try {
           if( trys >= 2){
            await page.waitForSelector('.css-1aihh89',{timeout: 0});
            await page.click('#react-select-2-input')
            await page.type('#react-select-2-input', 'Barra')
            await page.keyboard.press('Enter')
            await page.waitForSelector('button.exito-geolocation-3-x-primaryButton',  {timeout:0})
            await page.click('button.exito-geolocation-3-x-primaryButton')
            await page.waitForSelector('.vtex-search-result-3-x-galleryItem',   {timeout:0})
            await page.waitForSelector('section.vtex-product-summary-2-x-container', {timeout:0})
            trys = 1;
            intervalScrollDown = 3000
          }
           await page.evaluate(async ({intervalScrollDown}) => {
            await new Promise((resolve, reject) => {
                 var totalHeight = 0;
                 var distance = 100;
                 var timer = setInterval(() => {
                     var scrollHeight = document.body.scrollHeight;
                     window.scrollBy(0, distance);
                     totalHeight += distance;
                      if(totalHeight >= scrollHeight){
                         clearInterval(timer);
                         resolve();
                      }
                 }, intervalScrollDown);
              });
         },{intervalScrollDown});
             
        } catch (error) {
          console.warn(`there is a error ---> ${chalk.red([error])}`)
          return false;
        }
      }
    }

  process.setMaxListeners(Infinity)
  
try{
  let datas = section.data
   let arrayReturn = []

  await RunActions(page, section, datas, pageNumber)

        let thisdata = await page.evaluate(({datas, pageNumber, section} ) =>{          
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


          console.warn('this is the cuantity ---->', thisdata.products.length)
       if(thisdata.products !== undefined && thisdata.products.length){
            const filterArray = thisdata.products.reduce((acc, item)=>{
                if(finalArray.findIndex( i => i.id == item.id) == -1){
                    acc.push(item)
                }
              return acc
            },[])

            finalArray = [...finalArray, ...filterArray]
            arrayToSend = [...arrayToSend, ...filterArray]
           
       //   console.warn('[1] ===> Cantidad de productos hasta el momento--->', finalArray.length, "array toSend-->", arrayToSend.length)
       }else{
         await routingPages(pageNumber, intervalScrollDown + 1000, trys + 1)
       }
       if(trys <= 3){
           await routingPages(pageNumber + 1)
       }else{
         console.warn('its close')
         await browser.close()
       }

      }catch(error){
        console.warn('Este es el Error--->', error)

          await routingPages(pageNumber, intervalScrollDown + 1000, trys + 1)
          //return false;
      }
}
await routingPages()

}

setInterval(async ()=>{

  const limitedArray = arrayToSend.slice(-6)

  if(limitedArray.length){
    console.warn('[2] ===> Cantidad de productos hasta el momento--->', finalArray.length, "array toSend-->", arrayToSend.length)

    await sendProducts(limitedArray)
    await limitedArray.reduce((acc, item) =>{
      const thisArray = arrayToSend
      const index = thisArray.findIndex((i) => i.id == item.id)
      thisArray.splice(index, 1)
      arrayToSend = [...thisArray]
      return acc
    },[])
  }
 
    
}, 4000) 


module.exports = {
  getDataProducts
}
