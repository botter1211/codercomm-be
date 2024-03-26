const Reaction = require("../models/Reaction.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const mongoose = require("mongoose");

const reactionController = {};

const calculateReactions = async (targetId, targetType) => {
  const stats = await Reaction.aggregate([
    {
      $match: { targetId: new mongoose.Types.ObjectId(targetId) },
    },
    {
      $group: {
        _id: "$targetId",
        like: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "like"] }, 1, 0],
          },
        },
        dislike: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "dislike"] }, 1, 0],
          },
        },
      },
    },
  ]);
  const reactions = {
    like: (stats[0] && stats[0].like) || 0,
    dislike: (stats[0] && stats[0].dislike) || 0,
  };
  await mongoose.model(targetType).findByIdAndUpdate(targetId, { reactions });
  return reactions;
};

reactionController.saveReaction = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { targetType, targetId, emoji } = req.body;

  // Check targetType exists
  const targetObj = await mongoose.model(targetType).findById(targetId);
  if (!targetObj)
    throw new AppError(400, `${targetType} not found`, "Create Reaction Error");
  // Find the reaction if exists
  let reaction = await Reaction.findOne({
    targetType,
    targetId,
    author: currentUserId,
  });
  // If there is no reaction in the DB -> Create new one
  if (!reaction) {
    reaction = await Reaction.create({
      targetType,
      targetId,
      author: currentUserId,
      emoji,
    });
  } else {
    // If there is a previous reaction in DB -> Compare the emoji
    if (reaction.emoji === emoji) {
      // If they are the same -> delete the reaction
      await reaction.deleteOne();
    } else {
      // If they are different -> update the reaction
      reaction.emoji = emoji;
      await reaction.save();
    }
  }

  const reactions = await calculateReactions(targetId, targetType);

  return sendResponse(
    res,
    200,
    true,
    reactions,
    null,
    "Save Reaction successful"
  );
});
module.exports = reactionController;
