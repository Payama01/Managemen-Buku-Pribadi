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
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.halaman}</td>
            <td>${book.penulis}</td>
            <td>
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Hapus</button>
            </td>
        `;
    });
}

// Fungsi untuk menambah buku
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookData = {
        name: document.getElementById('name').value,
        halaman: document.getElementById('halaman').value,
        penulis: document.getElementById('penulis').value,
    };

    if (editingBookId) {
        // Update buku
        await fetch(`/api/books/${editingBookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
        editingBookId = null; // Reset ID setelah edit
        submitButton.textContent = 'Tambah Buku'; // Kembali ke tombol tambah
    } else {
        // Create buku
        await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });
    }

    bookForm.reset(); // Reset form
    fetchBooks(); // Ambil data buku terbaru
});

// Fungsi untuk mengedit buku
function editBook(id) {
    const row = booksTable.rows[id - 1]; // Mengambil baris berdasarkan ID
    document.getElementById('name').value = row.cells[1].innerText;
    document.getElementById('halaman').value = row.cells[2].innerText;
    document.getElementById('penulis').value = row.cells[3].innerText;

    editingBookId = id; // Set ID buku yang sedang diedit
    submitButton.textContent = 'Ubah'; // Ubah tombol menjadi "Ubah"
}

// Fungsi untuk menghapus buku
async function deleteBook(id) {
    await fetch(`/api/books/${id}`, {
        method: 'DELETE',
    });
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
