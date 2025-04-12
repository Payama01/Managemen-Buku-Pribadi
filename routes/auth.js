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

module.exports = router;
