const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors());

app.get('/',(req,res)=>{
    res.send('welcoe to the server');
})

const authRouters = require('./routes/authRoute')
app.use("/auth", authRouters)

const userRouters = require('./routes/userRoute')
app.use("/api/users", userRouters)

module.exports =app;