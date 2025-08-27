import SosLog from "../models/SosLog.js";
import User from "../models/User.js";

export const activateSos = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const userId = req.user._id;

        const sos = await SosLog.create({
            user: userId,
            location: { lat, lng },
            status: "active",
            triggeredAt: Date.now()
        });

        res.status(201).json({ message: "SOS activated", sos });
    } catch (error) {
        res.status(500).json({ message: "Error activating SOS", error: error.message });
    }
};

export const resolveSos = async (req, res) => {
    try {
        const { sosId } = req.params;

        const sos = await SosLog.findOne({ _id: sosId, user: req.user._id });
        if (!sos) return res.status(404).json({ message: "SOS not found" });

        sos.status = "resolved";
        sos.resolvedAt = new Date();
        await sos.save();

        res.status(200).json({ message: "SOS resolved", sos });
    } catch (error) {
        res.status(500).json({ message: "Error resolving SOS", error: error.message });
    }
};

export const getSosHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const sosLogs = await SosLog.find({ user: userId }).sort({ triggeredAt: -1 });
        res.status(200).json({ sosLogs });
    } catch (error) {
        res.status(500).json({ message: "Error fetching SOS history", error: error.message });
    }
};