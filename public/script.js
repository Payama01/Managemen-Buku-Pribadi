document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const bookForm = document.getElementById('book-form');

    // Ambil semua buku
    async function fetchBooks() {
        const response = await fetch('/api/books');
        const books = await response.json();
        const bookList = document.getElementById('book-list');

        books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = `${book.name} - ${book.halaman} halaman - Penulis: ${book.penulis}`;
            bookList.appendChild(li);
        });
    }

    // Tambah buku
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const halaman = document.getElementById('halaman').value;
        const penulis = document.getElementById('penulis').value;

        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, halaman, penulis }),
        });

        if (response.ok) {
            const newBook = await response.json();
            const li = document.createElement('li');
            li.textContent = `${newBook.name} - ${newBook.halaman} halaman - Penulis: ${newBook.penulis}`;
            bookList.appendChild(li);
            bookForm.reset();
        } else {
            alert('Gagal menambah buku');
        }
    });

    fetchBooks();
    
});
