const express = require("express");
const categoriesRouter = express.Router();
const db_categories = require("../db/categories.js");
const db_auth = require("../db/auth");

module.exports = categoriesRouter;

//GET all categories
categoriesRouter.get("/", db_categories.getCategories);

//GET category by id
categoriesRouter.get("/:id", db_categories.getCategoryById);

//POST category
categoriesRouter.post("/", db_auth.checkAuthenticated, db_auth.isSuperUser, db_categories.addCategory);

//PUT category
categoriesRouter.put("/:id", db_auth.checkAuthenticated, db_auth.isSuperUser, db_categories.updateCategory);

//DELETE category

categoriesRouter.delete("/:id", db_auth.checkAuthenticated, db_auth.isSuperUser, db_categories.deleteCategory);
