const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body, param } = require("express-validator");
const reactionController = require("../controllers/reaction.controller");
/**
 * @route POST /reactions
 * @description Save a reaction to post or comment
 * @access login required
 * @body {targetType: 'Post' or 'Comment', targetId, emoji:'like' or 'dislike'}
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("targetType", "Invalid targetType").exists().isIn(["Post", "Comment"]),
    body("targetId", "Invalid targetId")
      .exists()
      .custom(validators.checkObjectId),
    body("emoji", "Invalid emoji").exists().isIn(["like", "dislike"]),
  ]),
  reactionController.saveReaction
);
module.exports = router;
