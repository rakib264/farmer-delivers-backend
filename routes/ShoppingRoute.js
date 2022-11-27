import express from "express";
import { GetFoodsAvailability, GetTopVendors, ReadyInFoods, SearchFoods, GetShopById, GetAvailableOffers, GetAllVendorFoods} from '../controllers/ShoppingController.js';

const router = express.Router();


/*---------------------------------------| Get All Foods Availability |-----------------------------------*/
router.get('/:pincode', GetFoodsAvailability)

/*---------------------------------------| Get Top Vendors |-----------------------------------*/
router.get('/top-vendors/:pincode', GetTopVendors)

/*---------------------------------------| Get All Vendor Foods |-----------------------------------*/
router.get('/top-vendors/:pincode/foods/:category', GetAllVendorFoods);

/*---------------------------------------| Get Ready Foods In 30 Munites |-----------------------------------*/
router.get('/ready-in-30/:pincode', ReadyInFoods)

/*---------------------------------------| Get Search Foods |-----------------------------------*/
router.get('/search-foods/:pincode', SearchFoods)

/*---------------------------------------| Get Restaurant By ID |-----------------------------------*/
router.get('/shop/:id', GetShopById)

/*---------------------------------------| Get Available Offers |-----------------------------------*/
router.get('/offers/:pincode', GetAvailableOffers);





export { router as ShoppingRoute};