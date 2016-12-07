'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _knex = require('../db/knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PORT = 3000 || process.env.PORT;

// app.listen returns the underlying http server instance.
// Assign it to app.server so that it can be explicitly
// closed once testing is done.
_app2['default'].server = _app2['default'].listen(PORT, function () {
  console.log('Listening on port ' + String(PORT));
});

exports['default'] = _app2['default'];