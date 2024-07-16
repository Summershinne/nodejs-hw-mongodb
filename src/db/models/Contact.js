import { Schema, model } from "mongoose";
import { typeList } from "../../constants/contacts-constants.js";
import { mongooseSaveError, setUpdateSettings } from "./hooks.js";

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
        enum: typeList,
        require: true,
        default: "personal"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
},
    {
        timestamps: true,
        versionKey: false
    },
);

contactShema.post("save", mongooseSaveError);

contactShema.pre("findOneAndUpdate", setUpdateSettings);

contactShema.post("findOneAndUpdate", mongooseSaveError);


const Contact = model("contact", contactShema);

export default Contact;