document.addEventListener("DOMContentLoaded",()=>{
    function prepareWrapperDivForCartItems(product,productQuantityMapping){
        const orderDetailsProduct=document.createElement("order-details-product");
        orderDetailsProduct.classList.add("order-details-product","d-flex","flex-row");
        const orderDetailsProductImg=document.createElement("div");
        orderDetailsProductImg.classList.add("order-details-product-img","d-flex");
        const image=document.createElement("img");
        image.src=product.image;
        orderDetailsProductImg.appendChild(image);

        const orderDetailsProductData=document.createElement("div");
        orderDetailsProductData.classList.add("order-details-product-data","d-flex","flex-column");
        const name=document.createElement("div");
        const price=document.createElement("div");
        name.textContent=product.title;
        price.textContent=product.price;
        orderDetailsProductData.appendChild(name);
        orderDetailsProductData.appendChild(price);
        const orderDetailsProductActions=document.createElement("div");
        orderDetailsProductActions.classList.add("order-details-product-action" ,"d-flex" ,"flex-column");
        const orderDetailsProductQuantity=document.createElement("div");
        orderDetailsProductQuantity.classList.add("order-details-product-quantity");
        const quantityLabel=document.createElement("div");
        quantityLabel.textContent="Quantity";
        quantityLabel.classList.add("fw-bold");
        const formGroup=document.createElement("div");
        formGroup.classList.add("form-group");
        const select=document.createElement("select");
        select.classList.add("form-select");
        for(let i=1 ;i<=10;i++){
            const option=document.createElement("option");
            option.textContent=i;
            option.value=i;
            if(i=== productQuantityMapping[product.id]){
                option.selected="true";
            }
            select.appendChild(option);
        }
        formGroup.appendChild(select);
        orderDetailsProductQuantity.appendChild(quantityLabel);
        orderDetailsProductQuantity.appendChild(formGroup);
        orderDetailsProductActions.appendChild(orderDetailsProductQuantity);
        const remove=document.createElement("button");
        remove.classList.add("order-details-product-remove","btn","btn-danger");
        remove.textContent="Remove";
        orderDetailsProductActions.appendChild(remove);

        orderDetailsProduct.appendChild(orderDetailsProductImg);
        orderDetailsProduct.appendChild(orderDetailsProductData);
        orderDetailsProduct.appendChild(orderDetailsProductActions);
        document.getElementById("orderDetails").appendChild(orderDetailsProduct);
        const hr=document.createElement("hr");
        document.getElementById("orderDetails").appendChild(hr);
    }


    async function fetchCartById(id) {
        const cart=await axios.get(`https://fakestoreapi.com/carts/${id}`);
        return cart.data;
    }
    async function fetchProductById(id){
        const product= await axios.get(`https://fakestoreapi.com/products/${id}`);
        return product.data;
    }
    async function populateCart(){
        const cart=await fetchCartById(1);
        const cartProducts=cart.products;
        const productQuantityMapping=[];
        const cartProductDownloadPromise=cartProducts.map(product=>{
            productQuantityMapping[product.productId]=product.quantity;
            return fetchProductById(product.productId);
        });
        const products = await Promise.all(cartProductDownloadPromise);
        let totalPrice=0;
        products.forEach(product =>{
            prepareWrapperDivForCartItems(product,productQuantityMapping);
            totalPrice+=product.price*productQuantityMapping[product.id];
        });
        document.getElementById("totalPrice").textContent=totalPrice;
        document.getElementById("netPrice").textContent=totalPrice-10;
        const loaderBackdrop=document.getElementById("loaderBackdrop");
        loaderBackdrop.style.display="none";
    }
    populateCart();
})