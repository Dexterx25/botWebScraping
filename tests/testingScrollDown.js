const puppeteer = require('puppeteer')
const _ = require('lodash'); 
//const {sendProducts} = require('./submitProducts')
const config = require('../config')
const chalk = require('chalk')
const getDataProducts = async (section) =>{
 const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        executablePath: '/usr/local/bin/chromium',
           args: [
              '--no-sandbox',
           ],
        headless: false,
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
      waitUntil: 'load',
      timeout: 0
  });
}
    const RunActions = async(page, section, datas) =>{

      await page.setDefaultNavigationTimeout(0);
      process.setMaxListeners(Infinity)

       if(section.pageName == 'Carulla') {
       try {
           console.warn('Se hacen acciones')
              await page.waitForSelector('.css-1aihh89',{timeout:0});
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
    }

  process.setMaxListeners(Infinity)
  
try{
  let datas = section.data
   let arrayReturn = []

  await RunActions(page, section, datas)
        let thisdata = await page.evaluate( async({datas, pageNumber, section} ) =>{
       await  new Promise((resolve, reject)=>{
        var totalHeight = 0;
        var distance = 70;
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
                    if(totalHeight >= scrollHeigh){
                        clearInterval(timer);
                        resolve();
                    }
                   
                return{
                    products:!data || undefined ? [] : data,
                    totalPages:5,
                    actualPage:pageNumber,
                    }
                    
                }, 1000)
              })
          }, {datas, pageNumber, section}) 
         console.warn('THIS DATA--->', thisdata)
         if(totalHeight/2 == scrollHeight){
             console.warn('entra en la condicion mediatica')
            await page.waitForSelector('.vtex-button__label',{timeout:0})
            await page.click('.vtex-button__label')
        }
      }catch(error){
          console.warn('Este es el Error--->', error)
          return false;
      }
}
await routingPages()
 

}


  const  thisSection = [
      {
        path: '/vinos-y-licores',
        data:{homeUrl:'https://www.carulla.com',
                navigationType:'buttonSection',
                pageName:'Carulla',
                fatherSectionClass:'li.exito-category-menu-3-x-colorViolet > a',
              data:{
                  productCardClass:'section.vtex-product-summary-2-x-container',
                    paginationClass:'div.vtex-search-result-3-x-totalProducts--layout > span',
                    idClass:'a.productImage',
                    product_nameClass:'div.exito-product-summary-3-x-nameContainer',
                    imageClass:'div.vtex-product-summary-2-x-imageContainer > img',
                    categoryClass:'span.itemprop',
                    priceClass:'div.search-result-exito-vtex-components-selling-price > span',
                    priceDelete:'span.exito-vtex-components-4-x-priceTagDel > del > span',
                    priceOfferClass:'div.exito-vtex-components-4-x-alliedDiscountPrice > span'
                    },
              },
        pageName: 'Carulla',
        homeUrl: 'https://www.carulla.com',
        tokenVendor: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvamV0a2FydC5jbyIsImlhdCI6MTYyNTE3ODg5NSwibmJmIjoxNjI1MTc4ODk1LCJleHAiOjE2MjU3ODM2OTUsImRhdGEiOnsidXNlciI6eyJpZCI6IjMifX19.SdNrGC-cMKYB8FIpkT8E5GnY2hXBpZLASl7MELHnnp0'
      }
    ]


  getDataProducts(thisSection)

