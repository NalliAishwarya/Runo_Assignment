const bcrypt = require('bcrypt');

const password = 'cbit123';  // Replace with your desired admin password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log("Hashed Password:", hash);
});
