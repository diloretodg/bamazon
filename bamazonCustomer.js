var inquirer = require('inquirer');
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

var cart = [];

//  the prompts the user will input to select the product they want
var customerPrompts = [
    {
        type: 'input',
        name: 'product_id',
        message: 'What is the ID of the product you wish to purchase?',
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like?',
        validate: function(input){
            if(Number(input) < 0) {
                return false;
            } else {
                return true;
            }
        }
    },
];

// takes the user input and finds the product calculates the cost and makes the purchase that updates the stock
function shop(){
    inquirer.prompt(customerPrompts).then(function(answer){
        new CartItem(answer.product_id, answer.quantity);
        var query = 'SELECT * FROM products WHERE ?';
        connection.query(query, {id: cart[0].id}, function(err, res){
            if(err) console.log(err);
            if (res.length === 0){
                console.log("Please select a valid product");
                cart = [];
                shop();} 
            else {
                console.log(
                    'ID: ' + res[0].id + '\n' +
                    'Name: ' + res[0].name + '\n' +
                    'Department: ' + res[0].department + '\n' +
                    'Price: ' + (res[0].price/100).toFixed(2) + '\n' +
                    'Quantity: ' + res[0].quantity + '\n' +
                    '---------------'
                );
                if(answer.quantity > Number(res[0].quantity)) {
                    console.log("\n Insufficient quantity! \n ------------- \n");
                    connection.end();
                } else {
                    cost =  (answer.quantity * (res[0].price/100)).toFixed(2);
                    var newQuantity = Number(res[0].quantity) - answer.quantity
                    buyProduct(res[0].id, newQuantity);
                }
            }
        })
    });
}

// constructs an instance to compare our table contents to
function CartItem(id, quantity){
    this.id = id;
    this.quantity = quantity
    cart.push(this);
}

// displays the contents of our table and then calls the shop function to start the shopping process
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
        shop();
    })
}

// updates table with reduced inventory from purchases
function buyProduct(id, q) {
    console.log("Completeing purchase. Purchase total is $" + cost);
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          quantity: q
        },
        {
          id: id
        }
      ],
      function(err, res) {
        if(err) console.log(err);
        console.log(res.affectedRows + " products updated!\n");
      }
    );
    connection.end();
}

displayProducts();
