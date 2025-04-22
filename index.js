const mongoose = require('mongoose');
const session = require("express-session");
const express = require('express');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const path = require('path'); // Import path module
const books = require('./routes/books');
const Book = require('./models/book');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const app = express();

const Joi = require('joi');
const multer = require('multer');
const ejs = require('ejs');

// Middleware untuk parsing body
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log('>>> sebelum override, req.body =', req.body);
  next();
});
app.use(express.json());
app.use(methodOverride('_method'));

// session
app.use(session({
  secret : 'some_secret_key',
  resave : false,
  saveUninitialized : true,
}));

// Middleware untuk debugging
app.use((req, res, next) => {
  console.log('Metode HTTP:', req.method); // Pastikan ini mencetak "PUT"
  next();
});

// Set view engine
app.set('view engine', 'ejs');

// file static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/eBook', express.static(path.join(__dirname, 'eBook')));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api/books', books);

// connect ke MongoDB
mongoose.connect('mongodb://localhost/ManagemenBuku')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

const port = process.env.PORT || 4000;
app.listen(port,() => console.log(`Listening on port ${port}...`));

console.log('http://localhost:4000/');