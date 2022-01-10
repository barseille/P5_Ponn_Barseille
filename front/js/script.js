//connexion à l'API

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    console.log(data) 
  
  let items = document.getElementById('items')
  for(let i in data){ items.innerHTML += `<a href="./product.html?id=${data[i]._id}">
    <article>
      <img src = "${data[i].imageUrl} "alt = "${data[i].id}" >
      <h3 class = "productName" > ${data[i].name}" </h3>
      <p class = "productDescription"> ${data[i].description} </p>
    </article>
  </a>`
  }
  })

 /*class Article{
    constructor(image,name,description,color,price){
      this.image = image;
      this.name = name;
      this.description = description;
      this.color = color;
      this.price = price;    
    }
  }*/
  











 
/*
function addProducts(donnees) {
  const id = donnees[0]._id
  const anchor = makeAnchor(id)
  const article = makeArticle()
  appendChildren(anchor)
}
function makeAnchor(id){
  const anchor = document.createElement("a")
  anchor.href = "./product.html?id=" + id
  return anchor 
}
function appendChildren(anchor){
  const items = document.querySelector("#items");
  if (items != null) {
    items.appendChild(anchor);
  }
}
function makeImage(imageUrl,altTxt){
  const image = document.createElement("img")
  image.src = imageUrl
  image.alt = altTxt
  return image
}
function makeArticle(){
  const article = document.createElement("article")
  console.log(article)
  return article
}

/* for (let canape of data) {
       console.log(canape.name);
      if (canape.name == "Kanap Hélicé") {
        console.log("canapeHélicé");
      }
    }
    console.log(data[0].imageUrl);*/
    
