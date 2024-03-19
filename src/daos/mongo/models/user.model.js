import mongoose from "mongoose";

const collection = 'users'

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    fullName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    loggedBy: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium'],
    }
})

const userModel = mongoose.model(collection, schema)

export default userModel;