function goto(url) {
    window.location.href = url;
}

class Product {
    constructor(id, name, price, category, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.favorite = false;
        this.cart = false;
        this.quantity = 1;  
    }
}

const products = [
    new Product(1, 'Golden Watch', 400, 'Watches', 'imgs/1.jpg'),
    new Product(2, 'Silver necklace', 150, 'Necklace', 'imgs/2.jpg'),
    new Product(3, 'Golden Earrings', 200, 'Earrings', 'imgs/3.jpg'),
    new Product(4, 'Black Watch', 350, 'Watches', 'imgs/4.jpg'),
    new Product(5, 'Silver Set Rings', 580, 'Rings', 'imgs/5.jpg'),
    new Product(6, 'Silver necklace', 150, 'Necklace', 'imgs/6.jpg'),
    new Product(7, 'Black bracelet', 100, 'Bracelet', 'imgs/7.jpg'),
    new Product(8, 'Set Necklace', 500, 'Necklace', 'imgs/8.jpg'),
    new Product(9, 'Golden set bracelet', 300, 'Bracelet', 'imgs/9.jpg')
];

function productcards(productList) {
    const productsrow = document.getElementById('products-row');
    if (!productsrow) {
        return;
    }


    let allcardshtml = '';

    productList.forEach(product => {
        const card = `
            <div class="pb-10 h-full"> 
                <div class="group bg-white rounded border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-lg hover:-translate-y-2 overflow-hidden h-full flex flex-col font-sans transition-all duration-300">
                    <div class="overflow-hidden h-64 w-full">
                        <img src="${product.image}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="${product.name}">
                    </div>
                    <div class="p-6 flex-grow flex flex-col items-center text-center">
                        <h5 class="text-xl font-semibold text-gray-900 mb-3">${product.name}</h5>
                        <p class="text-base text-gray-700 mb-3">Price: $${product.price}</p>
                        <p class="text-base text-gray-700 mb-6">Category: ${product.category}</p>
                        <div class="flex items-center justify-center gap-4 mt-auto w-full">
                            <i class="fas fa-heart cursor-pointer text-xl transition-colors duration-200 ${product.favorite ? 'text-red-500' : 'text-gray-400'}" onclick="addtofavoriteitems(${product.id})"></i>
                            <button class="px-5 py-2 rounded text-base font-medium transition-colors duration-200 ${product.cart ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}" onclick="addtocart(${product.id})">
                                ${product.cart ? 'Remove from Cart' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        
        allcardshtml += card;
    });

    productsrow.innerHTML = allcardshtml;
}

function searchProducts() {
    const searchtype = document.getElementById('searchtype').value;
    const searchtext = document.getElementById('searchbox').value.trim().toLowerCase();
    
    const filteredproducts = products.filter(product => {
        if (searchtype === 'name') {
            return product.name.toLowerCase().includes(searchtext);
        } else if (searchtype === 'category') {
            return product.category.toLowerCase().includes(searchtext);
        }
        return false;
    });
    
    productcards(filteredproducts);
}

function register() {
    const fname = document.getElementById('firstname').value.trim();
    const lname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const fnameError = document.getElementById("fnameError");  
    const lnameError = document.getElementById("lnameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    fnameError.textContent = "";
    lnameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    
    if (fname === "") {
        fnameError.textContent = "first Name is required.";
        return;
    } else if (fname.length < 2) {
        fnameError.textContent = "first Name must have at least 2 letters.";
        return;
    }

    if (lname === "") {
        lnameError.textContent = "last Name is required.";
        return;
    } else if (lname.length < 2) {
        lnameError.textContent = "last Name must have at least 2 letters.";
        return;
    }

    if (email === "") {
        emailError.textContent = "Email is required.";
        return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        return;
    }

    if (password === "") {
        passwordError.textContent = "Password is required.";
        return;
    } else if (password.length < 8) {
        passwordError.textContent = "Password must have at least 8 characters.";
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[email] = { password, firstName: fname, lastName: lname };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully!');
    goto('login.html');
}

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const error = document.getElementById("error");
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email] && users[email].password === password) {
        localStorage.setItem('userinformation', JSON.stringify(users[email]));
        localStorage.setItem('loggedIn', true); 
        window.location.href = 'products.html';
    } else {
        error.textContent = "Invalid email or password.";
    }
}

function logout() {
    localStorage.removeItem('userinformation');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    goto('index.html');
}

function addtocart(productId) {
    if (!JSON.parse(localStorage.getItem('loggedIn'))) {
        goto('login.html');
        return;
    }

    const product = products.find(p => p.id === productId);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(p => p.id === productId);

    if (product.cart) {
        product.cart = false;
        if (index > -1) cart.splice(index, 1);
    } else {
        product.cart = true;
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    cartdropdown();
    productcards(products);
}

function removefromcart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(p => p.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        const product = products.find(p => p.id === productId);
        if (product) product.cart = false;
        cartitems();
        cartdropdown();
        productcards(products);
    }
}

function addtofavoriteitems(productId) {
    if (!JSON.parse(localStorage.getItem('loggedIn'))) {
        goto('login.html');
        return;
    }

    const product = products.find(p => p.id === productId);
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(p => p.id === productId);

    if (product.favorite) {
        product.favorite = false; 
        if (index > -1) favorites.splice(index, 1);
    } else {
        product.favorite = true;
        favorites.push({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    if (window.location.href.includes('cart.html')) {
        favoriteitems(); 
    } else {
        productcards(products);
    }
}

function opencartdropdown() {
    const dropdown = document.getElementById('cartdropdown');
    const cartdropdown = dropdown.nextElementSibling;    
    if (cartdropdown) {
        cartdropdown.classList.toggle('visible');
        cartdropdown.classList.toggle('invisible');
    }
}

function cartcount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    const element = document.getElementById('cartcount');
    if (element){
        element.textContent = totalCount;
    } 
}

function cartdropdown() {
    const cartdropdownitems = document.getElementById('cartdropdownitems');
    const cartitems = JSON.parse(localStorage.getItem('cart')) || [];
    cartdropdownitems.innerHTML = '';
    
    if (cartitems.length === 0) {
        cartdropdownitems.innerHTML = `<p class="ml-4 mt-2">Your cart is empty.</p>`;
    } else {
        let allcartitemshtml = '';

        cartitems.forEach(item => {
            const cartitem = `
            <div class="cart-item_dd flex justify-between items-center mb-2 p-2 border-b border-gray-100 last:border-0"> 
                <div class="ml-2 flex flex-col">
                    <h6 class="text-sm font-semibold text-gray-800 mb-0">${item.name}</h6>
                    <p class="text-xs text-gray-500 mb-0">Price: $<span id="itemPrice${item.id}" class="font-medium text-gray-700">${(item.price * item.quantity).toFixed(2)}</span></p>                   
                </div>
                <div class="flex items-center gap-2">
                    <button class="w-7 h-7 flex items-center justify-center text-xs bg-white border border-slate-400 rounded text-slate-600 hover:bg-slate-500 hover:border-slate-500 hover:text-white transition duration-150 focus:outline-none" onclick="decreasequantity(${item.id})">-</button>
                    <span id="itemQuantity${item.id}" class="w-6 text-center text-sm font-medium text-gray-800">${item.quantity}</span>
                    <button class="w-7 h-7 flex items-center justify-center text-xs bg-white border border-slate-400 rounded text-slate-600 hover:bg-slate-500 hover:border-slate-500 hover:text-white transition duration-150 focus:outline-none" onclick="increasequantity(${item.id})">+</button>
                </div>
            </div>`;
            
            allcartitemshtml += cartitem;
        });

        cartdropdownitems.innerHTML = allcartitemshtml;
    }
    cartcount();
}

function increasequantity(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartitem = cart.find(p => p.id === productId);
    if (cartitem) {
        cartitem.quantity++;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    cartdropdown();
    if (document.getElementById('cart-items')) {
        cartitems();
    }
}

function decreasequantity(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(p => p.id === productId);
    if (index > -1) {
        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
            const product = products.find(p => p.id === productId);
            if (product){
                product.cart = false;
            } 
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        
        cartdropdown();
        productcards(products);
        if (document.getElementById('cart-items')){
           cartitems(); 
        } 
    }
}

function cartandfavorite() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    products.forEach(product => {
        const cartproduct = cart.find(p => p.id === product.id);
        const favoriteproduct = favorites.find(p => p.id === product.id);
        if (cartproduct) {
            product.cart = true;
            product.quantity = cartproduct.quantity;
        } else {
            product.cart = false;
            product.quantity = 0;
        }
        product.favorite = !!favoriteproduct;
    });
}

function cartitems() {
    const cartitemscontainer = document.getElementById('cart-items');

    const cartitems = JSON.parse(localStorage.getItem('cart')) || [];
    cartitemscontainer.innerHTML = '';
    if (cartitems.length === 0) {
        cartitemscontainer.innerHTML = '<p class="ml-5">Your cart is empty.</p>';
        updatetotalprice();
        return;
    }
    const cartitemshtml = cartitems.map(item => `
        <div class="bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col sm:flex-row items-center p-5 sm:p-6 transition-all duration-300 hover:border-red-600 hover:-translate-y-1 hover:shadow-lg" data-product-id="${item.id}">
            <img src="${item.image}" class="w-32 h-32 rounded-2xl object-cover flex-shrink-0 mb-4 sm:mb-0" alt="${item.name}">
            <div class="w-full flex-1 sm:pl-6 flex flex-col justify-between">
                <div class="text-left">
                    <h5 class="text-xl font-bold text-gray-900 mb-1.5">${item.name}</h5>
                    <p class="text-base text-gray-500 mb-2">Category: ${item.category}</p>
                    <p class="text-lg font-medium text-gray-800 mb-4">Price: $${item.price}</p>
                </div>
                <div class="flex flex-row items-center justify-start gap-6 w-full">
                    <div class="flex items-center gap-2">
                        <button class="w-8 h-8 flex items-center justify-center text-gray-700 bg-white border border-gray-300 rounded transition duration-200 hover:bg-gray-500 hover:text-white hover:border-transparent" onclick="decreasequantity(${item.id})">-</button>
                        <span id="itemQuantity${item.id}" class="w-6 text-center font-medium text-gray-800">${item.quantity}</span>
                        <button class="w-8 h-8 flex items-center justify-center text-gray-700 bg-white border border-gray-300 rounded transition duration-200 hover:bg-gray-500 hover:text-white hover:border-transparent" onclick="increasequantity(${item.id})">+</button>
                    </div>
                    <button class="px-5 py-2.5 text-base font-medium text-white bg-[#dc3545] rounded-md transition-colors duration-200 hover:bg-[#c82333] shadow-sm" onclick="removefromcart(${item.id})">
                        Remove from Cart
                    </button>
                </div>
            </div>
        </div>`).join('');

    cartitemscontainer.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                ${cartitemshtml}
            </div>
        </div>`;

    updatetotalprice();
}

function favoriteitems() {
    const favoriteitemscontainer = document.getElementById('favorite-items');

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoriteitemscontainer.className = "flex flex-nowrap items-stretch gap-6 p-6 overflow-x-auto max-w-full mb-6";
    favoriteitemscontainer.innerHTML = '';

    if (favorites.length === 0) {
        favoriteitemscontainer.innerHTML = '<p>You have no favorite items.</p>';
        return;
    }

    favoriteitemscontainer.innerHTML = favorites.map(item => `
        <div class="card_fav w-64 sm:w-72 md:w-80 flex-shrink-0 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:border-red-600 hover:-translate-y-1 hover:shadow-md" data-product-id="${item.id}">
            <img src="${item.image}" class="w-full h-48 sm:h-56 object-cover" alt="${item.name}">
            <div class="grid grid-cols-1 justify-items-center text-center gap-1 flex-grow w-full p-5">
                <h5 class="text-xl font-semibold text-gray-900 w-full px-1 break-words mb-2">${item.name}</h5>
                <p class="text-base text-gray-500 mb-6 w-full px-1 break-words">Category: ${item.category}</p>
                <div class="mt-auto">
                    <i class="fas fa-heart text-xl cursor-pointer transition duration-150 text-red-500 hover:scale-110" onclick="addtofavoriteitems(${item.id})"></i>
                </div>
            </div>
        </div>`).join('');
}

function updatetotalprice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalprice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const element = document.getElementById('totalPrice');
    if (element) {
        element.textContent = totalprice.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userinformation = JSON.parse(localStorage.getItem('userinformation'));
    const isloggedIn = JSON.parse(localStorage.getItem('loggedIn'));
    const usernamedisplay = document.getElementById('usernamedisplay');
    
    if (userinformation && isloggedIn && usernamedisplay) {
        usernamedisplay.textContent = `Hello, ${userinformation.firstName}`;
    }

    cartandfavorite();
    productcards(products);
    cartdropdown();
    
    if (window.location.href.includes('cart.html')) {
        favoriteitems();
        cartitems();
    }
    
    const carticon = document.querySelector('.fas.fa-shopping-cart');
    if (carticon){ 
        carticon.addEventListener('click', opencartdropdown);
    }
});
