const express = require("express");
const productsRouter = express.Router();
const productsJSON = require("../json_db/products.json");

module.exports = productsRouter;

//GET all products
productsRouter.get("/", (req, res) => {
  const products = productsJSON;
  res.send(products);
});

//GET product by id
productsRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  const filteredProducts = productsJSON.products.filter((product) => {
    return product.id == id;
  });

  if (filteredProducts.length > 0) {
    res.status(200).send(filteredProducts);
  } else {
    res
      .status(404)
      .send(
        "Resource not found. Ensure the url is correct and you are connected to the internet."
      );
  }
});
