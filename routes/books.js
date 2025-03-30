const {Book, validate} = require('../models/book');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Buat ambil semua buku
//router.get('/api/books', (req, res) => {
//  res.send(books);
//});

// Buat ambil semua buku tapi async
router.get('/', async (req,res) => {
  try{
    const data = await Book.find().sort('name');
    res.send(data);
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
      penulis: req.body.penulis
    });
    book = await book.save();
    res.send(book);
  } catch (error){
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
        penulis: req.body.penulis }, {
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

function takeData() { // untuk router.get async
  return new Promise((resolve,reject) => {
    setTimeout(()=> {
      if (books != null){
        resolve(books);
      } else {
        reject("Data gagal diambil");
      }
    },1000);
  });
}

function takeSingleData(id) {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      const book = books.find(b => b.id === parseInt(id));
      if (book != null || undefined) {
        resolve(book);
      } else {
        reject("Data gagal diambil");
      }
    },1000);
  })
}

function savingBook(book) { //untuk router.post async
  return new Promise((resolve) => {
    setTimeout(() => {
      books.push(book);
      resolve(book);
    }, 1000);
  });
}

//Buat edit buku
function updateBook(id,reqBody) {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      const book = books.find(b => b.id === parseInt(id));
      if (!book) return reject("Buku yang dicari tidak ada!");

      const { error } = verificationBook(reqBody);
      if (error) reject(res.status(400).send(error.details[0].message));

      book.name = reqBody.name;
      book.halaman = reqBody.halaman;
      book.penulis = reqBody.penulis;
      resolve(book);
      
    })
  })
}

function deleteBook(id) {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      const book = books.find(b => b.id === parseInt(id));
      if (!book) return reject("Buku yang dicari tidak ada!");

      const index = books.indexOf(book);
      books.splice(index,1);

      resolve(book);
    },1000);
  })
}

module.exports = router;