import express from "express";
import { deliveryPersonLogin, deliveryPersonProfile, deliveryPersonSignUp, editDeliveryPersonProfile, updateDeliveryPersonStatus } from "../controllers/DeliveryController.js";

import { Authenticate } from "../middlewares/common.auth.js";
import { DeliveryInputs } from "../utility/customerInputs.js";

const router = express.Router();

router.post('/signup', DeliveryInputs, deliveryPersonSignUp);

router.post('/login',  deliveryPersonLogin);  

router.get('/profile', Authenticate, deliveryPersonProfile);

router.patch('/edit', Authenticate, editDeliveryPersonProfile);

router.patch('/change-status', Authenticate, updateDeliveryPersonStatus);



export { router as DeliveryPersonRoute} ;