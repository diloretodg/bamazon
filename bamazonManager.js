var csvParser = require('csv-parse');
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
var managerOptions = [
    {buildProduct: buildProduct()},
    {displayProducts:displayProducts()},
    {deleteProduct: deleteProduct()},
    {productToCsv: productCsv()},
    {loadFromCsv: loadFromCsv()},
]

var managerPrompts = [
    {   
        type: 'list',
        name: 'manager_function',
        message: 'What would you like to do?',
        choices: managerOptions,
    }
]

function manager(){
    inquirer.prompt(managerPrompts).then(function(answer){
        answer.manager_function;
    })
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    manager();
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
    for(var i = 0; i < arr.length; i ++){
        createProduct(arr[i]);
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
                'Price: ' + (res[i].price/100).toFixed(2) + '\n' +
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

function productCsv(){
    filePath = 'products.csv';
    console.log("writing products.csv with entire product list");
    fs.readFile(filePath, 'utf8', function(err, data) {
        if(err) console.log(err);
        if (data) fs.truncate(filePath, 0, function(){
            console.log('done');
            });
        var infostream = [];
        var query = connection.query('SELECT * FROM products', function(err, data){
            if(err) console.log(err);
            for(var i = 0; i < data.length; i++){
                infostream.push(
                    Number(data[i].id) + ',' + 
                    data[i].name + ',' + 
                    data[i].department + ',' + 
                    data[i].price + ',' + 
                    data[i].quantity
                    );
            }
            console.log(infostream);
            for(var i = 0; i < infostream.length; i ++){
                fs.appendFileSync(filePath,infostream[i] + '\n', function(err){
                    if(err) console.log(err);
                });
            }
        })
    })
};

function loadFromCsv(){
    filePath = 'products.csv';
    fs.readFile(filePath, {
        encoding: 'utf-8'
    }, function(err, csvData) {
        if (err) {
        console.log(err);
        }
    csvParser(csvData, {
        delimiter: ','
        }, function(err, data) {
            if (err) {
                console.log(err);
            } else {    
                for(var i = 0; i < data.length; i++){
                    var p = data[i];
                    Number(p[0]);
                    new Product(p[1],p[2],p[3],p[4]);
                }
            productsToLoad.sort(function(a, b) { 
                return a[0] > b[0] ? 1 : -1;
            });
            connection.query('TRUNCATE TABLE products', function(err){
                if(err) console.log(err);
            });
            loadProducts(productsToLoad);
            }
        }
    )});
};