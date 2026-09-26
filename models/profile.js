const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  firstName: { type: String, default: 'Andrew' },
  lastName: { type: String, default: 'Turing' },
  timeZone: { type: String, default: '+5 GMT' },
  phone: { type: String, default: '555-237-2384' },
  email: { type: String, default: 'andrew.turing@cryptographyinc.com' },
  samlId: { type: String, default: 'andrew.turing@cryptographyinc.com' },
  samlDetails: { 
    type: String, 
    default: 'https://cryptographyinc.com/login/secure/kQ2Bneiw99' 
  },
  avatarUrl: { type: String, default: '/avatar.jpg' }
});

module.exports = mongoose.model('Profile', profileSchema);