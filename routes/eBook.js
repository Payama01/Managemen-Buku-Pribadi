// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// const fileStorageEngine = multer.diskStorage({
//   destination: (req,file,cb) => {
//     cb(null,'./eBook');
//   },
//   filename: (req,file,cb) => {
//     cb(null,Date.now() + "--" + file.originalname);
//   },
// });

// // Endpoint khusus untuk mengunggah file
// router.post('/upload', upload.single('ebook'), (req, res) => {
//   if (!req.file) {
//       return res.status(400).send({ error: "File tidak ditemukan" });
//   }
//   res.send({ filepath: req.file.path }); // Kembalikan path file
// });

// module.exports = router