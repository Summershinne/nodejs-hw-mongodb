import { Schema,model } from "mongoose";
import { mongooseSaveError, setUpdateSettings } from "./hooks.js";

const sessionShema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    accessToken: {
        type: String,
        require: true
    },
    refreshToken: {
        type: String,
        require: true
    },
    accessTokenValidUntil: {
        type: Date,
        require:true
    },
    refreshTokenValidUntil: {
        type: Date,
        require:true
    },
}, {
    timestamps: true,
    versionKey: false
});

sessionShema.post("save", mongooseSaveError);

sessionShema.pre("findOneAndUpdate", setUpdateSettings);

sessionShema.post("findOneAndUpdate", mongooseSaveError);


const Session = model("sessiion", sessionShema);

export default Session;