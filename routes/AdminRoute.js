import express from "express";
import { CreateVendor, GetAllVendors, GetDeliveryPersons, GetTransactionById, GetTransactions, GetVendorById, VerifyDeliveryPerson } from "../controllers/AdminController.js";




const router = express.Router();


router.post('/create', CreateVendor);

router.get('/vendors', GetAllVendors);

router.get('/vendor/:id', GetVendorById);

router.get('/transactions', GetTransactions);

router.get('/transaction/:id', GetTransactionById);

router.get('/delivery-persons', GetDeliveryPersons);

router.patch('/verify/delivery-person', VerifyDeliveryPerson);



export { router as AdminRoute};