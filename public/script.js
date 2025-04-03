const bookForm = document.getElementById('bookForm');
const booksTable = document.getElementById('booksTable').getElementsByTagName('tbody')[0];
const submitButton = document.getElementById('submitButton');
const searchInput = document.getElementById('searchInput');

let editingBookId = null;

// Fungsi untuk mengambil semua buku
async function fetchBooks() {
    const response = await fetch('/api/books');
    const books = await response.json();
    displayBooks(books);
}

// Fungsi untuk menampilkan buku di tabel
function displayBooks(books) {
    booksTable.innerHTML = ''; // Kosongkan tabel sebelum menampilkan data baru
    books.forEach(book => {
        const row = booksTable.insertRow();
        row.innerHTML = `
            <td>${book._id}</td>
            <td>${book.name}</td>
            <td>${book.halaman}</td>
            <td>${book.penulis}</td>
            <td>${book.lokasi}</td>
            <td>
                ${
                book.filepath
                    ? `<a href="${book.filepath.replace(/\\/g, '/')}" target="_blank" rel="noopener noreferrer">Baca PDF</a>`
                    : 'Tidak ada'
                }
            </td>
            <td>
                <button onclick="editBook('${book._id}')">Edit</button>
                <button onclick="deleteBook('${book._id}')">Hapus</button>
            </td>
        `;

    });
}

// Fungsi untuk menambah buku
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ebookinput = document.getElementById('ebook');
    const formData = new FormData();

    // Tambahkan data buku ke FormData
    formData.append('name', document.getElementById('name').value);
    formData.append('halaman', document.getElementById('halaman').value);
    formData.append('penulis', document.getElementById('penulis').value);
    formData.append('lokasi', document.getElementById('lokasi').value);

    if (ebookinput.files.length > 0) {
        formData.append('ebook', ebookinput.files[0]);
      }
    
      if (editingBookId) {
        // Update buku
        const response = await fetch(`/api/books/${editingBookId}`, {
          method: 'PUT',
          body: formData,
        });
    
        if (!response.ok) {
          console.error("Gagal memperbarui buku");
          return;
        }
    
        editingBookId = null; // Reset ID setelah edit
        submitButton.textContent = 'Tambah Buku'; // Kembali ke tombol tambah
      } else {
        // Tambah buku baru
        const response = await fetch('/api/books', {
          method: 'POST',
          body: formData,
        });
    
        if (!response.ok) {
          console.error("Gagal menambahkan buku");
          return;
        }
      }

    bookForm.reset(); // Reset form
    fetchBooks(); // Ambil data buku terbaru
});

// Fungsi untuk mengedit buku
async function editBook(id) {
    //const row = booksTable.rows[id - 1]; // Mengambil baris berdasarkan ID
    const response = await fetch(`/api/books/${id}`);
    if(!response.ok){
        console.error("Gagal mengambil data buku");
        return;
    }

    const book = await response.json();

    document.getElementById('name').value = book.name;
    document.getElementById('halaman').value = book.halaman;
    document.getElementById('penulis').value = book.penulis;
    document.getElementById('lokasi').value = book.lokasi;
    //document.getElementById('ebook').value = book.lokasi;

    editingBookId = id; // Set ID buku yang sedang diedit
    submitButton.textContent = 'Ubah'; // Ubah tombol menjadi "Ubah"
}

// Fungsi untuk menghapus buku
async function deleteBook(id) {
    const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        console.error("Gagal menghapus buku");
        return;
    }

    fetchBooks(); // Ambil data buku terbaru
}

// Fungsi untuk mencari buku
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = booksTable.getElementsByTagName('tr');
    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        const bookName = cells[1].innerText.toLowerCase();
        const authorName = cells[3].innerText.toLowerCase();

        if (bookName.includes(searchTerm) || authorName.includes(searchTerm)) {
            row.style.display = ''; // Tampilkan baris
        } else {
            row.style.display = 'none'; // Sembunyikan baris
        }
    }
});

// Ambil buku saat halaman dimuat
fetchBooks();
