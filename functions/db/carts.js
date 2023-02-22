const supabase = require("./index");

//GET actions
const getCarts = async (req, res, next) => {
  const { data, error } = await supabase.from("carts").select();

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getCartById = async (req, res, next) => {
  const {id} = await req.user
  const { data, error } = await supabase.from("carts").select().eq("id", id);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getCartsProductsById = async (req, res, next) => {
  const {id} = await req.user
  console.log(id)
  const {data, error} = await supabase.from("carts_products").select().eq("cart_id", id)

  if (error) {
    next(error.message);
  } else {
    res.status(200).send(data);
  }
}

//POST actions

//Add item to a cart

const addProductToCart = async (req, res, next) => {
  const {id} = await req.user
  const { product_id, product_name, product_price, product_count } = req.body;

  //select rows where the cart id and product id matches selection
  const { data, error } = await supabase
    .from("carts_products")
    .select()
    .eq("cart_id", id)
    .eq("product_id", product_id);
  console.log('carts select ran')
  console.log(data)
  
  if(error) {
    next(error.message)
  }

  //calculate new total amount of product if its in cart, if not newTotal is just product_count;
  let newTotal;
  if (data.length > 0) {
    newTotal = Number(product_count) + Number(data[0].product_count);
  } else {
    newTotal = Number(product_count);
  }
  console.log('new total ran')
  console.log(newTotal)
  if (error) {
    console.log('error after new total')
    res.status(404);
    next(error.message);
  } else {
    //if data has length, i.e. that product is in cart, update with count
    if (data.length > 0) {
      console.log("first if ran")
      const { data, error } = await supabase
        .from("carts_products")
        .update({ product_count: newTotal })
        .eq("cart_id", id)
        .eq("product_id", product_id)
        .select();
      if (error) {
        res.status(404);
        next(error.message);
      } else {
        res.status(200).send(data);
      }
    } else {
      console.log("else ran")
      //if data has no length i.e. that product is not in cart, add it with count
      const { data, error } = await supabase
        .from("carts_products")
        .insert({
          cart_id: id,
          product_id: product_id,
          product_name: product_name,
          product_price: product_price,
          product_count: product_count,
        })
        .select();
      if (error) {
        res.status(404);
        next(error.message);
      } else {
        res.status(200).send(data);
      }
    }
  }
};

//Confirm stock of all products in cart before creating order
const confirmStock = async (req, res, next) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("carts_products")
    .select(
      `product_id, product_count, products(
      stock
    )`
    )
    .eq("cart_id", user_id);
  if (error) {
    res.status(404);
    next(error.message);
    //check every product has enough stock
  } else if (
    data.every((product) => {
      return product.product_count <= product.products.stock;
    })
  ) {
    next();
  } else {
    const outOfStock = data.filter((product) => {
      return product.product_count > product.products.stock;
    });

    const outOfStockIds = outOfStock.map((product) => {
      return product.product_id;
    });

    res.send(`Out of stock on product with id: ${outOfStockIds}`);
  }
};

//Checkout a cart and create order
const checkoutCart = async (req, res, next) => {
  const { user_id } = req.params;

  //fetch the info carts_products needed to make orders and orders_products entries
  const { data } = await supabase
    .from("carts_products")
    .select("cart_id, product_id, product_name, product_price, product_count")
    .eq("cart_id", user_id);
  const productCount = data.length;

  //create the order in orders, return the data
  const orderData = await supabase
    .from("orders")
    .insert({ user_id: user_id })
    .select();
  //extract the orderId
  const orderId = orderData.data[0].id;

  //loop through and create entry in orders_products for each product data from carts_products
  for (let i = 0; i < productCount; i++) {
    let product_id = data[i].product_id;
    let product_count = data[i].product_count;
    let product_name = data[i].product_name;
    let product_price = data[i].product_price;

    await supabase.from("orders_products").insert({
      order_id: orderId,
      product_id: product_id,
      product_name: product_name,
      product_price: product_price,
      product_count: product_count,
    });
  }

  //delete from carts_products
  await supabase.from("carts_products").delete().eq("cart_id", user_id);

  let finalData = await supabase
    .from("orders_products")
    .select()
    .eq("order_id", orderId);
  res.locals.orders_products = finalData.data;
  next();
};

const addOneToCart = async (req, res, next) => {
  const { cart_id, product_id } = req.body;
  //return current count in cart
  const { data, error } = await supabase
    .from("carts_products")
    .select("product_count")
    .eq("cart_id", cart_id);
  if (error) {
    res.status(404);
    next(error.message);
  } else {
    //extract current count, set newCount plus one, update, and return new data
    const count = data[0].product_count;
    const newCount = count + 1;
    const newData = await supabase
      .from("carts_products")
      .update({ product_count: newCount })
      .eq("product_id", product_id)
      .select();
    res.status(200).send(newData.data);
  }
};

const subtractOneFromCart = async (req, res, next) => {
  const { cart_id, product_id } = req.body;
  //return current count in cart
  const { data, error } = await supabase
    .from("carts_products")
    .select("product_count")
    .eq("cart_id", cart_id);
  if (error) {
    res.status(404);
    next(error.message);
  } else {
    //extract current count, set newCount minus one, update, and return new data
    const count = data[0].product_count;
    const newCount = count - 1;
    const newData = await supabase
      .from("carts_products")
      .update({ product_count: newCount })
      .eq("product_id", product_id)
      .select();
    res.status(200).send(newData.data);
  }
};

module.exports = {
  getCarts,
  getCartById,
  getCartsProductsById,
  addProductToCart,
  addOneToCart,
  subtractOneFromCart,
  confirmStock,
  checkoutCart,
};

