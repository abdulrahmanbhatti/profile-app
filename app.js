const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Profile = require('./models/profile');
const path = require('path');

const MONGO_URI = 'mongodb+srv://abdulrehmanbhatti0010_db_user:8f8SSbpDXiEY2eqI@cluster0.mfcd6cl.mongodb.net/userProfileDB?retryWrites=true&w=majority&appName=Cluster0';

// Global cache for serverless connection
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err;
  }
}

// Middleware: Har request aane par DB connect ensure karega
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).send('Database connection failed');
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Redirect root to profile
app.get('/', (req, res) => {
  res.redirect('/profile');
});

app.get('/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.render('profile', { profile });
  } catch (err) {
    console.error('Error loading profile:', err);
    res.status(500).send('Error loading profile');
  }
});

app.get('/profile/edit', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.render('edit', { profile });
  } catch (err) {
    res.status(500).send('Error loading edit page');
  }
});

app.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName, timeZone, phone, email, samlId, samlDetails } = req.body;
    await Profile.findOneAndUpdate({}, {
      firstName,
      lastName,
      timeZone,
      phone,
      email,
      samlId,
      samlDetails
    });
    res.redirect('/profile');
  } catch (err) {
    res.status(500).send('Error updating profile');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/profile`);
});

module.exports = app;