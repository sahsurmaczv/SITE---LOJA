const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro MongoDB:", err));

const uploadFolder = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

app.use("/images", express.static(uploadFolder));

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  cartData: {
    type: Map,
    of: Number,
    default: {}
  },
});

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  image: String,
  category: String,
  new_price: Number,
  available: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

const Users = mongoose.model("Users", userSchema);
const Product = mongoose.model("Product", productSchema);

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ success: false, message: "Token ausente" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token inválido" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(400).json({ success: false, message: "Usuário não existe" });
    if (user.role !== "admin")
      return res.status(403).json({ success: false, message: "Apenas administradores" });
    next();
  } catch (err) {
    console.error("Erro isAdmin:", err);
    res.status(500).json({ success: false, message: "Erro interno" });
  }
};

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ success: false, message: "Preencha todos os campos" });

    if (await Users.findOne({ email }))
      return res.json({ success: false, message: "Email já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);

    const cart = {};
    for (let i = 1; i <= 500; i++) cart[String(i)] = 0;

    const user = new Users({
      name: username,
      email,
      password: hashed,
      cartData: cart, 
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (err) {
    console.error("Erro /signup:", err);
    res.json({ success: false, message: "Erro interno" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.json({ success: false, message: "Email não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ success: false, message: "Senha incorreta" });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error("Erro /login:", err);
    res.json({ success: false, message: "Erro interno" });
  }
});

app.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.json({ success: false, message: "Email não encontrado" });
    if (user.role !== "admin")
      return res.json({ success: false, message: "Apenas administradores" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.json({ success: false, message: "Senha incorreta" });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (err) {
    console.error("Erro /adminlogin:", err);
    res.json({ success: false, message: "Erro interno" });
  }
});

app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) return res.json({ success: false, message: "Nenhum arquivo enviado" });

  const url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  res.json({ success: true, image_url: url });
});

app.post("/addproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const { name, description, image, category, new_price } = req.body;

    if (!name || !category)
      return res.json({ success: false, message: "Nome e categoria obrigatórios!" });

    const last = await Product.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const product = new Product({
      id: nextId,
      name,
      description,
      image,
      category,
      new_price,
    });

    await product.save();

    res.json({ success: true, message: "Produto adicionado!" });
  } catch (err) {
    console.log("Erro addproduct:", err);
    res.json({ success: false, message: "Erro ao adicionar produto" });
  }
});

app.put("/editproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.json({ success: false, message: "Produto não encontrado" });

    res.json({ success: true, message: "Produto atualizado!" });
  } catch (err) {
    console.error("Erro editproduct:", err);
    res.json({ success: false, message: "Erro ao atualizar" });
  }
});

app.post("/removeproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const id = Number(req.body.id);
    if (!id && id !== 0) return res.json({ success: false, message: "ID inválido" });

    const removed = await Product.findOneAndDelete({ id });

    if (!removed)
      return res.json({ success: false, message: "Produto não existe" });

    const key = `cartData.${id}`;
    await Users.updateMany({}, { $set: { [key]: 0 } });

    res.json({ success: true, message: "Produto removido e carrinhos atualizados!" });
  } catch (err) {
    console.error("Erro removeproduct:", err);
    res.json({ success: false, message: "Erro ao remover" });
  }
});

app.get("/allproducts", async (req, res) => {
  try {
    const prods = await Product.find({ available: true });
    res.json(prods);
  } catch (err) {
    console.error("Erro allproducts:", err);
    res.json([]);
  }
});

app.post("/getcart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.json({});
    res.json(user.cartData);
  } catch (err) {
    console.error("Erro getcart:", err);
    res.json({});
  }
});

app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    const id = String(itemId);

    const user = await Users.findById(req.user.id);
    if (!user) return res.json({ success: false });

    const current = Number(user.cartData.get(id) || 0);
    user.cartData.set(id, current + 1);

    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Erro addtocart:", err);
    res.json({ success: false });
  }
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    const { itemId } = req.body;
    const id = String(itemId);

    const user = await Users.findById(req.user.id);
    if (!user) return res.json({ success: false });

    const current = Number(user.cartData.get(id) || 0);
    user.cartData.set(id, Math.max(current - 1, 0));

    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Erro removefromcart:", err);
    res.json({ success: false });
  }
});

app.post("/clean-cart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.json({ success: false });

    const prods = await Product.find({}, "id");
    const validIds = new Set(prods.map((p) => String(p.id)));

    for (const key of Object.keys(user.cartData || {})) {
      if (!validIds.has(String(key))) {
        user.cartData[key] = 0;
      }
    }

    await user.save();
    res.json({ success: true, cart: user.cartData });
  } catch (err) {
    console.error("Erro clean-cart:", err);
    res.json({ success: false });
  }
});

app.post("/clearcart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);

    if (!user)
      return res.json({ success: false, message: "Usuário não encontrado" });

    const cart = {};
    for (let i = 1; i <= 500; i++) cart[i] = 0;

    user.cartData = cart;
    await user.save();

    res.json({ success: true, message: "Carrinho limpo com sucesso!" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Erro interno ao limpar o carrinho" });
  }
});

app.listen(port, () =>
  console.log(`Servidor rodando na porta ${port}`)
);
