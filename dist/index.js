'use strict';

var selfSocket = require('socket.io');
var db = require('./notifications/db');
var Configuration = require('./notifications/config');
var notificationController = require('./notifications/controller');

function Notification(config) {
  this.config = new Configuration(config);
  this.configDatabase = this.config.database;
  this.socketPort = this.config.socketPort;
}

function newSocketIO(port) {
  var defaultPort = port || 8085;
  return selfSocket.listen(defaultPort);
}

Notification.prototype.startServer = function (socketIO) {
  var self = undefined;

  self.io = socketIO || newSocketIO(self.socketPort);

  db.connect(self.configDatabase);

  self.io.on('connection', function (socket) {
    socket.emit('who-are-you');

    socket.on('check-in', function (user) {
      self.io.sockets[user.id] = socket;
      self.sendUnread(user.id);
    });

    socket.on('check-news', function (user) {
      self.sendUnsent(user.id);
    });
  });
};

Notification.prototype.send = function (event, notification) {
  var user = notification.to;
  undefined.io.sockets[user].emit(event, notification, function (ack) {
    if (ack) {
      notificationController.update(notification._id, { sent: true }, //eslint-disable-line
      function (err) {
        if (err) throw err;
      });
    }
  });
};

Notification.prototype.sendUnread = function (userId) {
  var self = undefined;
  if (userId) {
    notificationController.getUnread(userId, function (err, data) {
      if (err) throw err;
      data.forEach(function (notification) {
        self.send('unread', notification);
      });
    });
  }
};

Notification.prototype.sendUnsent = function (userId) {
  var self = undefined;
  if (userId) {
    notificationController.getUnsent(userId, function (err, data) {
      if (err) throw err;
      data.forEach(function (notification) {
        self.send('news', notification);
      });
    });
  }
};

Notification.prototype.create = function (type, to, title, msg) {
  var data = { to: to, type: type, title: title, msg: msg };
  notificationController.create(data, function (err) {
    if (err) throw err;
  });
};

Notification.prototype.getAll = notificationController.getAll;

Notification.prototype.updateUnread = notificationController.updateUnread;

Notification.prototype.delete = notificationController.delete;

Notification.prototype.updateAllUnread = notificationController.updateAllUnread;

module.exports = Notification;