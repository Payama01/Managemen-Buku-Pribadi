const Joi = require('joi');
const express = require('express');
const app = express();
const path = require('path'); // Import path module

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const books = [
  {id: 1, name: 'To Kill a Mockingbird', halaman: 281, penulis: 'Harper Lee' },
  {id: 2, name: 'Seporsi Mie Ayam Sebelum Mati', halaman: 216, penulis: 'Brian Khrisna'},
  {id: 3, name: 'The Great Gatsby', halaman: 180, penulis: 'F. Scott Fitzgerald'},
];

app.get('/',(req,res) => {
  res.send('Hello World!!!');
});

// Buat ambil semua buku
app.get('/api/books', (req, res) => {
  res.send(books);
});

// Buat ambil semua buku tapi async
app.get('/api/books', async (req,res) => {
  try{
    const data = await takeData();
    res.send(data);
  } catch(error){
      res.status(404).send('Buku yang dicari tidak ada!');
  }
});

// Buat ambil 1 spesific buku dengan cara mencari id
app.get('/api/books/:id', async (req,res) => {
  try {
    const book = await takeSingleData(req.params.id);
    res.send(book);
  }
  catch(error) {
    res.status(404).send('Buku yang dicari tidak ada!');
  }
  
  
});

//Buat Nambah buku
app.post('/api/books', async (req,res) => {
  try{
    const { error } = verificationBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const book = {
      id: books.length + 1,
      name: req.body.name,
      halaman: req.body.halaman,
      penulis: req.body.penulis
    };

    const savedBooks = await savingBook(book);
    res.send(savedBooks);
  } catch (error){
    res.status(500).send(error.message);
  }
});

// Buat Update buku
app.put('/api/books/:id', async (req, res) => {
    const bookId = parseInt(req.params.id);
    const { name, halaman, penulis } = req.body;

    const book = books.find(b => b.id === bookId);
    if (!book) return res.status(404).send('Buku yang diupdate tidak ada!');

    book.name = name;
    book.halaman = halaman;
    book.penulis = penulis;

    res.send(book);
});


//Buat Hapus buku
app.delete('/api/books/:id', async (req,res) => {
  try {
    const bookId = req.params.id;
    books = books.filter(b => b.id !== parseInt(bookId));
    res.status(204).send();
  } catch(error) {
    res.status(404).send('Buku yang ingin dihapus tidak ada!');
  }
})

function takeData() { // untuk app.get async
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

function savingBook(book) { //untuk app.post async
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

function verificationBook(book) {
  const schema = Joi.object({
    name: Joi.string().required(),
    halaman: Joi.number().integer().required(),
    penulis: Joi.string().required()
  });

  return schema.validate(book);
}

const port = process.env.PORT || 4000;
app.listen(port,() => console.log(`Listening on port ${port}...`));