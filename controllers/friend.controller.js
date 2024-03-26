const Friend = require("../models/Friend.js");
const User = require("../models/User.js");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");

const friendController = {};

const calculateFriendCount = async (userId) => {
  const friendCount = await Friend.countDocuments({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });
  await User.findByIdAndUpdate(userId, { friendCount: friendCount });
};

friendController.sendFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const toUserId = req.body.to;

  const user = await User.findById(toUserId);
  if (!user)
    throw new AppError(400, "User not found", "Send Friend Request Error");

  let friend = await Friend.findOne({
    $or: [
      { from: toUserId, to: currentUserId },
      { from: currentUserId, to: toUserId },
    ],
  });

  if (!friend) {
    // Create friend request
    friend = await Friend.create({
      from: currentUserId,
      to: toUserId,
      status: "pending",
    });
    return sendResponse(res, 200, true, friend, null, "Request has been sent");
  } else {
    switch (friend.status) {
      // status === pending -> error: already sent
      case "pending":
        if (friend.from.equals(currentUserId)) {
          throw new AppError(
            400,
            "You have already sent a request to this user",
            "Add Friend Error"
          );
        } else {
          throw new AppError(
            400,
            "You have reveived a request from this user",
            "Add Friend Error"
          );
        }
      // status === accept -> error: already friend
      case "accepted":
        throw new AppError(400, "Users are already friend", "Add Friend Error");
      // status === declined -> update status to pending
      case "declined":
        friend.from = currentUserId;
        friend.to = toUserId;
        friend.status = "pending";
        await friend.save();
        return sendResponse(
          res,
          200,
          true,
          friend,
          null,
          "Request has been sent"
        );
      default:
        throw new AppError(400, "Friend status undefined", "Add Friend Error");
    }
  }
});

friendController.getReceivedFriendRequestList = catchAsync(
  async (req, res, next) => {
    let { page, limit, ...filter } = { ...req.query };
    const currentUserId = req.userId;

    let requestList = await Friend.find({
      to: currentUserId,
      status: "pending",
    });

    const requesterIDs = requestList.map((friend) => {
      if (friend.from._id.equals(currentUserId)) return friend.to;
      return friend.from;
    });

    const filterConditions = [{ _id: { $in: requesterIDs } }];
    if (filter.name) {
      filterConditions.push({
        ["name"]: { $regex: filter.name, $options: "i" },
      });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);

    const usersWithFriendship = users.map((user) => {
      let temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (
          friendship.from.equals(user._id) ||
          friendship.to.equals(user._id)
        ) {
          return { status: friendship.status };
        }
        return false;
      });
      return temp;
    });
    return sendResponse(
      res,
      200,
      true,
      { users: usersWithFriendship, totalPages, count },
      null,
      null
    );
  }
);

friendController.getSentFriendRequestList = catchAsync(
  async (req, res, next) => {
    let { page, limit, ...filter } = { ...req.query };
    const currentUserId = req.userId;

    let requestList = await Friend.find({
      from: currentUserId,
      status: "pending",
    });

    const recipientIDs = requestList.map((friend) => {
      if (friend.from._id.equals(currentUserId)) return friend.to;
      return friend.from;
    });

    const filterConditions = [{ _id: { $in: recipientIDs } }];
    if (filter.name) {
      filterConditions.push({
        ["name"]: { $regex: filter.name, $options: "i" },
      });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
      .sort({ createAt: -1 })
      .skip(offset)
      .limit(limit);

    const usersWithFriendship = users.map((user) => {
      let temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (
          friendship.from.equals(user._id) ||
          friendship.to.equals(user._id)
        ) {
          return { status: friendship.status };
        }
        return false;
      });
      return temp;
    });
    return sendResponse(
      res,
      200,
      true,
      { users: usersWithFriendship, totalPages, count },
      null,
      null
    );
  }
);

friendController.getFriendList = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  const currentUserId = req.userId;

  let friendList = await Friend.find({
    $or: [{ from: currentUserId }, { to: currentUserId }],
    status: "accepted",
  });

  const friendIDs = friendList.map((friend) => {
    if (friend.from._id.equals(currentUserId)) return friend.to;
    return friend.from;
  });

  const filterConditions = [{ _id: { $in: friendIDs } }];
  if (filter.name) {
    filterConditions.push({
      ["name"]: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const users = await User.find(filterCriteria)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  const usersWithFriendship = users.map((user) => {
    let temp = user.toJSON();
    temp.friendship = friendList.find((friendship) => {
      if (friendship.from.equals(user._id) || friendship.to.equals(user._id)) {
        return { status: friendship.status };
      }
      return false;
    });
    return temp;
  });
  return sendResponse(
    res,
    200,
    true,
    { users: usersWithFriendship, totalPages, count },
    null,
    null
  );
});

friendController.reactFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId; // To
  const fromUserId = req.params.userId; // From
  const { status } = req.body; // status: accepted || declined

  let friend = await Friend.findOne({
    from: fromUserId,
    to: currentUserId,
    status: "pending",
  });
  if (!friend)
    throw new AppError(
      400,
      "Friend Request not found",
      "React Friend Request Error"
    );

  friend.status = status;
  await friend.save();
  if (status === "accepted") {
    await calculateFriendCount(currentUserId);
    await calculateFriendCount(fromUserId);
  }
  return sendResponse(
    res,
    200,
    true,
    friend,
    null,
    "React Friend Request successful"
  );
});

friendController.cancelFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId; // From
  const toUserId = req.params.userId; // To

  const friend = await Friend.findOne({
    from: currentUserId,
    to: toUserId,
    status: "pending",
  });
  if (!friend)
    throw new AppError(400, "Friend Request not found", "Cancel Request Error");

  await Friend.deleteOne();

  return sendResponse(
    res,
    200,
    true,
    friend,
    null,
    "Friend request has been cancelled"
  );
});

friendController.removeFriend = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const friendId = req.params.userId;

  const friend = await Friend.findOne({
    $or: [
      { from: currentUserId, to: friendId },
      { from: friendId, to: currentUserId },
    ],
    status: "accepted",
  });
  if (!friend)
    throw new AppError(400, "Friend not found", "Remove Friend Error");

  await Friend.deleteOne();
  await calculateFriendCount(currentUserId);
  await calculateFriendCount(friendId);

  return sendResponse(res, 200, true, friend, null, "Friend has been removed");
});

module.exports = friendController;
