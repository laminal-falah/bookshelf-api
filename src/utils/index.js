const successWithoutMessage = (h, code, data) => {
  const response = h.response({
    status: 'success',
    data,
  });
  response.code(code);
  return response;
};

const successWithMessage = (h, code, message, data = null) => {
  let response;
  if (data === null) {
    response = h.response({
      status: 'success',
      message,
    });
  } else {
    response = h.response({
      status: 'success',
      message,
      data,
    });
  }
  response.code(code);
  return response;
};

const failed = (h, code, message) => {
  const response = h.response({
    status: code >= 400 && code < 500 ? 'fail' : 'error',
    message,
  });
  response.code(code);
  return response;
};

const getDate = () => new Date().toISOString();

const validation = (data, type) => {
  const message = `Gagal ${type === 'create' ? 'menambahkan' : 'memperbarui'} buku.`;
  if (data.name === null || data.name === undefined) {
    return { status: false, message: `${message} Mohon isi nama buku` };
  }
  if (data.readPage > data.pageCount) {
    return { status: false, message: `${message} readPage tidak boleh lebih besar dari pageCount` };
  }

  return { status: true, message: 'Valid' };
};

const filter = (key, value, data = []) => {
  if (value != null && typeof (parseInt(value)) === 'number') {
    return data.filter(v => (parseInt(value) === 1 ? v[key] === true : v[key] === false));
  }
  return data;
};

module.exports = {
  successWithoutMessage,
  successWithMessage,
  failed,
  getDate,
  validation,
  filter,
};
