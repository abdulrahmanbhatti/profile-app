// Local machine par Pakistani ISPs ke liye Google DNS ki zaroorat hoti hai
// Vercel / Cloud environment mein isay disable rakhein taake VPC network block na ho
if (!process.env.VERCEL) {
  try {
    const dns = require("node:dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    console.warn("DNS setup ignored:", e.message);
  }
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Profile = require("./models/profile");

const app = express();

const MONGODB_URI =
  "mongodb+srv://abdulrehmanbhatti0010_db_user:8f8SSbpDXiEY2eqI@cluster0.mfcd6cl.mongodb.net/userProfileDB?retryWrites=true&w=majority&appName=Cluster0";

// Serverless friendly MongoDB connection caching
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log("MongoDB Connected successfully!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
}

// Connect immediately on startup
connectDB().catch((err) =>
  console.error("Initial DB connection failed:", err.message)
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Middleware: ensure database connection is ready before handling request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res
      .status(500)
      .send(
        "Database Connection Error. Please verify MongoDB Atlas Network Access (0.0.0.0/0). Error details: " +
          err.message
      );
  }
});

// Home route: redirect to /profile
app.get("/", (req, res) => {
  res.redirect("/profile");
});

app.get("/profile", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.render("profile", { profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send("Error loading profile: " + err.message);
  }
});

app.get("/profile/edit", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.render("edit", { profile });
  } catch (err) {
    console.error("Error fetching profile for edit:", err);
    res.status(500).send("Error loading edit page: " + err.message);
  }
});

app.put("/profile", async (req, res) => {
  try {
    const { firstName, lastName, timeZone, phone, email, samlId, samlDetails } =
      req.body;

    await Profile.findOneAndUpdate(
      {},
      {
        firstName,
        lastName,
        timeZone,
        phone,
        email,
        samlId,
        samlDetails,
      }
    );

    res.redirect("/profile");
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Error updating profile: " + err.message);
  }
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/profile`);
  });
}

module.exports = app;
