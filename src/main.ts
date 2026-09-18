import { createServer } from 'http';
import { httpStatus, writeErrorPage } from './http.js';
import { isDevMode } from './state.js';
import { handleRequest } from './router.js';

const server = createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error('Error during request', err);
    writeErrorPage(res, httpStatus.internalServerError);
  }
});

server.listen(3000, () => {
  let msg = 'Server running at http://localhost:3000/';
  if (isDevMode) {
    msg += ' (dev mode)';
  }
  console.log(msg);
});
