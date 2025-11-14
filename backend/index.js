// ===============================================
// 📦 IMPORTAÇÕES
// ===============================================
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

// ===============================================
// 🌐 CORS — PERMITIR FRONT + ADMIN
// ===============================================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// ===============================================
// 🗄️ CONEXÃO COM O MONGO
// ===============================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// ===============================================
// 📁 PASTA UPLOAD
// ===============================================
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

// ===============================================
// 📌 MODELOS
// ===============================================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  cartData: Object,
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

// ===============================================
// 🔐 MIDDLEWARES auth
// ===============================================
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
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(400).json({ success: false, message: "Usuário não existe" });
  if (user.role !== "admin")
    return res.status(403).json({ success: false, message: "Apenas administradores" });
  next();
};

// ===============================================
// 👤 SIGNUP / LOGIN USUÁRIO
// ===============================================
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ success: false, message: "Preencha todos os campos" });

    if (await Users.findOne({ email }))
      return res.json({ success: false, message: "Email já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);

    const cart = {};
    for (let i = 1; i <= 500; i++) cart[i] = 0;

    const user = new Users({
      name: username,
      email,
      password: hashed,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch {
    res.json({ success: false, message: "Erro interno" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });
  if (!user) return res.json({ success: false, message: "Email não encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ success: false, message: "Senha incorreta" });

  const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
  res.json({ success: true, token, role: user.role });
});

// ===============================================
// 👑 LOGIN ADMIN
// ===============================================
app.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });
  if (!user) return res.json({ success: false, message: "Email não encontrado" });
  if (user.role !== "admin")
    return res.json({ success: false, message: "Apenas administradores" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ success: false, message: "Senha incorreta" });

  const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// ===============================================
// 🖼️ UPLOAD DE IMAGEM
// ===============================================
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) return res.json({ success: false, message: "Nenhum arquivo enviado" });

  const url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  res.json({ success: true, image_url: url });
});

// ===============================================
// 📦 PRODUTOS — ADMIN
// ===============================================
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
    console.log(err);
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
    res.json({ success: false, message: "Erro ao atualizar" });
  }
});

app.post("/removeproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const removed = await Product.findOneAndDelete({ id: req.body.id });

    if (!removed)
      return res.json({ success: false, message: "Produto não existe" });

    res.json({ success: true, message: "Produto removido!" });
  } catch {
    res.json({ success: false, message: "Erro ao remover" });
  }
});

// ===============================================
// 🛍️ PRODUTOS — CLIENTE
// ===============================================
app.get("/allproducts", async (req, res) => {
  res.json(await Product.find({ available: true }));
});

// ===============================================
// 🛒 CARRINHO — GET / ADD / REMOVE
// ===============================================
app.post("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  if (!user) return res.json({});
  res.json(user.cartData);
});

app.post("/addtocart", fetchUser, async (req, res) => {
  const { itemId } = req.body;

  const user = await Users.findById(req.user.id);
  user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;

  await user.save();
  res.json({ success: true });
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  const { itemId } = req.body;

  const user = await Users.findById(req.user.id);
  user.cartData[itemId] = Math.max((user.cartData[itemId] || 0) - 1, 0);

  await user.save();
  res.json({ success: true });
});

// ===============================================
// 🚀 INICIAR SERVIDOR
// ===============================================
app.listen(port, () =>
  console.log(`🔥 Servidor rodando na porta ${port}`)
);
