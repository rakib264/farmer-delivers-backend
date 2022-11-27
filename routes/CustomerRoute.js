import express from "express";
import { AddToCart, CreateOrder, CreatePayment, customerLogin, customerProfile, 
         customerSignUp, customerVerify, DeleteCart, editCustomerProfile, GetCart, GetOrderById, GetOrders, VerifyOffer } 
         from "../controllers/CustomerController.js";
import { Authenticate } from "../middlewares/common.auth.js";
// import { CustomerInputs } from "../utility/customerInputs.js";

const router = express.Router();

router.post('/signup', customerSignUp); //CustomerInputs

router.post('/login',  customerLogin);  

router.post('/verify', Authenticate , customerVerify);

router.get('/profile', Authenticate, customerProfile);

router.patch('/edit', Authenticate, editCustomerProfile);

//Cart routes

router.post('/addto-cart', Authenticate, AddToCart);

router.get('/cart', Authenticate, GetCart);

router.delete('/cart', Authenticate, DeleteCart);

//Order routes
router.post('/create-order', Authenticate, CreateOrder);

router.get('/orders', Authenticate, GetOrders);

router.get('/order/:id', Authenticate, GetOrderById);

//Verify Offer
router.get('/verify/offer/:id', Authenticate, VerifyOffer);

//Payment
router.post('/payment', Authenticate, CreatePayment);


export { router as CustomerRoute} ;