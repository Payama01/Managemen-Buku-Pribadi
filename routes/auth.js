const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Contoh autentikasi sederhana
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username };
    res.redirect('/');  //arahkan ke halaman utama
  } else {
    res.render('login', { error: 'Username atau password salah' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

router.get('/signup', (req, res) => {
    res.render('sign'); //sign.ejs
});

// POST sign up form
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Di sini kamu bisa simpan ke database, untuk sekarang contoh sederhana
    console.log("User terdaftar:", username, password);

    // Setelah daftar, langsung login atau arahkan ke login page
    res.redirect('/auth/login');
});

module.exports = router;
