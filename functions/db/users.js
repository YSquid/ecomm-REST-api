const supabase = require("./index");

const getUsers = async (req, res, next) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .order("id", { ascending: true });
  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

const getUserById = async (req, res, next) => {
  const {id} = await req.user
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id);
  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(data);
  }
};

//POST actions

const addUser = async (req, res, next) => {
  const { email, password, superuser } = req.body;
  const { data, error } = await supabase
    .from("users")
    .insert({ email: email, password: password, superuser: false })
    .select();

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(201).send(data);
  }
};

//PUT actions

const updateUser = async (req, res, next) => {
  const{id} = await req.user;
  const { password, superuser } = req.body;
  const { data, error } = await supabase
    .from("users")
    .update({ password: password, superuser: superuser })
    .eq("id", id)
    .select();

    if (error) {
      res.status(404);
      next(error.message);
    } else {
      res.status(200).send(data);
    }
};



const deleteUserById = async (req, res, next) => {
  const { id } = req.params;
  const {data, error} = await supabase.from("users").delete().eq('id', id);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(`User with the id: ${id} deleted`);
  }
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUserById,
};



