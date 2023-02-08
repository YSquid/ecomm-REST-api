# Route permissions - which need to be authenticed to access, and do they need to be superuser

**Auth** 

- None needed

**Carts**

- all need authenticated - isAuthenticated on carts route

- get all carts - isSuperUser

**Categories**

- getCategories - none

- getCategory by id - none

- Add category - isAuthenticated, isSuperUser

- Update category - isAuthenticated, isSuperUser

- Delete category - isAuthenticated, isSuperUser


**Orders**

- all need authenticated - isAuthenticated on orders route

- get all orders - isSuperUser 

- delete order- isSuperUser 

**Products**

- Get all products - none 

- Get product by id - none 

- check stock - none

- add product - isAuthenticated, isSuperUser

- update product - isAuthenticated, isSuperUser

- updateStock - none

- delete product - isAuthenticated, isSuperUser


**Users**

- get all users - isAuthenticated, isSuperUser

- get user by id- isAuthenticated

- update users - isAuthenticated

- deleteUser by id - isAuthenticated
