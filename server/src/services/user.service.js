import User from "../models/user.model.js";

export const getUsers = async () => {
  return User.find()
    .select("-password")
    .sort({ createdAt: -1 });
};