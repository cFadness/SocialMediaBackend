const { User, validateLogin, validateUser } = require("../models/user");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

//* POST register a new user
router.post("/register", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send(`Email ${req.body.email} already claimed!`);

    const salt = await bcrypt.genSalt(10);
    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      posts: req.body.posts,
      about: req.body.about,
      friends: req.body.friends,
      inbox: req.body.inbox,
      photos: req.body.photos,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      isAdmin: req.body.isAdmin
    });

    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//* POST a valid login attempt
//! when a user logs in, a new JWT token is generated and sent if their email/password credentials are correct
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// Get users by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* DELETE a single user from the database
router.delete("/:userId", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Change User Profile
router.put('/', [auth], async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(req.user._id, 
        {
          ...req.body
        },
          { new: true }
          );

          if (!user)
              return res.status(400).send(`The userId "${req.user._id}"
              does not exist.`);
        
          await user.save();

          return res.send(user);
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//* Send friend request
router.put('/:id', [auth], async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(req.params.id)
      const userTwo = await User.findById(req.user._id)
      const friendRequest = (userTwo)
      user.inbox.push(friendRequest)

          if (!user)
              return res.status(400).send(`The userId "${req.params.id}"
              does not exist.`);
        
          await user.save();

          return res.send(user);
  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// Get friends list
router.get('/friends', [auth], async (req, res) => {
  try {
      const user = await User.findById(req.user._id);

      const friendsList = user.friends

      return res.send(friendsList);

  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// Get list of friends requests
router.get('/inbox', [auth], async (req, res) => {
  try {
      const user = await User.findById(req.user._id);

      const inbox = user.inbox

      return res.send(inbox);

  } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
