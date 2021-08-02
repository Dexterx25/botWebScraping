const puppeteer = require('puppeteer')
const {exploringSections} = require('./routing')
const chalk = require('chalk')
const fs = require('fs')
const config = require('../../config')
const RunActions = async (page, thePage) =>{
    if(thePage.pageName == 'Carulla'){

        try{
              await page.waitForSelector('#react-select-2-input')
              await page.type('#react-select-2-input', 'Barran')
              await page.keyboard.press('Enter')
              await page.waitForSelector('button.exito-geolocation-3-x-primaryButton',  {timeout:0})
              await page.click('button.exito-geolocation-3-x-primaryButton')
              await page.waitForSelector('#category-menu', {timeout:0});
              await page.click('#category-menu')
              console.log('Cantidad--->', (await page.$$('span.pointer')).length)
             // thePage['paths'] = (await page.$$('span.pointer'))
             await page.waitForSelector('p.pointer')
              thePage['pathsCount'] = (await page.$$('p.pointer')).length
              //  const paths = (await page.$$('p.pointer'))
              //      for(const path of paths ){
              //         console.warn('path-->',await(await path.getProperty('innerText'))._remoteObject.value)
              //       }

      }catch(err){
        console.warn("este es el error al navegar---->", err)
        }

    }
}

const exploringPages = async(thePage) =>{
   let myPage = thePage
  const browser = await puppeteer.launch(
    {
   //  headless:false,
     slowMo:300,
     defaultViewport:null
    }
  )
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0);

    await page.goto(thePage.homeUrl, { waitUntil: 'load', timeout: 0 })
  process.setMaxListeners(Infinity)
//actions--->
await RunActions(page, thePage)

try{

  let thisItem = thePage
  let finalArray = []
  if(config.exptract_routes == true){
    for (let i = 0; i < thisItem.pathsCount; i++) {
      await page.waitForSelector('p.pointer')
      const route = (await page.$$('p.pointer'))
      console.warn(`Extracting route for this Category--> ${chalk.blue(await(await route[i].getProperty('innerText'))._remoteObject.value)}`)
      await page.waitForSelector('span.pointer')
         const path = (await page.$$('span.pointer'))[i]
        await path.click()
    
        const dataNavigation = await page.evaluate( ({thisItem}) =>{
            //await page.waitForSelector(thisItem.fatherSectionClass);
            const $sections = document.querySelectorAll(thisItem.fatherSectionClass)
            const data = []
            $sections && $sections.forEach(($section) => {
              data.push({
                path:$section ? $section.getAttribute('href') : '',
                data:thisItem.data,
                pageName:thisItem.pageName,
                homeUrl:thisItem.homeUrl,
                tokenVendor:thisItem.token
                })
            });
            return{
              sections:data
            }
          }, {thisItem})
           console.warn('this is the sections xddd--->', dataNavigation)
            finalArray = [...finalArray, ...dataNavigation.sections] 
            console.warn('van esta cantidad--->', chalk.red(finalArray.length))
            await page.waitForSelector('.exito-category-menu-3-x-backArrowSubCategory')
            await page.click('.exito-category-menu-3-x-backArrowSubCategory')
          
      }
   
  }else{
    try {
      console.log('coming to saved routes')
      const routingBackup = await fs.readFileSync('routes.js','utf-8')
      const parsingBackup = JSON.parse(routingBackup).reduce((acc, item)=>{
            acc.push({
                  path:item.id,
                  data:thisItem.data,
                  pageName:thisItem.pageName,
                  homeUrl:thisItem.homeUrl,
                  tokenVendor:thisItem.token 
            })
        return acc
      },[])
      console.warn('routes--', parsingBackup.length)
      finalArray = [...finalArray, ...parsingBackup]
    } catch (error){
     console.log('error saved routes--', error) 
    }
  
  }

  //  await  exploringSections(finalArray)

      if(finalArray.length){
               console.warn(`${chalk.greenBright('[Routes extraction each category succefull]')}`)
            await browser.close()
           let routesArray = finalArray.reduce((acc, item)=>{
                  acc.push({id:item.path})
            return acc
           },[])
            try{
              const dataFile =  await fs.readFileSync('routes.js','utf-8')
              //console.warn(dataFile)
              if(JSON.parse(dataFile).length){
                  let dataFileParsin = JSON.parse(dataFile)
                  if(routesArray.length){
                      console.warn('entra caso1', dataFileParsin.length)
                     // dataFileParsin = [...dataFileParsin, ...arrayFile2]
          console.warn('Limited Array--->', routesArray)
                   const arrayToSubmit =   routesArray.reduce((acc, item)=>{
                         if(JSON.parse(dataFile).findIndex(e => e.id == item.id) == -1){
                            acc.push({id:item.path})
                          }
                       return acc
                 },[])
                  console.warn('Se guardará esta cantidad--->', arrayToSubmit.length)
                  console.warn('productos to save--->', arrayToSubmit)
                 await fs.writeFileSync('file.js', JSON.stringify([...dataFileParsin, ...arrayToSubmit]) )
                     
                  }
              }else{
                  console.warn('entra caso2')
                  await fs.writeFileSync('routes.js', JSON.stringify(routesArray))
              }
            }catch(error){
              console.warn('this is the error---->', error)
            }
        await  exploringSections(finalArray)

        }else{
          console.log('error dimensions')
        }   
      }catch(error){
console.warn('Este es el error al sacar navegacciones--->', error)
}
 // await browser.close()
}

module.exports = {
    exploringPages
}
