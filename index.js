var mysql = require("mysql")
var inquirer = require("mysql")

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
        function(err, res) {
            if (err) throw err;
            // console.log(res);
            for (i = 0; i < res.length; i++) {
            console.log(`Item #${res[i].item_id}: ${res[i].product_name} |${res[i].department_name}| Price: ${res[i].price}\n`)
            }

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
            .then(function(answer) {
                


            })

        }
    )



}



// Track Sales