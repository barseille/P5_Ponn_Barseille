fetch("http://localhost:3000/api/products")
.then((resp) => resp.json())
.then((data) => console.log(data))
