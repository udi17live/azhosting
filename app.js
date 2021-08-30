const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const cors = require('cors');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
dotenv.config();

app.use(cors());

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Serve Static Files
app.use(express.static('public'));

// BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.get('*', function(req, res){
  res.status(404);
  res.render('404',{title:"Oops,Page Not found"});
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on port ${PORT}`));