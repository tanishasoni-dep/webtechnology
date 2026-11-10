const express = require("express");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

app.use(express.static("public"));

// Product Data
let products = [
    {
        id: 1,
        name: "Laptop",
        category: "Computer",
        price: 55000,
        stock: 10
    },
    {
        id: 2,
        name: "Smartphone",
        category: "Mobile",
        price: 25000,
        stock: 20
    },
    {
        id: 3,
        name: "Wireless Mouse",
        category: "Accessories",
        price: 1200,
        stock: 30
    },
    {
        id: 4,
        name: "Keyboard",
        category: "Accessories",
        price: 1800,
        stock: 25
    }
];


// =====================================
// GET - Retrieve all products
// =====================================

app.get("/api/products", (req, res) => {

    res.status(200).json(products);

});


// =====================================
// GET - Retrieve product by ID
// =====================================

app.get("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(
        item => item.id === id
    );

    if (!product) {

        return res.status(404).json({
            message: "Product not found"
        });

    }

    res.status(200).json(product);

});


// =====================================
// POST - Add new product
// =====================================

app.post("/api/products", (req, res) => {

    const {
        name,
        category,
        price,
        stock
    } = req.body;

    // Validation
    if (
        !name ||
        !category ||
        price === undefined ||
        stock === undefined
    ) {

        return res.status(400).json({
            message: "All fields are required"
        });

    }

    const newProduct = {

        id: products.length + 1,

        name: name.trim(),

        category: category.trim(),

        price: Number(price),

        stock: Number(stock)

    };

    products.push(newProduct);

    res.status(201).json({

        message: "Product added successfully",

        product: newProduct

    });

});


// =====================================
// Handle invalid routes
// =====================================

app.use((req, res) => {

    res.status(404).json({

        message: "API endpoint not found"

    });

});


// =====================================
// Start Server
// =====================================

app.listen(PORT, () => {

    console.log(
        `QuickShop server running at http://localhost:${PORT}`
    );

});