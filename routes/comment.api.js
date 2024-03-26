const express = require("express");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const commentController = require("../controllers/comment.controller");
const router = express.Router();
const { body, param } = require("express-validator");

/**
 * @route POST /comments
 * @description Create a new comment
 * @access login required
 * @body {content, postId}
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content", "Missing content").exists().notEmpty(),
    body("postId", "Missing postId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.createNewComment
);

/**
 * @route PUT /comments/:id
 * @description Update a comment
 * @access login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  commentController.updateSingleComment
);

/**
 * @route DELETE /comments/:id
 * @description Delete a comment
 * @access login required
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.deleteSingleComment
);

/**
 * @route GET /comments/:id
 * @description Get details of a comment
 * @access login required
 */
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.getSingleComment
);
module.exports = router;
