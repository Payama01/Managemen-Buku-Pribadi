const express = require('express');
const Location = require('../models/location');
const {validate} = require('../models/book');
const router = express.Router();

// Buat ambil semua lokasi
router.get('/', async (req,res) => {
  try{
    const locations = await Location.find();
    console.log("Data buku yang dikirim:",locations);
    res.json(locations);
  } catch(error) {
    res.status(404).send('Lokasi tidak ada!');
  }
});

// Buat mengunggah lokasi
router.post('/', async (req,res) => {
  try{
    //Validasi request body
    const { error } = validate(req.body);
    if (error) {
      console.error("Validasi gagal:", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    // Buat Lokasi baru
    const location = new Location({
      lokasi: req.body.lokasi
    });

    //Save ke mongodb
    await location.save();

    //Mengirim hasil ke user
    res.status(201).send({
      message: "Lokasi berhasil disimpan",
      location: {
        lokasi: location.lokasi
      }
    });
  } catch { // memberi error ketika endpoint bermasalah
    console.error("Error saat menyimpan lokasi:", error);
    res.status(500).send('Terjadi kesalahan server! (POST buku');
  }
});

router.put('/:id', async (req,res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const updateData = {
      lokasi: req.body.lokasi
    };

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).send('Buku dengan ID tersebut tidak ditemukan');
    }

    res.send({
      message: 'Lokasi berhasil diperbarui',
      book: updatedBook
    });
  } catch (error) {
    console.error("Error saat mengupdate lokasi:", error);
    res.status(500).send('Terjadi kesalahan server saat mengupdate lokasi');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) return res.status(404).send('Lokasi tidak ditemukan!');
    res.send(location);
  } catch (error) {
    console.error("Error menghapus lokasi:", error);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

module.exports = router;