const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const postController = require("../controllers/post.controller");

/**
 * @route GET /posts/user/userId?page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access login required
 */
router.get(
  "/user/:userId",
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getPosts
);

/**
 * @route POST /posts
 * @description Create a new post
 * @access login required
 * @body {content, image}
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([body("content", "Missing content").exists().notEmpty()]),
  postController.createNewPost
);

/**
 * @route PUT /posts/:id
 * @description Update a post
 * @access login required
 *  @body {content, image}
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.updateSinglePost
);

/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access login required
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.deleteSinglePost
);

/**
 * @route GET /posts/:id
 * @description Get a single post
 * @access login required
 */
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getSinglePost
);

/**
 * @route GET /posts/:id/comments
 * @description Get comments of a post
 * @access login required
 */
router.get(
  "/:id/comments",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getCommentsOfPost
);
module.exports = router;
