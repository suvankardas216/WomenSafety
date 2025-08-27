import mongoose from "mongoose";

const sosLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    status: { type: String, enum: ["active", "resolved"], default: "active" },
    triggeredAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date }
});

export default mongoose.model("SosLog", sosLogSchema);
