const Book = require('../models/book');
const {validate} = require('../models/book');
const mongoose = require('mongoose');
const ejs = require('ejs');
const express = require('express');
const router = express.Router();

// Buat ambil semua buku
//router.get('/api/books', (req, res) => {
//  res.send(books);
//});

// Buat ambil semua buku tapi async
router.get('/', async (req,res) => {
  try{
    const books = await Book.find().sort('name');
    res.json(books);
  } catch(error){
      res.status(404).send('Buku yang dicari tidak ada!');
  }
});

// Buat ambil 1 spesific buku dengan cara mencari id
router.get('/:id', async (req,res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.send(book);
  }
  catch(error) {
    res.status(404).send('Buku yang dicari tidak ada!');
  }
  
  
});

//Buat Nambah buku
router.post('/', async (req,res) => {
  console.log("Data yang diterima dari frontend:", req.body);
  try{
    const { error } = validate(req.body);
    if (error){
      console.error("Validasi gagal:", error.details[0].message); // Debugging
      return res.status(400).send(error.details[0].message);
    }

    let book = new Book({ 
      name: req.body.name,
      halaman: req.body.halaman, 
      penulis: req.body.penulis,
      lokasi: req.body.lokasi
    });
    book = await book.save();
    res.send(book);
  } catch (error){
    console.error("Error saat menyimpan buku:", error);
    res.status(500).send(error.message);
  }
});

// Buat Update buku
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const book = await Book.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        halaman: req.body.halaman,
        penulis: req.body.penulis,
        lokasi: req.body.lokasi }, {
        new: true
    });

    if (!book) return res.status(404).send('The genre with the given ID was not found.');

    res.send(book);
});


//Buat Hapus buku
router.delete('/:id', async (req,res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if(!book) return res.status(404).send('Buku yang ingin dihapus tidak ada!');

    res.send(book);
  });

module.exports = router;