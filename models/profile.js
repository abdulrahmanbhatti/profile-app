const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  firstName: { type: String, default: 'Abdul' },
  lastName: { type: String, default: 'Rahman' },
  timeZone: { type: String, default: '+5 GMT' },
  phone: { type: String, default: '03053744981' },
  email: { type: String, default: 'abdulrahmanbhatti677@gmail.com' },
  samlId: { type: String, default: 'linkedIn.com' },
  samlDetails: { 
    type: String, 
    default: 'https://cryptographyinc.com/login/secure/kQ2Bneiw99' 
  },
  avatarUrl: { type: String, default: '/avatar.jpg' }
});

module.exports = mongoose.model('Profile', profileSchema);