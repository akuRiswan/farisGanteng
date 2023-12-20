document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    handleInputBook();
    const searchButton = document.getElementById("searchBookButton");
    searchButton.addEventListener("click", handleSearch);
    loadBooks();
  });

  const optionCompletedButton = document.getElementById("option-completed");
  optionCompletedButton.addEventListener("click", function () {
    const judul = document.getElementById("inputBookTitle").value;
    const penulis = document.getElementById("inputBookAuthor").value;
    const rilis = document.getElementById("inputBookRelease").value;

    moveToShelfComplete(judul, penulis, rilis, "completeBookshelfList");
  });

  const optionUncompletedButton = document.getElementById("option-uncompleted");
  optionUncompletedButton.addEventListener("click", function () {
    const judul = document.getElementById("inputBookTitle").value;
    const penulis = document.getElementById("inputBookAuthor").value;
    const rilis = document.getElementById("inputBookRelease").value;

    moveToShelfUncomplete(judul, penulis, rilis, "uncompleteBookshelfList");
  });

  loadBooks();
});

function handleInputBook() {
  const judul = document.getElementById("inputBookTitle").value;
  const penulis = document.getElementById("inputBookAuthor").value;
  const rilis = document.getElementById("inputBookRelease").value;

  if (judul === "" || penulis === "" || rilis === "") {
    alert("Silahkan lengkapi semua kolom!");
    return;
  }

  showOptionSection(judul, penulis, rilis);
}

function showOptionSection(judul, penulis, rilis) {
  const optionSection = document.querySelector(".optionSection");
  const judulElement = optionSection.querySelector(".judul");
  const penulisElement = optionSection.querySelector(".penulis");
  const rilisElement = optionSection.querySelector(".rilis");

  judulElement.textContent = `Judul: ${judul}`;
  penulisElement.textContent = `Penulis: ${penulis}`;
  rilisElement.textContent = `Rilis: ${rilis}`;

  optionSection.classList.add("visible");
}

function moveToShelfComplete(judul, penulis, rilis, targetShelf) {
  const bookElement = createBookElement(judul, penulis, rilis, "completed");
  const targetShelfElement = document.getElementById(targetShelf);
  targetShelfElement.appendChild(bookElement);
  saveBookToLocalStorage(judul, penulis, rilis, "completed");

  const optionSection = document.querySelector(".optionSection");
  optionSection.classList.remove("visible");
}

function moveToShelfUncomplete(judul, penulis, rilis, targetShelf) {
  const bookElement = createBookElement(judul, penulis, rilis, "uncompleted");
  const targetShelfElement = document.getElementById(targetShelf);
  targetShelfElement.appendChild(bookElement);
  saveBookToLocalStorage(judul, penulis, rilis, "uncompleted");

  const optionSection = document.querySelector(".optionSection");
  optionSection.classList.remove("visible");
}

function createBookElement(judul, penulis, rilis, status) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("bookSection");
  const articleElement = document.createElement("article");

  let buttonsHtml = `<button onclick="handleDeleteBook(this)">Hapus</button>`;
  buttonsHtml +=
    status === "uncompleted"
      ? `<button onclick="handleEditBook(this)">Selesai dibaca</button>`
      : `<button onclick="handleEditBook(this)">Belum selesai dibaca</button>`;

  articleElement.innerHTML = `<h1>Judul: ${judul}</h1><h3>Penulis: ${penulis}</h3><p>Rilis: ${rilis}</p> ${buttonsHtml}`;
  bookElement.appendChild(articleElement);

  return bookElement;
}

function saveBookToLocalStorage(judul, penulis, rilis, status) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  const timestamp = +new Date();
  const bookId = `book_${timestamp}`;

  books.push({ id: bookId, judul, penulis, rilis, status });
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooks() {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  books.forEach((book) => {
    const targetShelf =
      book.status === "completed" ? "completeBookshelfList" : "uncompleteBookshelfList";
    const bookElement = createBookElement(book.judul, book.penulis, book.rilis, book.status);
    bookElement.id = book.id;

    const targetShelfElement = document.getElementById(targetShelf);
    targetShelfElement.appendChild(bookElement);
  });
}

function handleDeleteBook(button) {
  const bookElement = button.closest(".bookSection");
  const bookId = bookElement.id;
  const targetShelf = bookElement.parentElement.id;

  bookElement.remove();
  deleteBookFromLocalStorage(bookId);
}

function handleEditBook(button) {
  const bookElement = button.closest(".bookSection");
  const bookId = bookElement.id;
  const targetShelf = bookElement.parentElement.id;

  if (targetShelf === "completeBookshelfList") {
    moveToShelfUncompleteFromComplete(bookElement);
  } else {
    moveBookToCompleteShelf(bookElement);
  }
}

function moveToShelfUncompleteFromComplete(bookElement) {
  const targetShelf = "uncompleteBookshelfList";
  const targetShelfElement = document.getElementById(targetShelf);

  const buttonsHtml = `<button onclick="handleDeleteBook(this)">Hapus</button><button onclick="handleEditBook(this)">Selesai dibaca</button>`;

  const articleElement = bookElement.querySelector("article");
  articleElement.innerHTML = `<h1>${articleElement.querySelector("h1").innerText}</h1>
    <h3>${articleElement.querySelector("h3").innerText}</h3>
    <p>${articleElement.querySelector("p").innerText}</p> ${buttonsHtml}`;

  targetShelfElement.appendChild(bookElement);

  updateBookStatusInLocalStorage(bookElement.id, "uncompleted");
}

function moveBookToCompleteShelf(bookElement) {
  const targetShelf = "completeBookshelfList";
  const targetShelfElement = document.getElementById(targetShelf);

  const buttonsHtml = `<button onclick="handleDeleteBook(this)">Hapus</button><button onclick="handleEditBook(this)">Belum selesai dibaca</button>`;

  const articleElement = bookElement.querySelector("article");
  articleElement.innerHTML = `<h1>${articleElement.querySelector("h1").innerText}</h1>
    <h3>${articleElement.querySelector("h3").innerText}</h3>
    <p>${articleElement.querySelector("p").innerText}</p> ${buttonsHtml}`;

  targetShelfElement.appendChild(bookElement);

  updateBookStatusInLocalStorage(bookElement.id, "completed");
}

function deleteBookFromLocalStorage(bookId) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter((book) => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(books));
}

function updateBookStatusInLocalStorage(bookId, status) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index].status = status;
    localStorage.setItem("books", JSON.stringify(books));
  }
}

function handleSearch() {
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const books = JSON.parse(localStorage.getItem("books")) || [];

  const filteredBooks = books.filter((book) => {
    const lowercasedTitle = book.judul.toLowerCase();
    const lowercasedAuthor = book.penulis.toLowerCase();

    return lowercasedTitle.includes(searchInput) || lowercasedAuthor.includes(searchInput);
  });

  displayFilteredBooks(filteredBooks);
}

function displayFilteredBooks(books) {
  const hasilSearchElement = document.querySelector(".hasilSearch");
  hasilSearchElement.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book.judul, book.penulis, book.rilis, book.status);
    bookElement.id = book.id;

    hasilSearchElement.appendChild(bookElement);
  });
}
