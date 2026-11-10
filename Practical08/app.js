const express = require("express");
const mysql = require("mysql2");

const app = express();

const PORT = 3000;


// ============================
// Middleware
// ============================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Serve HTML/CSS/JS
app.use(express.static("public"));


// ============================
// MySQL Connection
// ============================

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "techmart"

});


db.connect((error) => {

    if (error) {

        console.error(
            "MySQL Connection Error:"
        );

        console.error(error.message);

        return;

    }

    console.log(
        "MySQL connected successfully!"
    );

});


// ============================
// GET - Read Products
// ============================

app.get("/api/products", (req, res) => {

    const sql =
        "SELECT * FROM products ORDER BY id DESC";


    db.query(sql, (error, results) => {

        if (error) {

            console.error(error);

            return res.status(500).json({
                message:
                    "Unable to fetch products"
            });

        }


        res.json(results);

    });

});


// ============================
// POST - Add Product
// ============================

app.post("/api/products", (req, res) => {

    const {
        name,
        category,
        price,
        quantity,
        description
    } = req.body;


    if (
        !name ||
        !category ||
        price === undefined ||
        quantity === undefined
    ) {

        return res.status(400).json({
            message:
                "Please fill all required fields."
        });

    }


    const sql = `
        INSERT INTO products
        (name, category, price, quantity, description)
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            name.trim(),
            category.trim(),
            Number(price),
            Number(quantity),
            description
                ? description.trim()
                : ""
        ],
        (error, result) => {

            if (error) {

                console.error(error);

                return res.status(500).json({
                    message:
                        "Product could not be added."
                });

            }


            res.status(201).json({

                message:
                    "Product added successfully.",

                id:
                    result.insertId

            });

        }
    );

});


// ============================
// PUT - Update Product
// ============================

app.put(
    "/api/products/:id",
    (req, res) => {

        const id =
            Number(req.params.id);


        const {
            name,
            category,
            price,
            quantity,
            description
        } = req.body;


        if (
            !id ||
            !name ||
            !category ||
            price === undefined ||
            quantity === undefined
        ) {

            return res.status(400).json({
                message:
                    "Invalid product data."
            });

        }


        const sql = `
            UPDATE products
            SET
                name = ?,
                category = ?,
                price = ?,
                quantity = ?,
                description = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [
                name.trim(),
                category.trim(),
                Number(price),
                Number(quantity),
                description
                    ? description.trim()
                    : "",
                id
            ],
            (error, result) => {

                if (error) {

                    console.error(error);

                    return res.status(500).json({
                        message:
                            "Update failed."
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Product not found."
                    });

                }


                res.json({
                    message:
                        "Product updated successfully."
                });

            }
        );

    }
);


// ============================
// DELETE - Delete Product
// ============================

app.delete(
    "/api/products/:id",
    (req, res) => {

        const id =
            Number(req.params.id);


        if (!id) {

            return res.status(400).json({
                message:
                    "Invalid product ID."
            });

        }


        const sql =
            "DELETE FROM products WHERE id = ?";


        db.query(
            sql,
            [id],
            (error, result) => {

                if (error) {

                    console.error(error);

                    return res.status(500).json({
                        message:
                            "Delete failed."
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Product not found."
                    });

                }


                res.json({
                    message:
                        "Product deleted successfully."
                });

            }
        );

    }
);


// ============================
// START SERVER
// ============================

app.listen(
    PORT,
    () => {

        console.log(
            `TechMart running at http://localhost:${PORT}`
        );

    }
);