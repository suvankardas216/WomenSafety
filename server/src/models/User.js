import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    relation: {
        type: String,
    }
});

const sosLogSchema = new mongoose.Schema({
    activatedAt: {
        type: Date,
        default: Date.now
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    },
    status: {
        type: String,
        enum: ["active", "resolved"],
        default: "active"   
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    trustedContacts: [contactSchema],
    sosLogs: [sosLogSchema],
},
{
    timestamps: true
});

export default mongoose.model("User", userSchema);
