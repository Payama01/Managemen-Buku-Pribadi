const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const books = [
  {id: 1, name: 'Ibu Kita Kartini', halaman: 100, penulis: 'Yusuf' },
  {id: 2, name: 'Seporsi Mie Ayam Terakhir', halaman: 230, penulis: 'Sartika'},
  {id: 3, name: 'Perjuangan Negara', halaman: 68, penulis: 'Handoyo'},
];

app.get('/',(req,res) => {
  res.send('Hello World!!!');
});

app.get('/api/books', async (req,res) => {
  try{
    const data = await takeData();
    res.send(data);
  } catch(error){
      res.status(404).send('Buku yang dicari tidak ada!');
  }
});

app.get('/api/books/:id', async (req,res) => {
  try {
    const book = await takeSingleData(req.params.id);
    res.send(book);
  }
  catch(error) {
    res.status(404).send('Buku yang dicari tidak ada!');
  }
  
  
});

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

app.put('/api/books/:id', async (req,res) => {
  try{
    const book = await updateBook(req.params.id,req.body);
    res.send(book);
  }
  catch(error) {
    res.status(404).send('Buku yang diupdate tidak ada!');
  }
  
});

app.delete('/api/books/:id', async (req,res) => {
  try{
    const book = await deleteBook(req.params.id);
    res.send(book);
  }
  catch(error) {
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
    },2000);
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
    },2000);
  })
}

function savingBook(book) { //untuk app.post async
  return new Promise((resolve) => {
    setTimeout(() => {
      books.push(book);
      resolve(books);
    }, 2000);
  });
}

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
    },3000);
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