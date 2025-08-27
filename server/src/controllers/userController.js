import User from "../models/User.js";

export const addTrustedContacts = async (req, res) => {
    try {
        const { name, phone, relation } = req.body;

        if (!name || !phone || !relation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(req.user._id);

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
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getTrustedContacts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.trustedContacts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTrustedContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { name, phone, relation } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const contact = user.trustedContacts.id(contactId);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        if (name) contact.name = name;
        if (phone) contact.phone = phone;
        if (relation) contact.relation = relation;

        await user.save();

        res.json({
            message: "Contact updated successfully",
            contact
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTrustedContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const contact = user.trustedContacts.id(contactId);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        contact.deleteOne();
        await user.save();

        res.json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
