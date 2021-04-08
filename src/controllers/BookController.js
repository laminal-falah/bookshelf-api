const { nanoid } = require('nanoid');
const books = require('../models/Book');
const {
  successWithoutMessage,
  successWithMessage,
  failed,
  getDate,
  validation,
  filter,
} = require('../utils');

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let booksResponse = books;

  if (name != null) {
    booksResponse = booksResponse.filter(v => v.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading != null) {
    booksResponse = filter('reading', reading, booksResponse);
  }

  if (finished != null) {
    booksResponse = filter('finished', finished, booksResponse);
  }

  booksResponse = booksResponse.map(data => ({
    id: data.id,
    name: data.name,
    publisher: data.publisher,
  }));

  return successWithoutMessage(h, 200, { books: booksResponse });
};

const createBook = (request, h) => {
  const id = nanoid(16);
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = pageCount === readPage;
  const insertedAt = getDate();
  const updatedAt = insertedAt;

  const valid = validation({ name, readPage, pageCount }, 'create');

  if (!valid.status) {
    return failed(h, 400, valid.message);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter(v => v.id === id).length > 0;

  if (isSuccess) {
    return successWithMessage(h, 201, 'Buku berhasil ditambahkan', { bookId: id });
  }

  return failed(h, 500, 'Buku gagal ditambahkan');
};

const showBook = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter(v => v.id === bookId)[0];

  if (book !== undefined) {
    return successWithoutMessage(h, 200, { book });
  }

  return failed(h, 404, 'Buku tidak ditemukan');
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = pageCount === readPage;
  const index = books.findIndex(v => v.id === bookId);

  const valid = validation({ name, readPage, pageCount }, 'update');

  if (!valid.status) {
    return failed(h, 400, valid.message);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      getDate,
    };

    return successWithMessage(h, 200, 'Buku berhasil diperbarui', {
      id: books[index].id,
      name: books[index].name,
      publisher: books[index].publisher,
    });
  }

  return failed(h, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
};

const destroyBook = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex(v => v.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return successWithMessage(h, 200, 'Buku berhasil dihapus');
  }

  return failed(h, 404, 'Buku gagal dihapus. Id tidak ditemukan');
};

module.exports = {
  getAllBooks,
  createBook,
  showBook,
  updateBook,
  destroyBook,
};
