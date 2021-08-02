
const config = {
    Carulla:{
     user:process.env.CARULLA_USER,
     password:process.env.CARULLA_PASSWORD
     },
     
    Exito:{
         user:process.env.EXITO_USER,
         password:process.env.EXITO_PASSWORD
     },
    Olimpica:{
         user:process.env.OLIMPICA_USER,
         password:process.env.OLIMPICA_PASSWORD
     },
     api:process.env.URL || 'https://jetkart.co',
     vendor_uploud: true,
     send_products: true,
     sendProduct_for_lapsus:true,
     exptract_routes:false
}
module.exports = config
