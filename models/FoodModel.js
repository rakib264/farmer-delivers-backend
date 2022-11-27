// import mongoose, { Schema, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';


const FoodSchema = new Schema({
    vendorId: { type: String},
    name:{ type: String, required: true},
    description:{ type: String},
    category: { type: String, required: true},
    quantity: { type: Number, required: true, default: 0},
    readyTime: { type: String},
    foodType : { type: String, required: true},
    price: { type: Number, required: true},
    rating: { type: Number },
    images: { type: [String],},
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Food = mongoose.model('food', FoodSchema);
export { Food };