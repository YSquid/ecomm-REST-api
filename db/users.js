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
  const { id } = req.params;
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
    .insert({ emai: email, password: password, superuser: false })
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
  const { email } = req.params;
  const { password, superuser } = req.body;
  const { data, error } = await supabase
    .from("users")
    .update({ password: password, superuser: superuser })
    .eq("email", email)
    .select();

    if (error) {
      res.status(404);
      next(error.message);
    } else {
      res.status(200).send(data);
    }
};



const deleteUserByEmail = async (req, res, next) => {
  const { email } = req.params;
  const {data, error} = await supabase.from("users").delete().eq('email', email);

  if (error) {
    res.status(404);
    next(error.message);
  } else {
    res.status(200).send(`User with the email: ${email} deleted`);
  }
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUserByEmail,
};



