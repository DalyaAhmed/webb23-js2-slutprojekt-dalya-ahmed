
const fs = require('fs'); //File system ; 
const express = require('express'); //impoterar express
const app = express(); // declerera en app
app.use(express.json());
app.use(express.static('images'));
const cors = require('cors');

app.use(cors());

// Allow cross origin requests (cors)
app.options('/products', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});
//___________GET______________
app.get('/products', (req, res) => {
  let body = [];

  try {
    const rawProducts = fs.readFileSync('./products.json'); // open a file and save a rowProducts
    const products = JSON.parse(rawProducts);
    //console.log(req.query)
    //body = products


    if (req.query.name!= undefined) {
          //loopa igenom alla objekt i products
      const queryName = req.query.name.toLowerCase();

      products.forEach(product => {
        const productName = product.name.toLowerCase();
        //includes to return true or false
        if (productName.includes(queryName)) {
          body.push(product);
        }

      });
     //if there is no such query with this name return all products 
    }
    else {
      body = products;
    }

  }
  catch (e) {
    body = { error: 'something went wrong' };
  }
  console.log(body.length);
  res.send(body);
})

//_____________POST____________
app.post('/products', (req, res) => {
  // Assuming you send the product name and updated stock in the request body
  const { name, newStock } = req.body;

  // Read the JSON file
  const data = JSON.parse(fs.readFileSync('./products.json'));

  // Find the product by name
  const product = data.find((item) => item.name === name);

  if (product) {
      // Update the stock
      product.stock = newStock;

      // Write the updated data back to the JSON file
      fs.writeFileSync('./products.json', JSON.stringify(data));

      res.setHeader('Content-Type', 'application/json');
      

      res.json({ message: 'Stock updated successfully' });
  } else {
      res.status(404).json({ error: 'Product not found' });
  }
});


app.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});