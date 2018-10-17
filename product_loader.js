var inquirer = require('inquirer');
var fs = require('fs');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password todo: set as dotenv
    password: "In9volin9vol!",
    // Database
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // buildProduct();
    // displayProducts();
    // deleteProduct(2);
});

// product constructor
class Product {
    constructor (name, department, price, quantity) {
        this.name = name;
        this.department = department;
        this.price = price;
        this.quantity = quantity
        productsToLoad.push(this);
    };
};

// stores all products built in buildProduct
var productsToLoad = [];

//prompts for building a product instance 
var productPrompts = [
    {
        name: 'name',
        message:'What is your product name',
        type: 'Input'
    },
    {
        name: 'department',
        message:'What is you product department',
        type: 'Input'
    },
    {
        name: 'price',
        message:'What is the price of your product',
        type: 'Input'
    },
    {
        name: 'quantity',
        message:'How many of your product is in stock',
        type: 'Input'
    },
    {
        name: 'more_products',
        type: 'confirm',
        message: 'Would you like to post another product?'
    }
]

// builds product object to be loaded into product table
function buildProduct(){
    inquirer.prompt(productPrompts).then(function(answer){
        new Product (answer.name, answer.department, answer.price, answer.quantity);
        if(!answer.more_products){
            loadProducts(productsToLoad);
        } else {
            buildProduct(productPrompts);
        } 
    });
}

// loops through array and calls create function for product table
function loadProducts(arr) {
    for(var i = 0; i < productsToLoad.length; i ++){
        createProduct(productsToLoad[i]);
    }
}

// create product listing
function createProduct(product) {
    console.log("Inserting a new product...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            name: product.name,
            department: product.department,
            price: product.price,
            quantity: product.quantity
        },
        function(err, res) {
            if(err) console.log(err);
            console.log(res.affectedRows + " product inserted!\n");
        }
    );
    // logs the actual query being run
    console.log(query.sql);
}

// shows contents of products table ideally selectable by columns value
function displayProducts(){
    console.log('printing product table... \n');
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log('Products \n---------------')
        for(var i = 0; i < res.length; i ++){
            console.log(
                'ID: ' + res[i].id + '\n' +
                'Name: ' + res[i].name + '\n' +
                'Department: ' + res[i].department + '\n' +
                'Price: ' + res[i].price + '\n' +
                'Quantity: ' + res[i].quantity + '\n' +
                '---------------'
            );
        }
        connection.end();
    });
}

function deleteProduct(val) {
    console.log("Deleting ID  " + val +"...\n");
    connection.query(
        "DELETE FROM products WHERE ?",
        { 
            id: val
        },
        function(err, res) {
            if(err) console.log(err);
  
            console.log(res.affectedRows + " products deleted!\n");
            displayProducts();
        }
    );
};


