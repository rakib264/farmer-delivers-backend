import mongoose from 'mongoose'; 
import { MONGO_URI } from '../config/dummy.js';


// mongoose.connect(MONGO_URI).then(result => {
//     console.log("DB Connected")
// }).catch(err => {
//     console.log(err)
// })

const DBConnection = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB Connected successfully");
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

export default DBConnection;