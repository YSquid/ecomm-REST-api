const supabase = require("./index");

//GET actions

const getProducts = async (req, res) => {
  try {
    const { data } = await supabase.from("products").select().order('category_id');
    res.status(200).send(data);
  } catch (error) {
    res.send(error);
  }
};

const getProductsByCategories = async (req, res) => {
  const { categories } = req.body;
  const { data, error } = await supabase.from("products").select().in('category_name', categories);
  if (error) {
    next(error.message)
  } else {
    res.status(200).send(data);
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("id", id);
    //catch errors such as type errors
    if (error) {
      res.status(404);
      next(error.message);
      //case where query is allowed, but no rows returned
    } else if (data.length < 1) {
      res.status(404);
      next(`No proudct with id:${id} found`);
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    next(error);
  }
};

//Check for stock of product is > 0

const checkStock = async (req, res, next) => {
  const { product_id, product_count } = req.body;

  const { data, error } = await supabase
    .from("products")
    .select(`name, stock`)
    .eq("id", product_id);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    if (data.length === 0) {
      res.send("No product with that id found");
    } else if (data[0].stock >= product_count) {
      next();
    } else {
      res.status(200).send("Not enough stock");
    }
  }
};

//POST actions

const addProduct = async (req, res, next) => {
  const { name, description, price, stock, category_id, category_name } = req.body;
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: name,
      description: description,
      price: price,
      stock: stock,
      category_id: category_id,
      category_name: category_name
    })
    .select();

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(201).send(data);
  }
};

//PUT actions

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({
      name: name,
      description: description,
      price: price,
      stock: stock,
    })
    .eq("id", id)
    .select();

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};
//Update stock - run after a cart checkout middlware

const updateStock = (req, res, next) => {
  res.locals.orders_products.forEach(async (product) => {
    //lookup product stock
    const { data } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product.product_id);
    let currentStock = Number(data[0].stock);
    let updatedStock = currentStock - product.product_count;
    await supabase
      .from("products")
      .update({ stock: updatedStock })
      .eq("id", product.product_id);
  });
  res.status(200).send("Order successfully created");
};
//DELETE actions

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(`Product with id: ${id} deleted`);
  }
};

//exports
module.exports = {
  getProducts,
  getProductById,
  getProductsByCategories,
  addProduct,
  updateProduct,
  checkStock,
  updateStock,
  deleteProduct,
};
