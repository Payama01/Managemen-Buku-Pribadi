const Joi = require('joi');
const mongoose = require('mongoose');

const Author = mongoose.model('Author', new mongoose.Schema({
    penulis: {
      type: String,
      required: true
    },
}));

function validateAuthor(author) {
    const schema = Joi.object({
      lokasi: Joi.string().required(),
    });
  
    return schema.validate(author);
  }

module.exports = Author;
module.exports.validate = validateAuthor;
