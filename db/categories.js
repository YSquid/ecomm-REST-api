const supabase = require("./index");

//GET actions
const getCategories = async (req, res, next) => {
  const { data, error } = await supabase.from("categories").select();
  if (error) {
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("categories")
    .select()
    .eq("id", id);
  if (error) {
    next(error);
  } else {
    res.status(200).send(data);
  }
};

//POST actions

const addCategory = async (req, res, next) => {
  const { name, description } = req.body;
  const { data, error } = await supabase
    .from("categories")
    .insert({ name: name, description: description })
    .select();
  if (error) {
    next(error.message);
  } else {
    res.status(201).send(data);
  }
};

//PUT actions

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const { data, error } = await supabase
    .from("categories")
    .update({ name: name, description: description })
    .eq("id", id)
    .select();
  if (error) {
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

//DELETE actions

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    next(error.message);
  } else {
    res.status(200).send(`Category with id ${id} deleted`);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
