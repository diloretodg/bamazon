var cart = [];
var inquirer = require('inquirer');


var customerPrompts = [
    {
        name: 'product_id',
        message: 'What is the ID of the product you wish to purchase?',
    },
    {
        name: 'quantity',
        message: 'How many would you like?',
    },
];


function shop(){
    inquirer.prompt(customerPrompts).then(function(answer){
    var item = new CartItem(answer.product_id, answer.quantity)  
    });
}

function CartItem(id, quantity){
    this.id = id;
    this.quantity = quantity
    cart.push(this);
}

