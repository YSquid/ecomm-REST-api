--five test products
INSERT INTO products (name, description, price, stock)
VALUES ('baseball bat', '28 inch wooden baseball bat', 39.99, 25);

INSERT INTO products (name, description, price, stock)
VALUES ('basketball', 'official size 7 (29.5 inch) basketball', 35.99, 16);

INSERT INTO products (name, description, price, stock)
VALUES ('Football', 'NFL sized supergrip football', 28.99, 50);

INSERT INTO products (name, description, price, stock)
VALUES ('Electronic Scoreboard', 'An electronic scoreboard with LED display. Scores up to 999 per team', 99.99, 10);

INSERT INTO products (name, description, price, stock)
VALUES ('Whistle', 'Stainless steel whistle.', 4.99, 50);



--three test categories

INSERT INTO categories (name, description)
VALUES ('Baseball', 'Equipment and accessories for baseball');

INSERT INTO categories (name, description)
VALUES ('Basketball', 'Equipment and accessories for basketball');

INSERT INTO categories (name, description)
VALUES ('Football', 'Equipment and accessories for American and Canadian football');

--three test users

INSERT INTO users (first_name, last_name, address, city, province_state, country)
VALUES ('Paul', 'Adams', '123 Elm Lane', 'Pittsburgh', 'PA', 'US');

INSERT INTO users (first_name, last_name, address, city, province_state, country)
VALUES ('Ezra', 'Meeks', '87 Yonge Street', 'Toronto', 'ON', 'CA');

INSERT INTO users (first_name, last_name, address, city, province_state, country)
VALUES ('LaShonda', 'Williamson', '1930 Nootka Street', 'Vancouver', 'BC', 'CA');

--three test carts

INSERT INTO carts (id)
VALUES (1);

--five test orders

INSERT INTO orders(user_id)
VALUES (1);

INSERT INTO orders(user_id)
VALUES (1);

INSERT INTO orders(user_id)
VALUES (2);

INSERT INTO orders(user_id)
VALUES (2);

INSERT INTO orders(user_id)
VALUES (3);

--map catories to products with linking table
INSERT INTO categories_products (category_id, product_id)
VALUES(1, 1);

INSERT INTO categories_products (category_id, product_id)
VALUES(2, 2);

INSERT INTO categories_products (category_id, product_id)
VALUES(3, 3);

INSERT INTO categories_products (category_id, product_id)
VALUES(1, 4);

INSERT INTO categories_products (category_id, product_id)
VALUES(2, 4);

INSERT INTO categories_products (category_id, product_id)
VALUES(3, 4);

INSERT INTO categories_products (category_id, product_id)
VALUES(3, 5);

INSERT INTO categories_products (category_id, product_id)
VALUES(2, 5);


--map orders to users with linking table

INSERT INTO orders_products (order_id, product_id)
VALUES (1, 1);

INSERT INTO orders_products (order_id, product_id)
VALUES (1, 4);

INSERT INTO orders_products (order_id, product_id)
VALUES (2, 5);

INSERT INTO orders_products (order_id, product_id)
VALUES (3, 1);

INSERT INTO orders_products (order_id, product_id)
VALUES (4, 4);

INSERT INTO orders_products (order_id, product_id)
VALUES (5, 2);

INSERT INTO orders_products (order_id, product_id)
VALUES (5, 3);

INSERT INTO orders_products (order_id, product_id)
VALUES (5, 4);

INSERT INTO orders_products (order_id, product_id)
VALUES (5, 5);

-- two active carts with products in them

INSERT INTO carts_products (cart_id, product_id)
VALUES (1, 5);

INSERT INTO carts_products (cart_id, product_id)
VALUES (2, 5);

--SELECT * FROM products join categories

SELECT * FROM products
JOIN categories_products
ON products.id = categories_products.product_id
JOIN categories
ON categories.id = categories_products.category_id

--SELECT * FROM users join orders join orders_products join products

SELECT * FROM users
JOIN orders
ON users.id = orders.user_id
JOIN orders_products
ON orders_products.order_id = orders.id
JOIN products
ON orders_products.product_id = products.id

--SELECT * from users join carts join carts_products join products

SELECT * FROM users
JOIN carts
ON users.id = carts.user_id
JOIN carts_products
ON carts_products.cart_id = carts.id
JOIN products
ON carts_products.product_id = products.id