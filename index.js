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
    displayItems()
})




/// Buy Item / Decrease Quantity

function displayItems() {
    console.log("-----------------------------\n")
    console.log("----WELCOME TO BAMAZON-------\n")
    console.log("-----------------------------\n")
    console.log(" Getting inventory....")
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            // console.log(res);
            for (i = 0; i < res.length; i++) {
                console.log(`Item #${res[i].item_id}: ${res[i].product_name} |${res[i].department_name}| Price: ${res[i].price} | Remaining: ${res[i].stock_quantity} \n`)
            }

            checkBuyOrder(res)

        }
    )
}
function checkBuyOrder(inventory) {

    var inv = inventory

    inquirer.prompt([
        {
            name: "itemChosen",
            message: "What is the ID of the item you'd like to buy?"
        },
        {
            name: "quantityBuying",
            message: "What is the quantity of this item you'd like to buy?"
        }
    ])
        .then(function (answer) {
            // console.log(inv)
            // console.log(inventory)
            for (j = 0; j < inventory.length; j++) {

                if (answer.itemChosen == inventory[j].item_id) {

                    console.log(`You have requested to buy item ${answer.itemChosen} where ${inventory[j].item_id} matches. You'd like to buy ${answer.quantityBuying} amount and there are ${inventory[j].stock_quantity} of these remaining`)

                    if (answer.quantityBuying < inventory[j].stock_quantity) {

                        var query = connection.query("UPDATE products SET ? WHERE ?",
                            [ 
                                {
                                    stock_quantity: parseInt(inventory[j].stock_quantity) - parseInt(answer.quantityBuying)
                                },
                                {
                                    item_id: answer.itemChosen
                                }
                            ],
                            function(err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " products sold! \n");
                                connection.end() 
                            }
                        )

                    } else {
                        console.log("Sorry we do not have that many in stock!")
                        connection.end()
                    }
                }
            }
            // var query = connection.query("UPDATE products SET ? WHERE ? ")
        })
}



// Track Sales