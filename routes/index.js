var express = require("express");
var router = express.Router();

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

//postApi
const postApi = require("./post.api");
router.use("/posts", postApi);

// authApi
const commentApi = require("./comment.api");
router.use("/comments", commentApi);

// authApi
const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);

// authApi
const friendApi = require("./friend.api");
router.use("/friends", friendApi);

module.exports = router;
