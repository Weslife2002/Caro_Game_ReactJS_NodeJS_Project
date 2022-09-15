"use strict";

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var _index = _interopRequireDefault(require("src/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var port = process.env.PORT || 4001;
var app = (0, _express["default"])();
app.use(_index["default"]);

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server);
var interval;
io.on("connection", function (socket) {
  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(function () {
    return getApiAndEmit(socket);
  }, 1000);
  socket.on("disconnect", function () {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

var getApiAndEmit = function getApiAndEmit(socket) {
  var response = new Date(); // Emitting a new message. Will be consumed by the client

  socket.emit("FromAPI", response);
};

server.listen(port, function () {
  return console.log("Listening on port ".concat(port));
});