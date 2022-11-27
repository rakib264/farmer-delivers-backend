import express from 'express';
import { AddFood, AddOffer, EditOffer, GetCurrentOrder, GetFoods, GetOffers, GetOrderDetails, 
    ProcessOrder, UpdateVendorCover, UpdateVendorProfile, 
    UpdateVendorService, VendorLogin, VendorProfile } from "../controllers/VendorController.js";
import { Authenticate } from '../middlewares/common.auth.js';
import multer from 'multer';


//Multer configuration
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');

    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString()+'-'+file.originalname);
    }
});

const images = multer({ storage: imageStorage }).array('images', 10);


const router = express.Router();

router.post('/login', VendorLogin );

//Authenticated routes
router.get('/profile', Authenticate, VendorProfile);
router.patch('/update', Authenticate, UpdateVendorProfile);
router.patch('/service', Authenticate, UpdateVendorService);
router.patch('/coverImage', Authenticate, images, UpdateVendorCover);

router.post('/add/food', Authenticate, AddFood);
router.get('/food', Authenticate, GetFoods);


//Managing Order Routes By Vendor

router.get('/orders',Authenticate, GetCurrentOrder);

router.get('/order/:id', Authenticate, GetOrderDetails);

router.patch('/process/:id', Authenticate, ProcessOrder);


//Managing Offer Routes By Vendor

router.get('/offers', Authenticate, GetOffers);

router.post('/add/offer', Authenticate, AddOffer);

router.patch('/edit/offer/:id', Authenticate, EditOffer);



export { router as VendorRoute};