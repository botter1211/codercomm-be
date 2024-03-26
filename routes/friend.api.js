const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const friendController = require("../controllers/friend.controller");

/**
 * @route POST /friends/request
 * @description Send a friend request
 * @access login required
 * @body {to: User ID}
 */
router.post(
  "/requests",
  authentication.loginRequired,
  validators.validate([
    body("to").exists().isString().custom(validators.checkObjectId),
  ]),
  friendController.sendFriendRequest
);

/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access login required
 */
router.get(
  "/requests/incoming",
  authentication.loginRequired,
  friendController.getReceivedFriendRequestList
);

/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of sent pending requests
 * @access login required
 */
router.get(
  "/requests/outgoing",
  authentication.loginRequired,
  friendController.getSentFriendRequestList
);

/**
 * @route GET /friends
 * @description Get the list of friends
 * @access login required
 */
router.get("/", authentication.loginRequired, friendController.getFriendList);

/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @access login required
 * @body {status: 'accepted' or 'declined'}
 */
router.put(
  "/requests/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
    body("status").exists().isString().isIn(["accepted", "declined"]),
  ]),
  friendController.reactFriendRequest
);

/**
 * @route DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access login required
 */
router.delete(
  "/requests/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  friendController.cancelFriendRequest
);

/**
 * @route DELETE /friends/:userId
 * @description Remove a friend
 * @access login required
 */
router.delete(
  "/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  friendController.removeFriend
);

module.exports = router;
