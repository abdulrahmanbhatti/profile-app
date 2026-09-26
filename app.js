
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS use karega SRV resolve karne ke liye
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Profile = require('./models/Profile');



mongoose.connect('mongodb+srv://abdulrehmanbhatti0010_db_user:8f8SSbpDXiEY2eqI@cluster0.mfcd6cl.mongodb.net/userProfileDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB Error:', err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));


app.get('/profile', async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({});
  }
  res.render('profile', { profile });
});


app.get('/profile/edit', async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({});
  }
  res.render('edit', { profile });
});


app.put('/profile', async (req, res) => {
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
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/profile`);
});

module.exports = app;