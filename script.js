document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    handleInputBook();
  });

  const optionCompletedButton = document.getElementById("option-completed");
  optionCompletedButton.addEventListener("click", function () {
    moveToShelfComplete("completeBookshelfList");
  });

  const optionUncompletedButton = document.getElementById("option-uncompleted");
  optionUncompletedButton.addEventListener("click", function () {
    moveToShelfUncomplete("uncompleteBookshelfList");
  });

  loadBooks();
});

function handleInputBook() {
  const judul = document.getElementById("inputBookTitle").value;
  const penulis = document.getElementById("inputBookAuthor").value;
  const rilis = document.getElementById("inputBookRelease").value;

  if (judul === "") {
    alert("Silahkan masukkan judul buku!");
    return;
  }
  if (penulis === "") {
    alert("Silahkan masukkan penulis buku!");
    return;
  }
  if (rilis === "") {
    alert("Silahkan masukkan rilis buku!");
    return;
  }

  showOptionSection(judul, penulis, rilis, false);
}

function showOptionSection(judul, penulis, rilis) {
  const optionSection = document.querySelector(".optionSection");
  const judulElement = optionSection.querySelector(".judul");
  const penulisElement = optionSection.querySelector(".penulis");
  const rilisElement = optionSection.querySelector(".rilis");

  judulElement.textContent = "Judul: " + judul;
  penulisElement.textContent = "Penulis: " + penulis;
  rilisElement.textContent = "Rilis: " + rilis;

  optionSection.classList.add("visible");
}

function moveToShelfComplete(judul, penulis, rilis, targetShelf) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("bookSection");
  const articleElement = document.createElement("article");
  articleElement.innerHTML = `<h1>Judul: ${judul}</h1><h3>Penulis: ${penulis}</h3><p>Rilis: ${rilis}</p> <button onclick="handleEditBook()">Belum selesai dibaca</button>
    <button onclick="handleDeleteBook()">Hapus</button>`;
  bookElement.appendChild(articleElement);
  const targetShelfElement = document.getElementById(targetShelf);
  targetShelfElement.appendChild(bookElement);
  saveBookToLocalStorage(judul, penulis, rilis);

  const optionSection = document.querySelector(".optionSection");
  optionSection.classList.remove("visible");
}

function moveToShelfUncomplete(judul, penulis, rilis, targetShelf) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("bookSection");
  const articleElement = document.createElement("article");
  articleElement.innerHTML = `<h1>Judul: ${judul}</h1><h3>Penulis: ${penulis}</h3><p>Rilis: ${rilis}</p><button onclick="handleDeleteBook()">Hapus</button>`;
  bookElement.appendChild(articleElement);

  const targetShelfElement = document.getElementById(targetShelf);
  targetShelfElement.appendChild(bookElement);
  saveBookToLocalStorage(judul, penulis, rilis);

  const optionSection = document.querySelector(".optionSection");
  optionSection.classList.remove("visible");
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
    if (book.status === "completed") {
      moveToShelfComplete(book.judul, book.penulis, book.rilis, "books");
    } else {
      moveToShelfUncomplete(book.judul, book.penulis, book.rilis, "books");
    }
  });
}
