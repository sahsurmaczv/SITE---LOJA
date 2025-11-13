// ========================
// 📦 IMPORTAÇÕES
// ========================
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

// ========================
// 🧩 MIDDLEWARES
// ========================
app.use(express.json());

// 🔐 CORS com múltiplas origens (frontend e admin)
const allowedOrigins = [
  "http://localhost:3000", // loja (cliente)
  "http://localhost:3001", // painel admin
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS bloqueado para essa origem: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "auth-token"],
  })
);

// ========================
// 🗄️ CONEXÃO COM O BANCO
// ========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// ========================
// 🖼️ UPLOAD DE IMAGENS
// ========================
const uploadDir = path.join(__dirname, "upload/images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use("/images", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Tipo de arquivo não permitido"));
    }
    cb(null, true);
  },
});

// 🔹 Upload de imagem
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "Nenhum arquivo enviado" });

  res.json({
    success: true,
    image_url: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
});

// ========================
// 🔐 AUTENTICAÇÃO
// ========================
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).json({ success: false, message: "Token ausente" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token inválido" });
  }
};

// Middleware admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id);
    if (user?.role === "admin") next();
    else
      res
        .status(403)
        .json({ success: false, message: "Acesso negado. Somente administradores." });
  } catch {
    res.status(500).json({ success: false, message: "Erro ao verificar permissões" });
  }
};

// ========================
// 🧱 MODELOS
// ========================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now },
  role: { type: String, default: "user" },
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

const Users = mongoose.model("Users", userSchema);
const Product = mongoose.model("Product", productSchema);

// ========================
// 🚀 ROTAS
// ========================

// 🌐 Teste
app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

// ------------------------
// 🧍 CADASTRO E LOGIN
// ------------------------
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Campos obrigatórios ausentes" });

    const existingUser = await Users.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);
    const cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;

    const user = new Users({ name: username, email, password: hashed, cartData: cart });
    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, token });
  } catch (err) {
    console.error("Erro no signup:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Email não cadastrado" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ success: false, message: "Senha incorreta" });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

app.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user)
      return res.status(400).json({ success: false, message: "Email não encontrado" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ success: false, message: "Senha incorreta" });

    if (user.role !== "admin")
      return res.status(403).json({ success: false, message: "Acesso negado — não é administrador." });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error("Erro no adminlogin:", err);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// ------------------------
// 🧩 ADMIN: PRODUTOS
// ------------------------
app.post("/addproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const { name, description, image, category, new_price, old_price } = req.body;
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      id: nextId,
      name,
      description,
      image,
      category,
      new_price,
      old_price,
    });

    await newProduct.save();
    res.json({ success: true, message: "Produto adicionado com sucesso!" });
  } catch (error) {
    console.error("Erro em /addproduct:", error);
    res.status(500).json({ success: false, message: "Erro ao adicionar produto." });
  }
});

app.post("/removeproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Product.findOneAndDelete({ id });
    if (!deleted)
      return res.status(404).json({ success: false, message: "Produto não encontrado." });
    res.json({ success: true, message: "Produto removido com sucesso!" });
  } catch (error) {
    console.error("Erro em /removeproduct:", error);
    res.status(500).json({ success: false, message: "Erro ao remover produto." });
  }
});

app.put("/editproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id, name, description, image, category, new_price, old_price } = req.body;
    const product = await Product.findOneAndUpdate(
      { id },
      { name, description, image, category, new_price, old_price },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ success: false, message: "Produto não encontrado." });
    res.json({ success: true, message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro em /editproduct:", error);
    res.status(500).json({ success: false, message: "Erro ao editar produto." });
  }
});

// ------------------------
// 🛍️ PRODUTOS PARA CLIENTE
// ------------------------
app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

app.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products.slice(-8));
  } catch {
    res.status(500).json({ success: false, message: "Erro ao buscar coleções novas" });
  }
});

app.get("/popularinwomen", async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    res.json(products.slice(0, 4));
  } catch {
    res.status(500).json({ success: false, message: "Erro ao buscar populares" });
  }
});

// ------------------------
// 🛒 CARRINHO
// ------------------------
app.post("/getcart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "Usuário não encontrado" });
    res.json(user.cartData);
  } catch (error) {
    console.error("Erro em /getcart:", error);
    res.status(500).json({ success: false, message: "Erro ao buscar carrinho" });
  }
});

// ========================
// 🚀 INICIAR SERVIDOR
// ========================
app.listen(port, () =>
  console.log(`🔥 Servidor rodando na porta ${port}`)
);
