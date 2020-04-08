/** @type {import('./App').default} */
let app_ = null;

export function setApp(app) {
  app_ = app;
}

/**
 * @param {String} event
 * @param {Object} arg1
 * @return {Promise<Object>}
 */
export function rpc(event, arg1) {
  return new Promise((resolve, reject) => {
    app_.socket.emit(event, arg1, (res) => {
      if (res.success === true) return resolve(res.data);
      app_.error(res.data);
      if (typeof reject === 'function') reject(res.data);
    });
  });
}
