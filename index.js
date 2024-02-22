const express = require('express');
const app = express();
require('dotenv').config()
const connectToDB = require('./db')
const PORT = process.env.PORT || 3000;

connectToDB();
app.get('/',  (req,res) => {
    res.send('Hello')
})

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
})

