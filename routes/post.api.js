const express = require("express");
const router = express.Router();

/**
 * @route GET /posts/user/userId?page=1&limit=10
 * @description Get all posts an user can see with pagination
 * @access login required
 */

/**
 * @route POST /posts
 * @description Create a new post
 * @access login required
 * @body {content, image}
 */

/**
 * @route PUT /posts/:id
 * @description Update a post
 * @access login required
 *  @body {content, image}
 */

/**
 * @route DELETE /posts/:id
 * @description Delete a post
 * @access login required
 */

/**
 * @route GET /posts/:id
 * @description Get a single post
 * @access login required
 */

/**
 * @route GET /posts/:id/comments
 * @description Get comments of a post
 * @access login required
 */

module.exports = router;
