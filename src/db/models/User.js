import { Schema, model } from "mongoose";
import { mongooseSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../../constants/users-constants.js";

const userShema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }

}, {
    timestamps: true,
    versionKey: false
});

userShema.post("save", mongooseSaveError);

userShema.pre("findOneAndUpdate", setUpdateSettings);

userShema.post("findOneAndUpdate", mongooseSaveError);


const User = model("user", userShema);

export default User;