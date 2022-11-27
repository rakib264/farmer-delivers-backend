import express from 'express';
import App from './Services/ExpressApp.js';
import DBConnection from './Services/Database.js';


const port = 9000;


const startServer = async () => {
    const app = express();
    await DBConnection();
    await App(app);

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
}


startServer();































// import express from "express";
// import bodyParser from "body-parser";
// import { AdminRoute } from './routes/AdminRoute.js';
// import { VendorRoute } from './routes/VendorRoute.js';
// import mongoose from 'mongoose'; 
// import { MONGO_URI } from './config/dummy.js';
// // import { DBConnection } from './Services/DBConnection';
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__dirname );

// mongoose.connect(MONGO_URI).then(result => {
//     console.log("DB Connected")
// }).catch(err => {
//     console.log(err)
// })




// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/images', express.static(path.join(__dirname, 'images')));


// app.use('/admin', AdminRoute);
// app.use('/vendor', VendorRoute);

// app.listen(9000, () => {
//     console.clear();
//     console.log('Listening to 9000 port');
// })