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
    type: mongoose.Schema.Types.Mixed,
    default: () => {
      const c = {};
      for (let i = 1; i <= 500; i++) c[String(i)] = 0;
      return c;
    },
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
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(400).json({ success: false, message: "Usuário não existe" });
  if (user.role !== "admin")
    return res.status(403).json({ success: false, message: "Apenas administradores" });
  next();
};
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ success: false, message: "Preencha todos os campos" });

    if (await Users.findOne({ email }))
      return res.json({ success: false, message: "Email já cadastrado" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new Users({
      name: username,
      email,
      password: hashed,
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
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) return res.json({ success: false, message: "Nenhum arquivo enviado" });
  const url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  res.json({ success: true, image_url: url });
});
app.post("/addproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const { name, description, image, category, new_price } = req.body;
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
    res.json({ success: false, message: "Erro ao adicionar produto" });
  }
});
app.get("/allproducts", async (req, res) => {
  res.json(await Product.find({ available: true }));
});
app.post("/getcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  if (!user) return res.json({});

  const products = await Product.find({ available: true });

  // cria mapa rápido para saber se o produto existe
  const validIds = new Set(products.map((p) => String(p.id)));

  let changed = false;
  const cleanedCart = { ...user.cartData };

  // remove itens do carrinho que não existem mais
  for (const id in cleanedCart) {
    if (!validIds.has(id)) {
      cleanedCart[id] = 0;
      changed = true;
    }
  }

  if (changed) {
    user.cartData = cleanedCart;
    user.markModified("cartData");
    await user.save();
  }

  res.json(cleanedCart);
});

app.post("/addtocart", fetchUser, async (req, res) => {
  const id = String(req.body.itemId);
  const user = await Users.findById(req.user.id);
  user.cartData[id] = (user.cartData[id] || 0) + 1;
  user.markModified("cartData");
  await user.save();
  res.json({ success: true });
});
app.post("/removefromcart", fetchUser, async (req, res) => {
  const id = String(req.body.itemId);
  const user = await Users.findById(req.user.id);
  user.cartData[id] = Math.max((user.cartData[id] || 0) - 1, 0);
  user.markModified("cartData");
  await user.save();
  res.json({ success: true });
});
app.post("/clearcart", fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  const empty = {};
  for (let i = 1; i <= 500; i++) empty[String(i)] = 0;
  user.cartData = empty;
  user.markModified("cartData");
  await user.save();
  res.json({ success: true, cart: empty });
});
app.post("/removeproduct", fetchUser, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;

    // Marca o produto como indisponível
    const product = await Product.findOneAndUpdate(
      { id },
      { available: false },
      { new: true }
    );

    if (!product)
      return res.json({
        success: false,
        message: "Produto não encontrado"
      });

    // LIMPA este produto do carrinho de TODOS os usuários
    const users = await Users.find({});
    for (let user of users) {
      if (user.cartData[id] && user.cartData[id] > 0) {
        user.cartData[id] = 0;
        user.markModified("cartData");
        await user.save();
      }
    }

    return res.json({
      success: true,
      message: "Produto removido e carrinhos atualizados"
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erro ao remover produto" });
  }
});

app.post("/clean-cart", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    const products = await Product.find({ available: true });

    const validIds = new Set(products.map(p => String(p.id)));

    let altered = false;

    for (let id in user.cartData) {
      if (!validIds.has(id) && user.cartData[id] > 0) {
        user.cartData[id] = 0;
        altered = true;
      }
    }

    if (altered) {
      user.markModified("cartData");
      await user.save();
    }

    res.json({ success: true, cart: user.cartData });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.listen(port, () =>
  console.log(`Servidor rodando na porta ${port}`)
);
