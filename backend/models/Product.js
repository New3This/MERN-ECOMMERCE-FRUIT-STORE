import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
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
        type: mongoose.Schema.Types.ObjectId, // instead of string - allows relationship between models = methods like populate work
        ref: "User",
        required: true
    },
    image: {
        type: String,
        default: '',
        required: false
    },
}, { timestamps: true})

export default mongoose.model('Product', productSchema);