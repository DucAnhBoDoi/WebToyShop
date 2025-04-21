const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://DucAnh:123@toyscluster.jhlwp.mongodb.net/?retryWrites=true&w=majority&appName=ToysCluster";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let usersCollection, productsCollection;

client.connect()
    .then(() => {
        const db = client.db("Toy");
        productsCollection = db.collection("Products");
        usersCollection = db.collection("Users");
        console.log("Đã kết nối MongoDB Atlas!");
    })
    .catch(err => {
        console.error("Lỗi kết nối MongoDB:", err);
    });


// Đăng ký
app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userExist = await usersCollection.findOne({ username });
        if (userExist) return res.status(400).json({ error: "Tên người dùng đã tồn tại!" });

        const hashed = await bcrypt.hash(password, 10);
        await usersCollection.insertOne({ username, password: hashed });
        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Đăng nhập
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await usersCollection.findOne({ username });
        if (!user) return res.status(401).json({ error: "Tên người dùng không đúng!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Mật khẩu sai!" });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || "secret123", {
            expiresIn: "1d",
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    console.log(`✅ Server đang chạy tại cổng: ${port}`);
});

