require('dotenv').config();
const express=require("express");
const {signUpBody,signInBody,createToDo,updateToDo} = require("./types");
const {Todo,User} = require("./db/db");
const cors=require("cors")
const jwt=require('jsonwebtoken')
const authMiddleware=require('./middleware')
const JWT_SECRET=require('./config')
const app=express();
app.use(express.json());
app.use(cors({}))

app.post('/signup',async(req,res)=>{
    const signupPayload=req.body;
    const result=signUpBody.safeParse(signupPayload)

    if(!result.success){
        return res.json({msg: "wrong inputs"})
    }

    const existingUser=await User.findOne({
        username:req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: " already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId=user._id
    
    const token=jwt.sign({userId},JWT_SECRET)
    res.json({
        message: "User created successfully",
        token: token
    })
})

app.post("/signin",async (req,res)=>{
    const signinPayload=req.body
    const result=signInBody.safeParse(signinPayload)

    if(!result.success){
        return res.json({msg: "wrong inputs"})
    }

    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(user){
    const token=jwt.sign({userId:user._id},JWT_SECRET)
    res.json({
        token: token
    })
    return;
    }

    return res.json({msg:"No such user not found"})
})


app.post("/todo",authMiddleware,async (req,res)=>{

    const createPayload=req.body;
    const parsedPayload=createToDo.safeParse(createPayload);
    if(!parsedPayload.success){
        console.log(parsedPayload)
        return res.json({msg:"input not valid"});
    }
    //mongo db save
    await Todo.create({
        userId:req.userId,
        title:createPayload.title,
        description:createPayload.description,
        completed:false
    })
    return res.json({msg:"todo created"});

})

app.get("/todos",authMiddleware,async (req,res)=>{

    const allTodos=await Todo.find({userId:req.userId});
    return res.json({allTodos:allTodos})

})


app.put("/completed",authMiddleware,async (req,res)=>{

    const updatePayload=req.body;
    
    const todoItem = await Todo.findById(req.body._id);
    if (!todoItem) {
        return res.status(404).json({ msg: "todo not found" });
    }
    
    // Toggle the completion status
    const updatedTodo = await Todo.updateOne(
        { _id: updatePayload._id },
        { $set: { completed: !todoItem.completed } }
    );
    

    res.json({ msg: "todo marked as completed" });
   
});

app.put("/edittask",authMiddleware, async (req, res) => {
    const { _id, title, description } = req.body;

    // Validate input
    if (!_id || !title || !description) {
        return res.status(400).json({ msg: "Invalid input" });
    }

    // Update the ToDo item
    const result = await Todo.updateOne(
        { _id: _id },
        { $set: { title: title, description: description } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ msg: "Todo not found" });
    }

    res.json({ msg: "Todo updated successfully" });
});


app.delete("/todo",authMiddleware, async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ msg: "Invalid input" });
    }

    const result = await Todo.deleteOne({ _id: _id });

    if (result.deletedCount === 0) {
        return res.status(404).json({ msg: "Todo not found" });
    }

    res.json({ msg: "Todo deleted successfully" });
});


app.listen(3000,()=>{console.log("Server is running on port 3000")})