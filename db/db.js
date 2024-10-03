require('dotenv').config();
const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URI, {

    serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
});

const userSchema=new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String
})

const todoSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:String,
    description:String,
    completed:Boolean
})

const Todo=mongoose.model('todos',todoSchema);
const User=mongoose.model('Users',userSchema);

module.exports={Todo,User}