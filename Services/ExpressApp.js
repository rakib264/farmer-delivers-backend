import express from "express";
import bodyParser from "body-parser";
import { AdminRoute } from '../routes/AdminRoute.js';
import { VendorRoute } from '../routes/VendorRoute.js';
import { ShoppingRoute } from '../routes/ShoppingRoute.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { CustomerRoute } from "../routes/CustomerRoute.js";
import { DeliveryPersonRoute } from "../routes/DeliveryRoute.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const App = async (app) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/images', express.static(path.join(__dirname, 'images')));


    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);
    app.use('/shopping', ShoppingRoute);
    app.use('/customer', CustomerRoute);
    app.use('/delivery', DeliveryPersonRoute);

    return app;

}

export default App;  


