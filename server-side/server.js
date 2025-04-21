const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://DucAnh:123@toyscluster.jhlwp.mongodb.net/?retryWrites=true&w=majority&appName=ToysCluster";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let productsCollection;

client.connect()
    .then(() => {
        const db = client.db("Toy");
        productsCollection = db.collection("Products");
        console.log("Đã kết nối MongoDB Atlas!");
    })
    .catch(err => {
        console.error("Lỗi kết nối MongoDB:", err);
    });

// Lấy danh sách sản phẩm
app.get("/products", async (req, res) => {
    if (!productsCollection) {
        return res.status(500).json({ error: "Chưa kết nối được đến MongoDB" });
    }

    try {
        const products = await productsCollection.find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi truy vấn sản phẩm: " + error.message });
    }
});

// Thêm sản phẩm mới 
app.post("/product/add", async (req, res) => {
    try {
        const newProduct = req.body;
        await productsCollection.insertOne(newProduct);
        res.json({ message: "Sản phẩm đã được thêm!", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Cập nhật sản phẩm
app.put("/product/update/:id", async (req, res) => {
    try {
        const updatedData = req.body;
        const result = await productsCollection.findOneAndUpdate(
            { id: req.params.id },
            { $set: updatedData },
            { returnDocument: "after" } 
        );
        res.json({ message: "Sản phẩm đã được cập nhật!", product: result.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Xóa sản phẩm
app.delete("/product/delete/:id", async (req, res) => {
    try {
        await productsCollection.deleteOne({ id: req.params.id });
        res.json({ message: "Sản phẩm đã bị xóa!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
