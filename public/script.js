const booksTable = document.getElementById('booksTable').getElementsByTagName('tbody')[0];
const bookForm = document.getElementById('bookForm');

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

    const newBook = await response.json();
    addBookToTable(newBook);
    bookForm.reset();
});

function addBookToTable(book) {
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
}

async function searchBooks() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const rows = booksTable.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        for (let j = 1; j < cells.length - 1; j++) { // Mulai dari 1 untuk melewati ID dan berhenti sebelum kolom aksi
            if (cells[j].innerText.toLowerCase().includes(query)) {
                found = true;
                break;
            }
        }

        rows[i].style.display = found ? '' : 'none';
    }
}
