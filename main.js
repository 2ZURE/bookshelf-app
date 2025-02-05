document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const STORAGE_KEY = "BOOKSHELF_APPS";
  let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    const completeButton = bookItem.querySelector("[data-testid='bookItemIsCompleteButton']");
    completeButton.addEventListener("click", () => toggleBookStatus(book.id));

    const deleteButton = bookItem.querySelector("[data-testid='bookItemDeleteButton']");
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    const editButton = bookItem.querySelector("[data-testid='bookItemEditButton']");
    editButton.addEventListener("click", () => editBook(book.id));

    return bookItem;
  }

  function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    
    const book = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    books.push(book);
    saveToLocalStorage();
    renderBooks();
    bookForm.reset();
  }

  function deleteBook(bookId) {
    books = books.filter((book) => book.id !== bookId);
    saveToLocalStorage();
    renderBooks();
  }

  function editBook(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    books = books.filter((b) => b.id !== bookId);
    saveToLocalStorage();
    renderBooks();
  }

  function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveToLocalStorage();
      renderBooks();
    }
  }

  function searchBook(event) {
    event.preventDefault();
    const query = document.getElementById("searchBookTitle").value.toLowerCase();
    
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(query));
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    
    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  bookForm.addEventListener("submit", addBook);
  searchForm.addEventListener("submit", searchBook);
  renderBooks();
});
