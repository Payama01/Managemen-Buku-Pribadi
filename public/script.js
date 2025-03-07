const books = [
    { id: 1, name: 'Ibu Kita Kartini', halaman: 100, penulis: 'Yusuf' },
    { id: 2, name: 'Seporsi Mie Ayam Terakhir', halaman: 230, penulis: 'Sartika' },
    { id: 3, name: 'Perjuangan Negara', halaman: 68, penulis: 'Handoyo' },
];
let currentId = 1;

document.getElementById('bookForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
});

function addBook() {
    const name = document.getElementById('name').value;
    const halaman = document.getElementById('halaman').value;
    const penulis = document.getElementById('penulis').value;

    const book = {
        id: currentId++,
        name: name,
        halaman: halaman,
        penulis: penulis
    };

    books.push(book);
    displayBooks();
    document.getElementById('bookForm').reset();
}

function displayBooks() {
    const tableBody = document.querySelector('#booksTable tbody');
    tableBody.innerHTML = '';

    books.forEach(book => {
        const row = document.createElement('tr');
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
        tableBody.appendChild(row);
    });
}

function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    displayBooks();
}

function editBook(id) {
    const book = books.find(book => book.id === id);
    if (book) {
        document.getElementById('name').value = book.name;
        document.getElementById('halaman').value = book.halaman;
        document.getElementById('penulis').value = book.penulis;
        deleteBook(id);
    }
}

function searchBooks() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.name.toLowerCase().includes(searchTerm) || 
        book.penulis.toLowerCase().includes(searchTerm)
    );

    const tableBody = document.querySelector('#booksTable tbody');
    tableBody.innerHTML = '';

    filteredBooks.forEach(book => {
        const row = document.createElement('tr');
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
        tableBody.appendChild(row);
    });
}
