const config = require('../config')
const axios = require('axios');
const fs = require('fs')
const sendProducts = async(datas) =>{
      
  let dataArray2 = []
 dataArray2 = datas.reduce((acc, item)=>{
    if(dataArray2.findIndex(e => e.id == item.id) == -1){
        acc.push(item)
    }
    return acc
  },[])
  const insertion = async (array) =>{
   await array.forEach(async(product)=>{
  console.warn('product to Upload-->', product)
    if(config.vendor_uploud){
      const {pageName} = product
      let category = product.category
  
      console.log('vendor upload', product)
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
        console.log("Response Data:", response.data);
      })
      .catch((error) => {
        console.log("Response Data:", error);
      })
    }
        
     })
  }
  const limitedArray = dataArray2.slice(-`${datas.length}`)
     if(config.sendProduct_for_lapsus == true){
          setInterval(async() => {
            await insertion(limitedArray)
          }, 10000);
     }

     if(config.send_products == true){
       console.warn('we deploying this automatic--->', limitedArray.length)
      await insertion(limitedArray)
   }else{
          console.warn('there is the datas to upload--->', limitedArray.length, dataArray2.length)
    try{
        const dataFile =  await fs.readFileSync('products.js','utf-8')
        //console.warn(dataFile)
        if(JSON.parse(dataFile).length){
            let dataFileParsin = JSON.parse(dataFile)
            if(limitedArray.length){
                console.warn('entra caso1', dataFileParsin.length)
               // dataFileParsin = [...dataFileParsin, ...arrayFile2]
  //  console.warn('Limited Array--->', limitedArray)
             const arrayToSubmit =  limitedArray.reduce((acc, item)=>{
                   if(JSON.parse(dataFile).findIndex(e => e.id == item.id) == -1){
                     console.warn('no hay este producto pero se guardará-->', item.product_name)
                      acc.push(item)
                    }

              return acc
           },[])
            console.warn('productos to save--->', arrayToSubmit.length)

             await fs.writeFileSync('products.js', JSON.stringify([...dataFileParsin, ...arrayToSubmit]) )
             const producstSaved = await fs.readFileSync('products.js','utf-8')
             console.warn('productos guardados hasta el momento--->', JSON.parse(producstSaved).length)
            }
        }else{
            console.warn('No hay productos guardados, se guardaran estos-->', limitedArray.length)
            await fs.writeFileSync('products.js', JSON.stringify(limitedArray))
        }
      }catch(error){
        console.warn('this is the error---->', error)
      }
    }
  }

  module.exports = 
  { sendProducts}