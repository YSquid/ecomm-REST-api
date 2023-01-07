CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    description VARCHAR(128),
    price MONEY NOT NULL,
    stock INTEGER NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    description VARCHAR(128) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    address VARCHAR(256) NOT NULL,
    city VARCHAR(64) NOT NULL,
    province_state CHAR(2) NOT NULL,
    country CHAR(2),
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(id) NOT NULL;
);

CREATE TABLE categories_products (
    category_id INTEGER REFERENCES categories(id) NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    PRIMARY KEY (category_id, product_id)
);

--this table was redundent with orders
-- CREATE TABLE orders_users (
--     order_id INTEGER REFERENCES orders(id) NOT NULL,
--     users_id INTEGER REFERENCES users(id) NOT NULL,
--     PRIMARY KEY (order_id, users_id)
-- );

CREATE TABLE orders_products (
    order_id INTEGER REFERENCES orders(id) NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE carts_products (
    cart_id INTEGER REFERENCES carts(id) NOT NULL,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    PRIMARY KEY (cart_id, product_id)
);