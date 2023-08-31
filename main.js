// HTML'de belirlediğiniz elementleri seçme
const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');
const modalList = document.querySelector('.modal-list');
const modalInfo = document.querySelector('#modal-info');

// Sayfa yüklendiğinde çalışacak olan fonksiyonlar
document.addEventListener("DOMContentLoaded", () => {
    // Kategorileri ve ürünleri çekmek için gerekli fonksiyonları çağır
    fetchCategories();
    fetchProduct();
})

// Kategorileri çekme fonksiyonu
function fetchCategories() {
    // Kategorileri API'den çekme
    fetch('https://api.escuelajs.co/api/v1/categories')
        .then((res) => res.json())
        .then((data) =>
            // Her bir kategori için bir div oluştur ve içeriği HTML'e ekle
            data.slice(0, 4).forEach((category) => {
                const { image, name } = category;
                const categoryDiv = document.createElement("div");
                categoryDiv.classList.add("category");
                categoryDiv.innerHTML = `
                    <img src="${image}" />
                    <span>${name}</span>`;
                categoryList.appendChild(categoryDiv);
            }))
}

// Ürünleri çekme fonksiyonu
function fetchProduct() {
    // Ürünleri API'den çekme
    fetch("https://api.escuelajs.co/api/v1/products")
        .then((res) => res.json())
        .then((data) =>
            // Her bir ürün için bir div oluştur ve içeriği HTML'e ekle
            data.slice(0, 25).forEach((item) => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${item.images[0]}" />
                    <p>${item.title}</p>
                    <p>${item.category.name}</p>
                    <div class="product-action">
                        <p>$${item.price}</p>
                        <button onclick="addToBasket({id:${item.id}, title:'${item.title}',price:${item.price},img:'${item.images[0]}',amount:1 })">Sepete Ekle</button>
                    </div>
                </div>`;
                productList.appendChild(productDiv);
            })
        );
}

// Sepet işlemleri
let basket = [];
let total = 0;

// Sepete ürün eklemek için fonksiyon
function addToBasket(product) {
    // Ürün sepette var mı kontrol et
    const foundItem = basket.find((basketItem) => basketItem.id === product.id);
    if (foundItem) {
        // Ürün sepette varsa miktarı artır ve toplam fiyatı güncelle
        foundItem.amount += 1;
        foundItem.totalPrice += product.price;
    } else {
        // Ürün sepette yoksa yeni ürün oluştur ve miktarı 1 olarak ayarla
        product.amount = 1;
        product.totalPrice = product.price;
        basket.push(product);
    }
    // Toplam fiyatı güncelle
    total += product.price;
}

// Sepetten ürün silmek için fonksiyon
function deleteItem(deletingItem) {
    const deletedProduct = basket.find(item => item.id === deletingItem.id);
    if (deletedProduct) {
        // Ürünü sepetten çıkarırken toplam fiyattan düşme işlemi
        total -= deletedProduct.totalPrice;
        basket = basket.filter(item => item.id !== deletingItem.id);

        // Yeniden liste güncellemesi
        addList();
        modalInfo.innerText = total.toFixed(2);
    }
}

// Sepet listesini oluşturmak için fonksiyon
function addList() {
    modalList.innerHTML = "";
    basket.forEach((product) => {
        const listItem = document.createElement("div");
        listItem.classList.add('list-item');
        listItem.innerHTML = `
            <img src="${product.img}">
            <h2>${product.title}</h2>
            <h2 class="price">${product.totalPrice.toFixed(2)}$</h2>
            <p>Miktar : ${product.amount}</p>
            <button id="del" onclick="deleteItem({id:${product.id},price:${product.price},amount:${product.amount}})">Sil</button>
        `;
        modalList.appendChild(listItem);
    });
    modalInfo.innerText = total.toFixed(2);
}

// Sepet açma ve kapatma işlemleri
openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    addList();
    modalInfo.innerText = total;
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    modalList.innerHTML = "";
    total = 0;
});

// Modal dışına tıklandığında kapatma işlemi
modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper')) {
        modal.classList.remove('active')
    }
});
