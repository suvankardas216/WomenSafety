import User from "../models/User.js";

export const addTrustedContacts = async (req, res) => {
    try {
        const { name, phone, relation } = req.body;

        if (!name || !phone || !relation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newContact = { name, phone, relation };

        user.trustedContacts.push(newContact);

        await user.save();

        res.status(200).json({
            message: "Contact added successfully",
            trustedContacts: user.trustedContacts
        });
    } catch (errror) {
        res.status(400).json({ message: error.message });
    }
}