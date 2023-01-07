CREATE TABLE products {
    id SERIAL PRIMARY KEY,
    name VARCHAR(32),
    description VARCHAR(128),
    price MONEY
}