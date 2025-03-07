const bookForm = document.getElementById('bookForm');
const booksTable = document.getElementById('booksTable').getElementsByTagName('tbody')[0];

let books = []; // Array untuk menyimpan data buku

// Fungsi untuk menampilkan buku di tabel
function displayBooks() {
    // Kosongkan tabel sebelum menampilkan data
    booksTable.innerHTML = '';

    books.forEach((book, index) => {
        const row = booksTable.insertRow();
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.halaman}</td>
            <td>${book.penulis}</td>
            <td>
                <button onclick="editBook(${index})">Edit</button>
                <button onclick="deleteBook(${index})">Hapus</button>
            </td>
        `;
    });
}

// Fungsi untuk menambah buku
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newBook = {
        id: books.length + 1,
        name: document.getElementById('name').value,
        halaman: document.getElementById('halaman').value,
        penulis: document.getElementById('penulis').value,
    };

    books.push(newBook);
    displayBooks();

    // Reset form
    bookForm.reset();
});

// Fungsi untuk mengedit buku
function editBook(index) {
    const book = books[index];
    document.getElementById('name').value = book.name;
    document.getElementById('halaman').value = book.halaman;
    document.getElementById('penulis').value = book.penulis;

    // Hapus buku dari array
    books.splice(index, 1);
    displayBooks();
}

// Fungsi untuk menghapus buku
function deleteBook(index) {
    books.splice(index, 1);
    displayBooks();
}

// Tampilkan buku awal (jika ada)
displayBooks();
