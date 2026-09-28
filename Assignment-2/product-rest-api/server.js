const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// 100 Products
const products = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    category: `Category ${(index % 5) + 1}`,
    price: (index + 1) * 100,
    inStock: index % 2 === 0
}));

// Home route
app.get("/", (req, res) => {
    res.send("Product REST API is running!");
});

// GET all products
app.get("/products", (req, res) => {
    res.json(products);
});

// GET a single product by ID
app.get("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// POST a new product
app.post("/products", (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        inStock: req.body.inStock
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// DELETE a product
app.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct[0]
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});