const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB Connected');
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    }); 

};

module.exports = connectDB;