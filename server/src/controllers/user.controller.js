import * as userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  const users = await userService.getUsers();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
};