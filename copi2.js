const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const chalk = require('chalk')
const {sendProducts} = require('./src/submitProducts')


app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.listen(4000);
let sectonParam = {
    path:'/vinos-y-licores',
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
    pageName:'Carulla',
    homeUrl:'https://www.carulla.com'
};



(async function(thisSection){

const getDataProducts = async (section) =>{


 const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        executablePath: '/usr/local/bin/chromium',
            args: [
               '--no-sandbox',
            ],
        headless:false,
        timeout: 0,
     //   slowMo:300,
        waitUntil: 'load',
        defaultViewport:null
    })
    const width = 1024;
    const height = 1600;
      let page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      //await page.setViewport( { 'width' : width, 'height' : height } );
      page.waitForNavigation()


  const pageInitial = thisSection.pageName == 'Carulla' ? 1 : 0
      let AllProduct = []
async  function routingPages (pageNumber = pageInitial) {
    await page.setDefaultNavigationTimeout(0);
  if(thisSection.pageName == 'Carulla'){
    console.warn(`${section.homeUrl}${section.path}?page=${pageNumber}`)
    await page.goto(`${section.homeUrl}${section.path}`, {
      waitUntil: 'load',
      timeout: 0
  });
}
    const RunActions = async(page, section, datas) =>{
      await page.setDefaultNavigationTimeout(0);
      process.setMaxListeners(Infinity)
    
       if(section.pageName == 'Carulla'){ 
       try {

          /// if(pageNumber < 2){
            await page.waitForSelector('#react-select-2-input',{timeout: 0});
            await page.click('#react-select-2-input')
            await page.type('#react-select-2-input', 'Barranquilla')
            await page.keyboard.press('Enter')
            await page.waitForSelector('button.exito-geolocation-3-x-primaryButton',  {timeout:0})
            await page.click('button.exito-geolocation-3-x-primaryButton')
            await page.waitForSelector('.vtex-search-result-3-x-galleryItem',   {timeout:0})
            await page.waitForSelector('section.vtex-product-summary-2-x-container', {timeout:0})
      //     }
            await page.evaluate(async () => {
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
                }, 100);
            });
        });
               
        } catch (error) {
            console.warn('error with actions pagee')
          console.warn(`there is a error ---> ${chalk.red([error])}`)
          return false;
        }
    
    }

    }

    process.setMaxListeners(Infinity)
try {
    let datas = section.data
   console.warn('this is the datas--->', datas)
    await RunActions(page, section, datas)
  
        let thisdata = await page.evaluate( async({datas, section} ) =>{
          const $products = document.querySelectorAll(datas.productCardClass)
        
              const data = []
            console.warn('pructs selector--->', $products)
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
                products:data,
              }
          }, {datas, section}) 

         console.warn('THIS DATA--->', thisdata.products.length)
   
       
       
        if(pageNumber <= 90){
          await   routingPages(pageNumber + 1)

        if(thisdata.products !== undefined && thisdata.products.length){ 
                    const filteringArray = thisdata.products.reduce((acc, item)=>{
                            if(AllProduct.findIndex(i => i.id == item.id) == -1){
                                acc.push(item)
                            }
                        return acc
                    },[])
                    AllProduct = [...AllProduct, ...filteringArray]
                    console.warn('va esta cantidad de productos--->', AllProduct.length)
          }else{       
             await routingPages(pageNumber)
          }
         }else{
            await  sendProducts(AllProduct)
            browser.close()
         }
     } catch (error) {
        console.warn('this is the error--->', error)
     }
       
}
    await routingPages()
}
await getDataProducts(thisSection)



})(sectonParam)

