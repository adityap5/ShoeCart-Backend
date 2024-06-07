const mongoose = require('mongoose');

const mongodbUrl = "mongodb+srv://aditya29pippal:NvcmhXHr6yjnLVal@cluster0.xeaerbn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb =()=>{
    return mongoose.connect(mongodbUrl);
}

module.exports={connectDb};