const express = require("express");
const router = express.Router();

/**
 * @route POST /friends/request
 * @description Send a friend request
 * @access login required
 * @body {to: User ID}
 */

/**
 * @route GET /friends/requests/incoming
 * @description Get the list of received pending requests
 * @access login required
 */

/**
 * @route GET /friends/requests/outgoing
 * @description Get the list of sent pending requests
 * @access login required
 */

/**
 * @route GET /friends
 * @description Get the list of friends
 * @access login required
 */

/**
 * @route PUT /friends/requests/:userId
 * @description Accept/Reject a received pending requests
 * @access login required
 * @body {status: 'accepted' or 'declined'}
 */

/**
 * @route DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access login required
 */

/**
 * @route DELETE /friends/:userId
 * @description Remove a friend
 * @access login required
 */

module.exports = router;
