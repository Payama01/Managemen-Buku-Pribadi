const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user'); // pastikan path-nya sesuai struktur kamu
const { validate } = require('../models/user');

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

// GET signup page
router.get('/sign', (req, res) => {
  res.render('sign'); // sign.ejs
});

// GET User page
router.get('/user', async (req, res) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id);
    res.render('user/page',{ user }); //user.page
  } else {
    res.redirect('/auth/login');
  }
  // res.render('user/page'); 
});

// GET login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.render('login', { error: 'Username tidak ditemukan' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render('login', { error: 'Password salah' });
    }

    req.session.user = { _id: user._id, username: user.username };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Terjadi kesalahan saat login' });
  }
});

router.post('/signup', async (req, res) => {
  console.log("User mau daftar:");
  const { email, username, password } = req.body;
  console.log(email)
  console.log(username)
  console.log(password)

  // VALIDASI
  const { error } = validate({ email, username, password });
  if (error) return console.log('validate gagal');//res.render('sign', { error: error.details[0].message });
  console.log("User validasi:");

  // CEK USER SUDAH ADA
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('sign', { error: 'Username sudah terdaftar' });
  }
  console.log("cek user sudah ada:");

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hash password:");

  // SIMPAN USER
  const newUser = new User({ email, username, password: hashedPassword });
  await newUser.save();

  console.log("User berhasil daftar:", username);

  // REDIRECT KE LOGIN
  res.redirect('/auth/login?signupSuccess=true');
});

// PUT USER
router.put('/user/:id', async (req, res) => {
  console.log('Route PUT /auth/user/:id dipanggil dengan ID:', req.params.id);
  try {
    const { email, username, password } = req.body;
    const userId = req.params.id; // Ambil ID user dari session

    // VALIDASI
    const { error } = validate({ email, username, password });
    if (error) return res.render('user/page', { error: error.details[0].message });

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // CEK APAKAH EMAIL UNIQUE
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      return res.status(400).send('Email sudah digunakan oleh user lain');
  }

    // UPDATE USER
    const userUpdated = await User.findByIdAndUpdate(userId, { email, username, password: hashedPassword },
      {new: true}); //memastikan data yang dikembalikan adalah data yang sudah diperbarui.
    
    if (!userUpdated) {
      return res.status(404).send('User tidak ditemukan');
    }
    
    console.log("User berhasil update:", userUpdated);

    // REDIRECT KE USER PAGE
    res.redirect('/auth/user');
  } catch (error) {
    console.error("Error saat memperbarui user:", error);
    res.status(500).send('Terjadi kesalahan saat memperbarui user');
  }
});

//DELETE USER
router.delete('/user/delete',ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user._id; // Ambil ID user dari session
    console.log("User mau dihapus:", userId);
    // HAPUS USER
    await User.findByIdAndDelete(userId);
    console.log("User berhasil dihapus:", userId);
    
    // REDIRECT KE LOGIN
    req.session.destroy(); // Hapus session user
    // Kirim respons JSON ke frontend
    res.status(200).json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    res.status(500).json({ error: 'Gagal menghapus user' });
  }
});

function ensureAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'User tidak terautentikasi' });
  }
  next();
}


module.exports = router;
