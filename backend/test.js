const mongoose = require('mongoose');
const User = require('./models/UserModel');

mongoose.connect('mongodb://127.0.0.1:27017/narisakti');

async function test() {
  try {
    const user = await User.create({
      firstName: 'ram',
      lastName: 'Sahu',
      email: 'ram@gmail.com',
      phone: '9801234567',
      password: '987654'
    });

    console.log(user);
  } catch (error) {
    console.log(error.message);
  }

  process.exit();
}

test();