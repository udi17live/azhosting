const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
var cors = require('cors');

const app = express();
dotenv.config();

app.use(cors());

//Db Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to Db ${process.env.MONGODB_SCHEMA} ...`))
    .catch(err=> console.log("Error"));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

// BodyParser
app.use(express.urlencoded({ extended: false }))

//Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on port ${PORT}`));