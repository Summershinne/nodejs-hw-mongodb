import { Schema, model } from "mongoose";
import { typeList } from "../../constants/contacts-constants.js";
import { mongooseSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema({
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
        default: "personal"
    },
    photo: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
   
},
    {
        timestamps: true,
        versionKey: false
    },
);

contactSchema.post("save", mongooseSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

contactSchema.post("findOneAndUpdate", mongooseSaveError);

const Contact = model("contact", contactSchema);

export default Contact;