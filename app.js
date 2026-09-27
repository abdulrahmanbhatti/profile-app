if (!process.env.VERCEL) {
  try {
    const dns = require("node:dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    console.warn("DNS setup ignored:", e.message);
  }
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Profile = require("./models/profile");

mongoose
  .connect(
    "mongodb+srv://abdulrehmanbhatti0010_db_user:8f8SSbpDXiEY2eqI@cluster0.mfcd6cl.mongodb.net/userProfileDB?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected successfully!"))
  .catch((err) => console.error("MongoDB Error:", err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Home route redirects to /profile
app.get("/", (req, res) => {
  res.redirect("/profile");
});

// Profile route
app.get("/profile", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.render("profile", { profile });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Error loading profile");
  }
});

// Profile edit page
app.get("/profile/edit", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.render("edit", { profile });
  } catch (err) {
    console.error("Error loading edit page:", err);
    res.status(500).send("Error loading edit page");
  }
});

// Profile update route
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
    res.status(500).send("Error updating profile");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/profile`);
});

module.exports = app;
