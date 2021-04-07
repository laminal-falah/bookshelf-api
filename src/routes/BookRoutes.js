const { bookController } = require('../controllers');

const bookRoutes = [
  {
    method: 'GET',
    path: '/books',
    handler: bookController.getAllBooks,
  },
  {
    method: 'POST',
    path: '/books',
    handler: bookController.createBook,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: bookController.showBook,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: bookController.updateBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: bookController.destroyBook,
  },
];

module.exports = bookRoutes;
