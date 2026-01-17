const crypto = require('crypto');

// Generate random token
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = generateToken;