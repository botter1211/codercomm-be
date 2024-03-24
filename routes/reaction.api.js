const express = require("express");
const router = express.Router();

/**
 * @route POST /reactions
 * @description Save a reaction to post or comment
 * @access login required
 * @body {targetType: 'Post' or 'Comment', targetId, emoji:'like' or 'dislike'}
 */

module.exports = router;
