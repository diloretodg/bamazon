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

CREATE TABLE departments (
    
)