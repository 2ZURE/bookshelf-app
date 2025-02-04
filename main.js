document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  let books = JSON.parse(localStorage.getItem("books")) || [];

  function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function renderBooks(filteredBooks = books) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    filteredBooks.forEach(book => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function createBookElement({ id, title, author, year, isComplete }) {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", id);
    bookElement.classList.add("book-item");

    const bookTitle = document.createElement("h3");
    bookTitle.setAttribute('data-testid', 'bookItemTitle');

    const bookAuthor = document.createElement("p");
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');

    const bookYear = document.createElement("p");
    bookYear.setAttribute('data-testid', 'bookItemYear');

    const toggleButton = document.createElement("button");
    toggleButton.textContent = isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
    toggleButton.onclick = () => toggleBookStatus(id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.onclick = () => deleteBook(id);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit Buku";
    editButton.onclick = () => editBook(id);

    const actionContainer = document.createElement("div");
    actionContainer.append(toggleButton, deleteButton, editButton);

    bookElement.append(bookTitle, bookAuthor, bookYear, actionContainer);
    return bookElement;
  }

  function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    const id = Date.now();
    
    const newBook = { id, title, author, year, isComplete };
    books.push(newBook);
    saveBooks();
    renderBooks();
    bookForm.reset();
  }

  function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    saveBooks();
    renderBooks();
  }

  function toggleBookStatus(id) {
    books = books.map(book =>
      book.id === id ? { ...book, isComplete: !book.isComplete } : book
    );
    saveBooks();
    renderBooks();
  }

  function editBook(id) {
    const book = books.find(book => book.id === id);
    if (!book) return;

    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;
    
    deleteBook(id);
  }

  function searchBook(event) {
    event.preventDefault();
    const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
    renderBooks(filteredBooks);
  }

  bookForm.addEventListener("submit", addBook);
  searchForm.addEventListener("submit", searchBook);
  renderBooks();
});
