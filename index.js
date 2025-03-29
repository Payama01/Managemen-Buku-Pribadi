const mongoose = require('mongoose');
const books = require('./routes/books');
const Joi = require('joi');
const express = require('express');
const app = express();
const path = require('path'); // Import path module

mongoose.connect('mongodb://localhost/ManagemenBuku')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/books', books);

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 4000;
app.listen(port,() => console.log(`Listening on port ${port}...`));