'use strict';

var NotificationModel = require('./model.js');

var self = undefined;

/**
 * Method for exposed endpoint. Get all notifications by User id.
 * GET <BASE API>/all/:userId
 * @pathParam {userid} Notification Id
 */
exports.getAll = function (userId, cb) {
  NotificationModel.find({ to: userId }, cb);
};

/**
 * Method for exposed endpoint. Update unread field to false
 * PUT <BASE API>/:notificationId
 * @pathParam {notificationId} Notification Id
 */
exports.updateUnread = function (notificationId, cb) {
  var id = notificationId;
  self.update(id, { unread: false }, cb);
};

/**
 * Method for exposed endpoint. Update all unread notifications.
 * PUT <BASE API>/all
 */
exports.updateAllUnread = function (userId, cb) {
  NotificationModel.update({ unread: true, to: userId }, { unread: false }, { multi: true }, cb);
};

/**
 * Method for exposed endpoint. Remove notificaton by id
 * DELETE <BASE API>/:notificationId
 * @pathParam {notificationId} Notification Id
 */
exports.delete = function (notificationId, cb) {
  var id = notificationId;
  NotificationModel.findByIdAndRemove(id, cb);
};

/**
 * Get unread notification by User id. All the notifications unread.
 * @param  {String}   userId User id
 * @param  {Function} cb     Callback
 */
exports.getUnread = function (userId, cb) {
  NotificationModel.find({ to: userId, unread: true }, cb);
};

/**
 * Get new notifications by User id. All the unsent notifications.
 * @param  {String}   userId User id
 * @param  {Function} cb     Callback
 */
exports.getUnsent = function (userId, cb) {
  NotificationModel.find({ to: userId, sent: false }, cb);
};

/**
 * Update notification by id
 * @param  {String}   id   Notification Id
 * @param  {Object}   data New values for notification
 * @param  {Function} cb   Callback
 */
exports.update = function (id, data, cb) {
  NotificationModel.findByIdAndUpdate(id, data, cb);
};

/**
 * Create ew notification
 * @param  {object}   data Object representation for notification. Check model schema.
 * @param  {Function} cb   Callback
 */
exports.create = function (data, cb) {
  var newNotification = new NotificationModel(data);
  newNotification.save(cb);
};