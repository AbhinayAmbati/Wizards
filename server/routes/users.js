const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


const checkIdentityOrAdmin = (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    next();
  } else {
    return res.status(403).json("You can only modify your own account!");
  }
};

// Update user
router.put("/:id", checkIdentityOrAdmin, async (req, res) => {
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch (err) {
      return res.status(500).json("Error updating password: " + err);
    }
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (user) {
      res.status(200).json("Account has been updated");
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json("Error updating account: " + err);
  }
});

// Delete user
router.delete("/:id", checkIdentityOrAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).json("Account has been deleted");
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json("Error deleting account: " + err);
  }
});

// Get a user
router.get("/", async (req, res) => {
  const { userId, username } = req.query;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    if (user) {
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json("Error retrieving user: " + err);
  }
});

// Get friends (following users)
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json("User not found");

    const friends = await Promise.all(
      user.followings.map((friendId) => User.findById(friendId))
    );
    const friendList = friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      return { _id, username, profilePicture };
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json("Error retrieving friends: " + err);
  }
});

// Follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json("Error following user: " + err);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});

// Unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json("Error unfollowing user: " + err);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself");
  }
});

module.exports = router;
