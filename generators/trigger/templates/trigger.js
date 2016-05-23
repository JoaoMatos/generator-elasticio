var util = require('util');
var messages = require('elasticio-node').messages;
var debug = require('debug');
var request = require('request');

function process(msg, cfg) {
  var url = cfg.url;
  this.body = '';

  request.get(url).on('response', handleResponse.bind(this));
};

function handleResponse(response) {
  debug('Have got response status=%s headers=%j', response.statusCode, response.headers);

  response.on('data', createBody.bind(this));
  response.on('end', handleEnd.bind(this));

  if (response.statusCode != 200) {
    throw Error('Unexpected response code code=' + response.statusCode);
  }
};

function createBody(chunk) {
  this.body += chunk;
}

function handleEnd() {
  var message = messages.newMessageWithBody(JSON.parse(this.body));

  this.emit('data', message);
  this.emit('end');
};

exports.process = process;
