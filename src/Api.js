import io from 'socket.io-client';

const VERSION = 0;
const INTENT = 'web';

const debug = require('debug')('thmix:api');

export default class Api {
  constructor() {
    this.hasHandshakeSucceeded = false;
    this.errorHandler = null;

    if (process.env.NODE_ENV === 'development') {
      const loc = window.location;
      this.socket = io(loc.protocol + '//' + loc.hostname + ':6003');
    } else {
      this.socket = io();
    }

    this.createHandler = this.createHandler.bind(this);
    this.onHandshakeDone = this.createHandler(this.onHandshakeDone.bind(this));

    this.onDisconnect = this.onDisconnect.bind(this);
    this.socket.on('disconnect', this.onDisconnect);

    this.handshake();
  }

  createHandler(successHandler) {
    const self = this;
    return function(res) {
      if (res.success === true) {
        successHandler(res.data);
      } else {
        if (self.errorHandler !== null) self.error(res.data);
      }
    };
  }

  onDisconnect() {
    debug('onDisconnect');
  }

  handshake() {
    this.socket.emit('cl_handshake', {version: VERSION, intent: INTENT}, this.onHandshakeDone);
  }

  onHandshakeDone(res) {
    this.hasHandshakeSucceeded = true;
    debug('onHandshakeDone', res);
  }
}
