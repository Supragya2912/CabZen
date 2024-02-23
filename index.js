const express = require('express');
const app = express();
require('dotenv').config()
const connectToDB = require('./db')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const PORT = process.env.PORT || 3000;

connectToDB();
app.get('/',  (req,res) => {
    res.send('Hello')
})

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    cors({
        origin: 'http://localhost:3000',
        method: ['GET', 'POST', 'PUT','DELETE'],
        allowedHeaders: ['Access-Control-Allow-Origin', 'Content-Type'],
    
    })
)

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
})

