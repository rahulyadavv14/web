import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "supersecretkey";
const MONGO_URI = "YOUR_MONGODB_ATLAS_URL_HERE";

/* ================= DATABASE ================= */

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= MODELS ================= */

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "Sales" }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Won", "Lost"],
    default: "New"
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Lead = mongoose.model("Lead", leadSchema);

/* ================= MIDDLEWARE ================= */

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

/* ================= AUTH ROUTES ================= */

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.json(user);
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/* ================= LEADS ROUTES ================= */

app.post("/api/leads", verifyToken, async (req, res) => {
  const lead = await Lead.create(req.body);
  res.json(lead);
});

app.get("/api/leads", verifyToken, async (req, res) => {
  const leads = await Lead.find().populate("assignedTo");
  res.json(leads);
});

app.put("/api/leads/:id", verifyToken, async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(lead);
});

app.delete("/api/leads/:id", verifyToken, async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ================= BASIC FRONTEND ================= */

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>CRM Dashboard</title>
    <style>
      body { font-family: Arial; padding: 40px; }
      input, button { padding: 8px; margin: 5px; }
      .lead { border:1px solid #ddd; padding:10px; margin:5px 0; }
    </style>
  </head>
  <body>
    <h1>Simple CRM</h1>
    <div>
      <h3>Login</h3>
      <input id="email" placeholder="Email" />
      <input id="password" placeholder="Password" type="password" />
      <button onclick="login()">Login</button>
    </div>

    <div>
      <h3>Add Lead</h3>
      <input id="leadName" placeholder="Lead Name" />
      <input id="leadEmail" placeholder="Lead Email" />
      <button onclick="addLead()">Add</button>
    </div>

    <div>
      <h3>Leads</h3>
      <div id="leads"></div>
    </div>

    <script>
      let token = "";

      async function login() {
        const res = await fetch("/api/login", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            email: email.value,
            password: password.value
          })
        });
        const data = await res.json();
        token = data.token;
        loadLeads();
      }

      async function addLead() {
        await fetch("/api/leads", {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + token
          },
          body: JSON.stringify({
            name: leadName.value,
            email: leadEmail.value
          })
        });
        loadLeads();
      }

      async function loadLeads() {
        const res = await fetch("/api/leads", {
          headers:{ "Authorization":"Bearer " + token }
        });
        const data = await res.json();
        leads.innerHTML = data.map(l =>
          "<div class='lead'>" + l.name + " - " + l.status + "</div>"
        ).join("");
      }
    </script>
  </body>
  </html>
  `);
});

/* ================= SERVER ================= */

app.listen(PORT, () => console.log("Server running on port " + PORT));