const mongoose = require('mongoose');
const books = require('./routes/books');
const Book = require('./models/book');
const Joi = require('joi');
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const app = express();
const path = require('path'); // Import path module

app.set('view engine', 'ejs');
 
mongoose.connect('mongodb://localhost/ManagemenBuku')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/books', books);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/eBook', express.static(path.join(__dirname, 'eBook')));

app.get('/', async (req,res) => {
  try{
    console.log("Book model:", Book);
    const books = await Book.find().sort('name');
    res.render('index', { books});
  } catch(error){
    console.error("Error mengambil buku:", error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data buku.');
  }
});

const port = process.env.PORT || 4000;
app.listen(port,() => console.log(`Listening on port ${port}...`));