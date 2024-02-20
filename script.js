// console.log('====================================');
// console.log("Connected");
// console.log('====================================');


let headerImage = document.getElementById("header-image-image"); 
let restImages = document.querySelector(".rest-images");
let previousPrice = document.querySelector(".previous-price"); 
let currentPrice = document.querySelector(".price-and-disscount h1"); 
let description = document.querySelector(".description"); 
let colorPalate = document.querySelector(".color-palate"); 
let sizeCatagories = document.querySelector(".size-categories"); 
let totalQuantity = document.querySelector(".quantity span"); 
let qunatityAndAddToCartSection = document.querySelector(".quantity-and-addtocart-buttons"); 
let vendersName = document.querySelector(".venders-name span");
let productName = document.querySelector(".venders-name h1");  
let discountAmount = document.querySelector(".price-and-disscount span"); 
let spinner = document.querySelector(".spinner"); 
let container = document.querySelector(".container"); 

let orderedItemTitle; 
let orderedItemColor; 
let orderedItemSize; 
let svg = '<svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
'<path fill-rule="evenodd" clip-rule="evenodd" d="M23.2536 0.252736C23.8044 0.668905 23.9135 1.4528 23.4973 2.00361L10.7473 18.8786C10.5376 19.1563 10.2215 19.3339 9.87529 19.3688C9.52904 19.4037 9.18393 19.2926 8.92299 19.0624L0.422988 11.5624C-0.094667 11.1056 -0.144037 10.3157 0.312718 9.79804C0.769472 9.28039 1.55939 9.23102 2.07704 9.68777L9.56573 16.2954L21.5027 0.496529C21.9188 -0.0542836 22.7027 -0.163433 23.2536 0.252736Z" fill="white"/>' +
'</svg>';


 

const api = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json"; 
async function fetchData(){ 
    spinner.classList.remove("d-none"); 
    container.classList.add("d-none"); 
   try{ 
    let response = await fetch(api); 
    let result = await response.json(); 
    displayData(result);
    console.log(result); 
   }
   catch(e){ 
    console.log(e.message); 
   }
   finally{ 
    spinner.classList.add("d-none"); 
    container.classList.remove("d-none");
   }
}


function displayData(data){     
    headerImage.src = `${data.product.images[0].src}`; 
    orderedItemTitle = data.product.title; 

    vendersName.textContent = `${data.product.vendor}`; 
    productName.textContent = `${orderedItemTitle}`; 
    currentPrice.textContent = `${data.product.price}`; 

    let prevPrice = parseFloat(data.product.compare_at_price.substring(1));
let afterDiscount = parseFloat(data.product.price.substring(1));

    let difference = prevPrice - afterDiscount; 
    let discount = Math.floor((100/prevPrice)*difference); 
    discountAmount.textContent = `${discount}% off`; 
    

    // setting the rest of the images..
    data.product.images.forEach(image => {
        let restImagesImage = document.createElement("div"); 
        restImagesImage.className = "rest-images-image-1"; 
        let img = document.createElement("img"); 
        img.src = `${image.src}`; 
        restImagesImage.append(img); 
        restImages.appendChild(restImagesImage); 

        restImagesImage.addEventListener("click",()=> { 

            document.querySelectorAll(".rest-images-image-1").forEach(item=> { 
                item.classList.remove("highlighted-class"); 
            })
            restImagesImage.classList.add("highlighted-class"); 
            headerImage.src = `${image.src}`; 
        })

    });
    previousPrice.textContent = `${data.product.compare_at_price}`; 
    description.innerHTML = `${data.product.description}`; 



    // setting the color palate..
    data.product.options[0].values.forEach(color=> { 

        let colorName = Object.keys(color)[0]; 
        let colorValue = color[colorName]; 

        let colorOuter = document.createElement("div"); 
        colorOuter.className = "colors-outer"; 


        console.log(colorValue); 
        let colors = document.createElement("div"); 
        colors.className = "colors"; 


        colors.style.backgroundColor = colorValue; 

        // colors.setAttribute("name",colorName);
        colorOuter.setAttribute("name", colorName); 
        
        
        colorOuter.appendChild(colors); 
        colorPalate.appendChild(colorOuter); 
        colorOuter.addEventListener("click", ()=> { 
            orderedItemColor = colorOuter.getAttribute("name"); 
            document.querySelectorAll(".colors-outer").forEach(item=> { 
                item.style.backgroundColor = "transparent"; 
                item.style.border = "none"; 
            })
            document.querySelectorAll(".colors").forEach(item=> { 
                item.innerHTML = ""; 
            })
            colorOuter.style.backgroundColor = "white"; 
            colorOuter.style.border = `2px solid ${colorValue}`; 
            colors.innerHTML = svg; 
        })
        
        
        
    })


    // setting the sizes
    data.product.options[1].values.forEach(size=> { 
        let label = document.createElement("label"); 
        label.setAttribute("id", size); 
        label.className = "size"; 
         let input = document.createElement("input"); 
         input.setAttribute("type", "radio"); 
         input.setAttribute("name", "radio-button");
         
         let span = document.createElement("span"); 


         span.textContent = size; 
         label.appendChild(input); 
         label.appendChild(span); 
         sizeCatagories.appendChild(label); 

         input.addEventListener("change", ()=> { 
            orderedItemSize = label.getAttribute("id"); 
            console.log(orderedItemSize); 
         })
    })
}

let quantity = 1;
totalQuantity.textContent = quantity;  
function handleAdd(){ 
    quantity++; 
    totalQuantity.textContent = quantity; 
}
function handleMinus(){ 
    quantity--; 
    if(quantity < 0){ 
        quantity = 0;  
    }
    totalQuantity.textContent = quantity; 
}

function handleCartSubmisson(){ 
    let div = document.createElement("div"); 
    let span = document.createElement("span"); 
    div.className = "final-order-alert"; 
    if(quantity>0 && orderedItemTitle && orderedItemColor && orderedItemSize){ 
        span.textContent = `${quantity} - ${orderedItemTitle} with Color ${orderedItemColor} and Size ${orderedItemSize} added to the cart`; 
        div.appendChild(span); 
        qunatityAndAddToCartSection.appendChild(div); 
    }else if(quantity === 0){ 
        alert("quantity can not be zero"); 
    }
    else{ 
        alert("Before adding to the cart please select a size and color for the product"); 
    }
    
}



fetchData(); 
