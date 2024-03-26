const Comment = require("../models/Comment.js");
const Post = require("../models/Post.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");

const commentController = {};

const calculateCommentCount = async (postId) => {
  const commentCount = await Comment.countDocuments({
    post: postId,
  });
  await Post.findByIdAndUpdate(postId, { commentCount });
};

commentController.createNewComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, postId } = req.body;

  // Check post exists
  const post = Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not found", "Create new comment error");

  // Create new comment
  let comment = await Comment.create({
    author: currentUserId,
    post: postId,
    content,
  });

  // Update commentCount of the post
  await calculateCommentCount(postId);
  comment = await comment.populate("author");

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Create new comment successful"
  );
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, author: currentUserId },
    { content },
    { new: true }
  );
  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Update Comment Error"
    );

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Update comment successful"
  );
});

commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    author: currentUserId,
  });
  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Delete Comment Error"
    );
  await calculateCommentCount(comment.post);
  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Delete comment successful"
  );
});

commentController.getSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const commentId = req.params.id;

  let comment = await Comment.findById(commentId);
  if (!comment)
    throw new AppError(400, "Comment not found", "Get single comment error");

  return sendResponse(res, 200, true, comment, null, "Get comment successful");
});
module.exports = commentController;
