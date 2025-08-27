import SosLog from "../models/SosLog.js";
import User from "../models/User.js";
import { notifyEmergency } from "../server.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
});


const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const activateSos = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const userId = req.user._id;

        const activeSos = await SosLog.findOne({ user: userId, status: "active" });
        if (activeSos) {
            return res.status(400).json({ message: "Active SOS already exists", activeSos });
        }

        // Create new SOS
        const sos = await SosLog.create({
            user: userId,
            location: { lat, lng },
            status: "active",
            triggeredAt: Date.now()
        });

        // Notify emergency dashboard
        notifyEmergency(sos);

        // Fetch user with trusted contacts
        const user = await User.findById(userId);


        if (user.trustedContacts && user.trustedContacts.length > 0) {
            const sosMessage = `Emergency SOS Alert! ${user.name} may be in danger. Contact: ${user.phone}`;

            for (const contact of user.trustedContacts) {
                const toNumber = contact.phone.startsWith("+") ? contact.phone : `+91${contact.phone}`;

                try {
                    const message = await client.messages.create({
                        body: sosMessage,
                        from: process.env.TWILIO_PHONE,
                        to: toNumber,
                    });
                    console.log(`SMS sent to ${contact.name}: ${message.sid}`);
                } catch (err) {
                    console.error(`Failed to send SMS to ${contact.name}:`, err.message);
                }
            }
        }

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


export const getAllActiveSos = async (req, res) => {
    try {
        const sosLogs = await SosLog.find({ status: "active" }).populate("user", "name email phone").sort({ triggeredAt: -1 });

        res.status(200).json({ sosLogs });
    } catch (error) {
        console.error("Get All Active SOS Error:", error);
        res.status(500).json({ message: "Error fetching active SOS logs", error: error.message });
    }
};

