--three test products
INSERT INTO products (name, description, price, stock)
VALUES ('baseball bat', '28 inch wooden baseball bat', 39.99, 25);

INSERT INTO products (name, description, price, stock)
VALUES ('basketball', 'official size 7 (29.5 inch) basketball', 35.99, 16);

INSERT INTO products (name, description, price, stock)
VALUES ('Football', 'NFL sized supergrip football', 28.99, 50);

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