var mysql = require("mysql")
var inquirer = require("inquirer")


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Seaisle1!",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw (err);
    console.log("connected as id " + connection.threadId + "\n")
    displayManagerItems()
})


function displayManagerItems() {

    inquirer.prompt([
        {
            name: "task",
            message: "Hello Manager, what would you like to do today?",
            type: "list",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ])
    .then(function(answer) {


        switch(answer.task){

            case "View Products for Sale": 
                viewAllProducts()
                break;
            case "View Low Inventory":
                viewLowInventory()
                break;
            case "Add to Inventory":
                addToInventoryPrep()
                break;
            case "Add New Product":
                addNewProduct()
                break;
            default:
                viewAllProducts()
                break;
        }
            
    })
}

function addToInventoryPrep() {
    connection.query("SELECT * FROM products",
    function(err, res) {
        if (err) throw err;

        addToInventory(res)

    })
}

function addToInventory(inventory){
    console.log("running Main Add to Inventory function ")
    console.log(inventory)

    var itemNames = [];
    for (i = 0; i < inventory.length; i++) {
        itemNames.push(inventory[i].product_name)
    }

    console.log(itemNames)
    inquirer.prompt([
        {
            name: "itemToIncrease",
            message: "Which Item would you like to add inventory to?",
            type: "list",
            choices: itemNames
        }
    ]).then(function(answer){
        console.log(answer)

        for (j = 0; j < inventory.length; j++) {

            if (answer.itemToIncrease === inventory[j].product_name) {
                var itemName = inventory[j].product_name;
                var currentStock = inventory[j].stock_quantity
                console.log(`You've chosen to increase ${answer.itemToIncrease} and this matches the item on file, ${inventory[j].product_name}, and it's current inventory is ${inventory[j].stock_quantity}`)
                inquirer.prompt([
                    {
                        name: "quantityToIncrease",
                        message: "How much would you like to increase this inventory?",
                    }
                ]).then(function(answer) {

                    var query = connection.query("UPDATE products SET ? WHERE ?",
                    [ 
                        {
                            stock_quantity: parseInt(currentStock) + parseInt(answer.quantityToIncrease)
                        },
                        {
                            product_name: itemName
                        }
                    ],
                    function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " items' inventory increased! \n");
                        viewAllProducts()
                    })

                })
            }

        }

    })

}

function viewAllProducts() {

    console.log("Gathering all products....\n")
    connection.query("SELECT * FROM products",
    function(err, res) {
        if (err) throw err;
        // console.log(res);
        for (i = 0; i < res.length; i++) {
            console.log(`Item #${res[i].item_id}: ${res[i].product_name} |${res[i].department_name}| Price: ${res[i].price} | Remaining: ${res[i].stock_quantity} \n`)
        }

    })    

}

function viewLowInventory() {
    console.log("Gathering all products with low inventory....\n")
    connection.query("SELECT * FROM products WHERE stock_quantity < 20",
    function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log(`Item #${res[i].item_id}: ${res[i].product_name} |${res[i].department_name}| Price: ${res[i].price} | Remaining: ${res[i].stock_quantity} \n`)
        }
    })
}

function addNewProduct() {

    inquirer.prompt([
        {
            name: "productName",
            message: "What is the name of this product?",
        },
        {
            name: "departmentName",
            message: "Which department is this a part of?",
            type: "list",
            choices: ["Food", "Supplies", "Electronics", "Misc."]
        },
        {
            name: "price",
            message: "What will this item cost?"
        },
        {
            name: "initialStock",
            message: "How many of these are in stock?"
        }
    ]).then(function(answer) {

        console.log(answer)
        var query = connection.query("INSERT INTO products SET ?",
        {
            product_name: answer.productName,
            department_name: answer.departmentName,
            price: parseInt(answer.price),
            stock_quantity: parseInt(answer.initialStock)   
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products added! \n")
            viewAllProducts() 
        })
    })
}