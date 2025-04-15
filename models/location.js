const Joi = require('joi');
const mongoose = require('mongoose');

const Location = mongoose.model('Location', new mongoose.Schema({
    lokasi: {
        type: String,
        required: true
    },
}));

function validateLocation(location) {
    const schema = Joi.object({
      lokasi: Joi.string().required(),
    });
  
    return schema.validate(location);
  }

module.exports = Location;
module.exports.validate = validateLocation;
