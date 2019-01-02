import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @app utils
 */
export default {

  /**
   * @description Method generates token
   * @param {Object} user request object
   * @return {string} token
   */
  token: user => jwt.sign(
    { token: { user } }, process.env.SECRET_TOKEN, { expiresIn: '24h' },
  ),
  /**
   * @function pagination
   * @param {number} count
   * @param {number} limit
   * @param {number} offset
   * @returns {object} return an object with the page
  */
  pagination: (count, limit, offset) => {
    const page = Math.floor(offset / limit) + 1;
    const pageCount = Math.ceil(count / limit);
    const pageSize = (count - offset) > limit ? limit : (count - offset);
    return {
      page, pageCount, pageSize, count,
    };
  },
};
