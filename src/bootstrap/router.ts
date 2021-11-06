/**
 * Original Author: Jack Watson
 * Created Date: 9/27/2021
 * Purpose: The purpose of this file is to create an instance of the react router, then load up all of the routes that
 * we have in our application.
 * 
 */

import express from 'express'
import searchRouter from '../modules/search/searchRouter';
import signupRouter from '../modules/signup/signupRouter';
import trackingRouter from '../modules/tracking/trackingRouter';
import paymentRouter from '../modules/payment/paymentRouter';

let router: express.Router = express.Router();

router.use('/search',   searchRouter);
router.use('/signup',   signupRouter);
router.use('/tracking', trackingRouter);
router.use('/payment',  paymentRouter);

export default router;
