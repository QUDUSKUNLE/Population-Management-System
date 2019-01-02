import 'babel-polyfill';
import express from 'express';

import Controller from '../controllers/appControllers';
import verifyToken from '../middlewares/verifyToken';
import validateRequest from '../middlewares/validateRequests';

const router = express.Router();

router.post(
  '/signup',
  validateRequest,
  Controller.signUp,
);

router.post(
  '/signin',
  validateRequest,
  Controller.signIn,
);

router.post(
  '/locations',
  verifyToken,
  validateRequest,
  Controller.createLocations,
);

router.get(
  '/locations',
  verifyToken,
  validateRequest,
  Controller.getLocation,
);

router.put(
  '/locations/:id',
  verifyToken,
  validateRequest,
  Controller.editLocations,
);

router.delete(
  '/locations/:id',
  verifyToken,
  validateRequest,
  Controller.deleteLocations,
);

export default router;
