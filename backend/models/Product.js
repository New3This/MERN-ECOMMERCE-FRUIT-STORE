import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true})

export default mongoose.model('Product', productSchema);