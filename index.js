const express = require('express');

const server = express();

server.use(express.json()); // makes the express understand .json


const products = [];

// CRUD - Create, Read, Update, Delete

server.use((req, res, next) => { // global middleware is created here
  console.time('Request'); 
  console.log(`Método: ${req.method}; URL: ${req.url}; `); 

  next(); // calls the next functions

  console.log('Finalizou'); // called before the requisition is completed

  console.timeEnd('Request'); // appears in the end of the requisition
});

function checkProductExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'product name is required' });
    // local middleware 
  }
  return next(); // if it´s called right, it goes to the next function
} 
  
function checkProductsInArray(req, res, next) {
  const product = products[req.params.index];
  if (!product) {
    return res.status(400).json({ error: 'product does not exists' });
  } // check if products exists in array
  req.product = product;

  return next();
}

server.get('/products', (req, res) => {
  return res.json(products);
}) // list all products

server.get('/products/:index', checkProductsInArray, (req, res) => {
  return res.json(req.product);
}) // list products by Id

server.post('/products', checkProductExists, (req, res) => {
  const { name } = req.body; 
  products.push(name);
  return res.json(products); 
}) // create a new product

server.put('/products/:index', checkProductsInArray, checkProductExists, (req, res) => {
  const { index } = req.params; 
  const { name } = req.body;
  products[index] = name; 
  return res.json(products);
}); // edit a product by the Id

server.delete('/products/:index', checkProductsInArray, (req, res) => {
  const { index } = req.params; 

  products.splice(index, 1); 

  return res.send();
}); // exclude the product by the Id


server.listen(3000);