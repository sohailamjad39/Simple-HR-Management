// server/utils/generateToken.js
import jwt from "jsonwebtoken";

/**
 * Generate JWT token for HR user
 * @param {string} id - HR user ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default generateToken;
