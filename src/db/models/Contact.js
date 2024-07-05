import { Schema, model } from "mongoose";

const contactShema = new Schema({
    name: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: false
    },
    isFavourite: {
        type: Boolean,
        default: false
    },

    contactType: {
        type: String,
        enum: ["work", "home", "personal"],
        require: true,
        default: "personal"
    }
},
    {
        timestamps: true,
        versionKey: false
    },
);

const Contact = model("contact", contactShema);

export default Contact;