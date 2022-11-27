import { request } from "express";
import { Offer } from "../models/offerModel.js";
import { Vendor } from "../models/VendorModel.js";


export const GetFoodsAvailability = async(req, res) => {
    const pincode = req.params.pincode;
    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true})
                   .sort([['rating', 'descending']])
                   .populate('foods');


    if (result.length > 0) {
        return res.status(200).json(result);
    }      
    
    return res.status(404).json({
        "message": 'Data not found',
    })

}

export const GetAllVendorFoods = async(req, res) => {
    const pincode = req.params.pincode;
    const category = req.params.category;
    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true})
                   .sort([['rating', 'descending']])
                   .populate('foods');

    let foodArray = [];
    if (result.length > 0) {
        result.map(item => {
           item.foods.map(food => {
            if(food.category === `${category}`) {
                foodArray.push(food)
           }
        })
        })
       
    }   
    
    if(foodArray.length > 0){
        return res.status(200).json(foodArray);
    }
    
    return res.status(404).json({
        "message": 'Data not found',
    })

}

export const GetTopVendors = async(req, res) => {

    const pincode = req.params.pincode;
    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true})
                   .sort([['rating', 'descending']])
                   .limit(1);


    if (result.length > 0) {
        return res.status(200).json(result);
    }      
    
    return res.status(404).json({
        "message": 'Data not found',
    })

}

export const ReadyInFoods = async(req, res) => {
    
    const pincode = req.params.pincode;
    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true})
                   .sort([['rating', 'descending']])
                   .populate('foods');
    if (result.length > 0) {
        let foodResult = [];
        result.map(vendor => {
            const foods = vendor.foods;
            foodResult.push(...foods.filter(food => food.readyTime <= 30 ));
        })

        return res.status(200).json(foodResult);
    }      
    
    return res.status(404).json({
        "message": 'Data not found',
    })

}

export const SearchFoods = async(req, res) => {
    const pincode = req.params.pincode;
    let searchItem = req.query.search;
    console.log(searchItem)
    let result = await Vendor.find({ pincode: pincode, serviceAvailable: true})
                   .populate('foods');


    if (result.length > 0) {
        let foodResult = [];
        result.map(vendor => {
            if(searchItem === ""){
                foodResult.push(...vendor.foods)
            }
            vendor.foods.map(item => {
                if(item.name.toLowerCase().includes(searchItem.toLowerCase())){
                //   console.log(item)
                    foodResult.push(item)
                }
            })
        })
       
        return res.status(200).json(foodResult);
    }      
    
    return res.status(404).json({
        "message": 'Data not found',
    })

}

export const GetShopById = async(req, res) => {
    const id = req.params.id;
    const result = await Vendor.findById(id).populate('foods');


    if (result) {
        return res.status(200).json(result);
    }      
    
    return res.status(404).json({
        "message": 'No Shop Found',
    })

}


//Get Avaailable offers
export const GetAvailableOffers = async(req, res) => {
    const pincode = req.params.pincode;
    const offers = await Offer.find({ pincode: pincode, isActive: true });
    if(offers){
        return res.json(offers);
    }
    return res.status(404).json({
        "message": 'No Offer Found',
    })
}

//