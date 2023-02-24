const supabase = require("./index");

//GET actions
const getOrders = async (req, res, next) => {
  const { data, error } = await supabase.from("orders").select();
  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("orders").select().eq("id", id);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getOrdersByUserId = async (req, res, next) => {
  const { id } = req.user;
  const { data, error } = await supabase
    .from("orders")
    .select()
    .eq("user_id", id)
    .order("id", { ascending: false });
  if (error) {
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getOrderProductsById = async (req, res, next) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("orders_products")
    .select()
    .eq("order_id", id);

  if (error) {
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

//POST actions

const addOrder = async (req, res, next) => {
  const { id } = req.user;
  const { data, error } = await supabase
    .from("orders")
    .insert({ user_id: id})
    .select();

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(201).send(data);
  }
};

//PUT actions

const updateOrder = async (req, res, next) => {
  const { order_id } = req.params;
  const { id } = await req.user;
  console.log(id)
  console.log(order_id)
  const { data, error } = await supabase
    .from("orders")
    .update({ user_id: id })
    .eq("id", order_id)
    .select();

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

//DELETE actions

const deleteOrder = async (req, res, next) => {
  const { id } = req.params;

  const { data, error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(`Order with id: ${id} deleted`);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getOrdersByUserId,
  getOrderProductsById,
  addOrder,
  updateOrder,
  deleteOrder,
};
