const z=require("zod")

const signUpBody=z.object({
    username:z.string(),
    password:z.string()
})


const signInBody=z.object({
    username:z.string(),
    password:z.string()
})


const createToDo=z.object({
    title:z.string(),
    description:z.string()
})


const updateToDo=z.object({
    _id:z.string(),
})

module.exports={signUpBody,signInBody,createToDo,updateToDo}