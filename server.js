const express = require('express');
const bodyParser = require('body-parser');
const connectToDB=require('./models/db')
const authentication=require('./controllers/signupAuth');
connectToDB();
const app= express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/account', authentication);

app.listen(5243,()=>{
    console.log("Server listening on port 5243");
})