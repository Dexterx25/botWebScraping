
const Olimpica = 'https://www.olimpica.com'
const Exito = 'https://www.exito.com'
const Carulla = 'https://www.carulla.com'

module.exports = {
sites:[            
                {homeUrl:Carulla,
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
                }
       
                // {homeUrl:Olimpica,
                //  navigationType:'buttonSection',
                //  pageName:'Olimpica',
                //  fatherSectionClass:'.item-sub > a',
                // data:{
                //     productCardClass:'.vtex-product-summary-2-x-container',
                //      paginationClass:'div.vtex-search-result-3-x-totalProducts--layout > span',
                //     idClass:'a.productImage',
                //      product_nameClass:'div > h1.vtex-product-summary-2-x-productNameContainer',
                //      imageClass:'img.vtex-product-summary-2-x-imageNormal',
                //      categoryClass:'span.itemprop',
                //      priceClass:'div.olimpica-dinamic-flags-0-x-currencyContainer',
                //      priceOfferClass:'p.priceofer'
                //      },
                // },

                // {homeUrl:Exito,
                //   navigationType:'buttonSection',
                //   pageName:'Exito',
                //   fatherSectionClass:'.item-sub > a',
                //  data:{
                //      productCardClass:'.vtex-product-summary-2-x-container',
                //       paginationClass:'div.vtex-search-result-3-x-totalProducts--layout > span',
                //      idClass:'a.productImage',
                //       product_nameClass:'div > h1.vtex-product-summary-2-x-productNameContainer',
                //       imageClass:'img.vtex-product-summary-2-x-imageNormal',
                //       categoryClass:'span.itemprop',
                //       priceClass:'div.olimpica-dinamic-flags-0-x-currencyContainer',
                //       priceOfferClass:'p.priceofer'
                //       },
                //  }

    ]    
}
