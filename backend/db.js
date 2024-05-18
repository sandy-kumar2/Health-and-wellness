const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook?"

const connectToMongo = async() => {
    await mongoose.connect(mongoURI, console.log("connect to mongoose"))
}

module.exports = connectToMongo;