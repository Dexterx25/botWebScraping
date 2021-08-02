const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser')
const puppeteer = require('puppeteer')
const chalk = require('chalk')
const fs = require('fs')
const config = require('./configSavedPro')
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.listen(4000);

let arrayProducts = [];



(async function (datas) {
    const productsSave  =  await fs.readFileSync('../products.js','utf-8')
    const parsingProductSave =  JSON.parse(productsSave);
    arrayProducts =  parsingProductSave.reduce((acc, item)=>{
        console.log('this product not here-->', item.product_name)
        acc.push({
            id:item.id,
            tokenVendor:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvamV0a2FydC5jbyIsImlhdCI6MTYyNzU4MjQ2MCwibmJmIjoxNjI3NTgyNDYwLCJleHAiOjE2MjgxODcyNjAsImRhdGEiOnsidXNlciI6eyJpZCI6IjMifX19.cbAqT2wY5m3DQYjF1vVN8zjxIwKSZQruJwDl0p3bu38',
            price:item.price,
            category:item.category,
            pageName:item.pageName,
            price_offer:item.price_offer,
            image:item.image,
            product_name:item.product_name,
        })
    return acc
  },[]).filter(e => e.category == "/vehiculos-y-ferreteria")
  console.log(arrayProducts.length)
const insertion = async (array) =>{
        await array.forEach(async(product)=>{
   //    console.warn('product to Upload-->', product)
         if(config.vendor_uploud){
           const {pageName} = product
           let category = product.category
       
           //console.log('vendor upload', product)
          await axios.post(`${config.api}/wp-json/wcfmmp/v1/products`,{
           name:product.product_name,
           regular_price:`${product.price.slice(1) * 1000}`,
           sale_price:product.price_offer !== '' ? `${product.price_offer.slice(1) * 1000}` : '',
           categories:[pageName == 'Carulla' 
           ? 86 :
                 '',  
             
             //comidas preparadas: 
             category == '/comidas-preparadas' ? 74 : '',
             //vinos y bebidas alcoholicas:
             category == '/vinos-y-licores' ? 66 : '',
             //bebidas y pasabocas-->
             category == '/bebidas-pasabocas-y-dulces' ? 67 : '',
             //delicatessen
             category == '/delicatessen-y-panaderia' ? 68 : '',
             // panaderia
             category == '/delicatessen-y-panaderia' ? 69 : '',
             //pollos, carnes, pescados -->
             category == '/pollo-carnes-y-pescado' ? 70 : '',
             //frutas y verduras 
             category == '/frutas-y-verduras' ? 71 : '',
             //despensa 
             category == '/despensa' ? 72 : '',
             //lacteos, huevos, refigerados --> 
             category == '/lacteos-huevos-y-refrigerados' ? 73 : '',
             //congelados
             category == '/congelados' ? 75 : '',
             //Limpiza Hogar
             category == '/limpieza-del-hogar' ? 76 : '',
             ///salud-y-belleza 
             category == '/salud-y-belleza' ? 77 : '',
             //Mascotas => 
             category == '/mascotas' ? 78 : '',
             ///electrodomesticos
             category == '/electrodomesticos' ? 79 : '',
             ///tecnologia
             category == '/tecnologia' ? 80 : '',
             ///moda-y-accesorios
             category == '/moda-y-accesorios' ? 81 : '',
             // /deportes-y-tiempo-libre
             category == '/deportes-y-tiempo-libre' ? 82 : '',
             //hogar
             category == '/hogar-y-decoracion' ? 83  : '',
           //bebés y jugueteria
             category == '/bebes-y-jugueteria' ? 84 : '',
             ///vehiculos-y-ferreteria
             category == '/vehiculos-y-ferreteria' ? 85 : ''
     
            ],
           gallery_images:[{"src":product.image}],
           featured_image:{"src":product.image},
         },
           { headers: { Authorization: `Bearer ${product.tokenVendor}` } }
           )  .then(async(response) => {
          // console.log("Response Data:", response.data);
           })
           .catch((error) => {
             console.log("Response Data ERROR:", error);
           })
         }
             
          })
}

      
 setInterval(async()=>{
     if(config.sendProduct_for_lapsus == true){
         const limitedArray = arrayProducts.slice(-10)
         console.log('limitedArray-->', limitedArray.map(e => e.product_name))
        if(limitedArray.length){
             await insertion(limitedArray)
             await limitedArray.reduce((acc, item) =>{
                 const thisArray = arrayProducts
                 const index = thisArray.findIndex((i) => i.id == item.id)
                 thisArray.splice(index, 1)
                 arrayProducts = [...thisArray]
                 return acc
               },[])       
             console.log('new dataArray-->', arrayProducts.length)
           }       
        }
 }, 10000)
    
})(arrayProducts)