/* eslint new-cap: [2, {"capIsNewExceptions": ["Q"]}] */
var Q = require('q');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;

module.exports.process = processAction;

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */
function process(msg, conf, next) {
  function emitData() {
    var body = '{}';
    var message = messages.newMessageWithBody(body);

    console.log(message);

    this.emit('data', message);
  }

  function emitError(error) {
    console.log('An error occurred');

    this.emit('error', error);
  }

  function emitEnd() {
    console.log('Finished execution');

    this.emit('end');
  }

  Q()
    .then(emitData.bind(this))
    .fail(emitError.bind(this))
    .done(emitEnd.bind(this));
}

exports.process = process;
