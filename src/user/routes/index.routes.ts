import express from 'express';
import AuthRoutes from './auth.routes.js';

const route = express.Router();

route.use('/auth', AuthRoutes);

export default route