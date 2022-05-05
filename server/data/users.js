const { users, stories } = require("../config/mongoCollections");

const createUser = async (userId, emailAddress, displayName) => {
  const usersCollection = await users();
  const findUser = await usersCollection.findOne({ _id: userId });
  if (findUser) {
    throw `User already exists with given displayName / id.`;
  }
  let user = {
    _id: userId,
    emailAddress,
    displayName,
    storiesPosted: [],
  };
  const insertUser = await usersCollection.insertOne(user);
  if (insertUser.insertedCount === 0) throw `Couldn't insert user to database`;
  return await usersCollection.findOne({ _id: insertUser.insertedId });
};

const getPublicProfile = async (userId) => {
  const usersCollection = await users();
  const storiesCollection = await stories();
  const findUser = await usersCollection.findOne({ _id: userId });
  if (!findUser) {
    throw `User does not exist with id ${userId}`;
  }
  const userStories = await storiesCollection.find({ creatorId: findUser._id }).toArray();
  // TODO get user liked stories
  findUser.storiesCreated = userStories;
  return findUser;
};

const updateUser = async (userId, displayName, filePath) => {
  const usersCollection = await users();
  const findUser = await usersCollection.findOne({ _id: userId });
  if (!findUser) {
    throw `User does not exist with id ${userId}`;
  }
  let updatedUser = {
    displayName,
    userAvatar: filePath,
  };
  const performedUpdate = await usersCollection.updateOne({ _id: userId }, { $set: updatedUser });
  const updateUser = await usersCollection.findOne({ _id: userId });
  return updateUser;
};

module.exports = {
  createUser,
  getPublicProfile,
  updateUser,
};
