const Joi = require('joi');
const mongoose = require('mongoose');

const Book = mongoose.model('Book', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    halaman: {
        type: Number,
        required: true
    },
    penulis: {
        type: String,
        required: true
    }
}));

function validateBook(book) {
    const schema = Joi.object({
      name: Joi.string().required(),
      halaman: Joi.number().integer().required(),
      penulis: Joi.string().required()
    });
  
    return Joi.validate(book, schema);
  }

module.exports.Book = Book;
module.exports.validate = validateBook;