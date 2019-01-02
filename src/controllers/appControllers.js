import bcrypt from 'bcrypt';
import capitalize from 'capitalize';

import utils from '../utils';
import User from '../models/Users';
import Locations from '../models/Locations';


/**
 * @appController
 */
export default {
  /**
   * signup a new user
   * Routes: POST: /api/v1/signup
   * @param {any} req user request object
   * @param {any} res server response
   * @return {void} json server response
   */
  signUp: async (req, res) => {
    if ((!req.body.name) || (!req.body.email) || (!req.body.password)) {
      return res.status(400).json({
        error: 'Either email, password or name must not be empty',
        success: false,
      });
    }
    let mail;
    try {
      mail = await User.findOne({ email: req.body.email });
      if (mail) {
        return res.status(409).json({
          error: 'Email is already registered',
          success: false,
        });
      }
      const user = new User({
        name: capitalize(req.body.name.trim()),
        password: req.body.password.trim(),
        email: req.body.email.trim(),
      });
      user.save((err, newUser) => {
        if (err) {
          return res.status(500).json({ success: false, message: err });
        }
        const userDetails = {
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          userId: newUser._id,
        };
        return res.status(201).json({
          message: 'Sign up successful',
          success: true,
          token: utils.token(newUser),
          userDetails,
        });
      });
    } catch (e) { return res.status(500).json({ error: e }); }
  },

  /**
   * Routes: POST: /api/v1/signin
   * @param {any} req user request object
   * @param {any} res server response
   * @return {void} json server response
   */
  signIn: async (req, res) => {
    if ((!req.body.email) || (!req.body.password)) {
      res.status(400).json({
        error: 'Email or password must not be empty',
        success: false,
      });
    } else {
      User.findOne({
        email: req.body.email,
      })
        .exec((err, response) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: 'internal server error',
            });
          }
          if (!response) {
            return res.status(404).json({
              success: false,
              error: 'User does not exist',
            });
          }
          // compare passwords
          if (!bcrypt.compareSync(req.body.password, response.password)) {
            return res.status(401).json({
              success: false,
              error: 'Email or password is invalid',
            });
          }
          const userDetails = {
            name: response.name.trim(),
            email: response.email.trim(),
            userId: response._id,
          };
          return res.status(200).json({
            message: 'Sign in successful',
            success: true,
            token: utils.token(response),
            userDetails,
          });
        });
    }
  },

  /**
   * Routes: POST: /api/v1/locations
   * @param {any} req user request object
   * @param {any} res server response
   * @return {void}
   * @memberOf AppController
   */
  createLocations: async (req, res) => {
    if ((!req.body.location) || (!req.body.sex)) {
      return res.status(400).json({
        success: false,
        error: 'Either location or sex must not be empty',
      });
    }
    if ((!req.body.sex.male) || (!req.body.sex.female)) {
      return res.status(400).json({
        success: false,
        error: 'Sex must be defined',
      });
    }
    // Check if location location already exist
    let location;
    try {
      location = await Locations.findOne(
        { location: capitalize(req.body.location) },
      );
      if (location) {
        return res.status(409).json({
          success: false,
          error: 'existingLocation',
          message: 'Location must be unique',
        });
      }
      const newLocation = new Locations({
        location: capitalize(req.body.location.trim()),
        sex: {
          male: req.body.sex.male,
          female: req.body.sex.female,
        },
        creator: {
          id: req.decoded.token.user._id,
          name: req.decoded.token.user.name,
        },
      });
      newLocation.save((er, createdLocation) => {
        if (er) {
          return res.status(500).json({
            success: false,
            error: 'Internal server error',
          });
        }
        // return new Location
        return res.status(201).json({
          success: true,
          message: 'Your location has been created successfully',
          createdLocation,
        });
      });
    } catch (e) {
      return res.status(500).json(
        { error: e.message, success: false },
      );
    }
  },

  /**
   * Routes: PUT: /api/v1/locations/:id
   * @param {any} req user request object
   * @param {any} res server response
   * @return {void}
   * @memberOf appController
   */
  editLocations: async (req, res) => {
    if ((!req.body.location) || (!req.body.sex)) {
      return res.status(400).json({
        success: false,
        error: 'Either location or sex must not be empty',
      });
    }
    if ((!req.body.sex.male) || (!req.body.sex.female)) {
      return res.status(400).json({
        success: false,
        error: 'Sex must be defined',
      });
    }
    try {
      const updatedLocation = await Locations.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { location: capitalize(req.body.location.trim()) },
          sex: {
            male: req.body.sex.male,
            female: req.body.sex.female,
          },
        }, { upsert: true },
      );
      return res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        status: 'edited',
        updatedLocation: {
          location: updatedLocation.location,
          sex: {
            male: updatedLocation.sex.male,
            female: updatedLocation.sex.female,
          },
        },
      });
    } catch (e) { res.status(500).json({ error: e }); }
  },

  /**
   * Routes: GET: /api/v1/locations
   * @description This fetch idea by IdeaId
   * @param {any} req user request object
   * @param {any} res server response
   * @return {void}
   * @memberOf appController
   */
  getLocation: async (req, res) => {
    const offset = parseInt(req.query.offset, 10);
    const limit = parseInt(req.query.limit, 10);
    if (req.query.id) {
      let location;
      try {
        location = await Locations.findOne({ _id: req.query.id.trim() });
        return res.status(200).json({
          response: {
            _id: location._id,
            name: location.location,
            success: true,
          },
        });
      } catch (e) {
        return res.status(404).json({
          error: e,
          message: 'Invalid message location',
          success: false,
        });
      }
    }
    let count;
    Locations.estimatedDocumentCount({}, (err, isCount) => {
      count = isCount;
      Locations.find({})
        .skip(offset)
        .limit(limit)
        .exec()
        .then(locations => res.status(200).json({
          locations,
          pageInfo: utils.pagination(count, limit, offset),
        }));
    });
  },

  /**
  * Routes: DELETE: /api/v1/location/:id
  * @param {any} req user request object
  * @param {any} res server response
  * @return {void}
  * @memberOf appController
  */
  deleteLocations: async (req, res) => {
    let location;
    try {
      location = await Locations.findById({ _id: req.params.id });
      if (location) {
        Locations.deleteOne({
          _id: req.params.id,
        }).then(() => res.status(202).json({
          success: true,
          message: 'Location deleted successfully',
        })).catch(error => res.status(500).json({
          success: false,
          error: error.message,
        }));
      }
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: 'Unathorized, invalid location identity',
        error: e.message,
      });
    }
  },
};
