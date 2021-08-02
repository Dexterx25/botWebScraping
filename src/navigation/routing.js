const {getDataProducts} = require('../scrape')
const config = require('../../config')
const chalk = require('chalk')

const exploringSections = async(sections) =>{
  //  await Promise.all(getDataProducts(sections))
let arrayAsociative = []
arrayAsociative = [...arrayAsociative, ...sections]
  arrayAsociative = arrayAsociative.filter(e => e.path !== '/frutas-y-verduras' && e.path !== '/despensa' && e.path !== '/lacteos-huevos-y-refrigerados' && e.path !== '/congelados'  && e.path !== '/limpieza-del-hogar' && e.path !== '/salud-y-belleza'  && e.path !== '/electrodomesticos' && e.path !== '/tecnologia' && e.path !== '/moda-y-accesorios' && e.path !== '/deportes-y-tiempo-libre' && e.path !== '/hogar-y-decoracion' && e.path !== '/bebes-y-jugueteria' && e.path !== '/vehiculos-y-ferreteria');
 while (arrayAsociative.length) {
  let firstPosition = arrayAsociative[0]
  console.warn('we will iter this element-->', firstPosition, "Now this is the size of sections-->", arrayAsociative.length)
    await getDataProducts(firstPosition).then(()=>{
     //   if(res.length){
          const thisArray = arrayAsociative
          const index = thisArray.findIndex((i) => i.path == firstPosition.path)
          thisArray.splice(index, 1)
          arrayAsociative = [...thisArray] 
      //  }else{
       //   console.warn('This section didn`t scraping, maybe later')
       //   arrayAsociative.push(firstPosition)
       // }
     
    })
  }
}
     

module.exports = {
    exploringSections
}
