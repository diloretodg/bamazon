DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    department VARCHAR(30) NOT NULL,
    price INT NOT NULL,
    quantity INT,
    PRIMARY KEY (id)
);

INSERT INTO products (name, department, price, quantity)
VALUES ('Coffee','Food',525,100);

INSERT INTO products (name, department, price, quantity)
VALUES ('Chalk','Office Supplies',200,5);

INSERT INTO products (name, department, price, quantity)
VALUES ('Apple Juice','Food',250,500);

INSERT INTO products (name, department, price, quantity)
VALUES ('DVD','Video',100,1000);

INSERT INTO products (name, department, price, quantity)
VALUES ('Garbage Bags','Home Essentials',1050,25);

INSERT INTO products (name, department, price, quantity)
VALUES ('Giant Pillow','Giant Bedding',2000,100);

INSERT INTO products (name, department, price, quantity)
VALUES ('CDs','Audio',100,1000);

INSERT INTO products (name, department, price, quantity)
VALUES ('Generic Holloween Costume','Lame Holiday Supplies',5000,50);

INSERT INTO products (name, department, price, quantity)
VALUES ('Inflatable Santa','Lame Holiday Supplies',5000,50);

INSERT INTO products (name, department, price, quantity)
VALUES ('VHS Player','Antique Video Equipment',5500,500);

-- CREATE TABLE departments (
    
-- )