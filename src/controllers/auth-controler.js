import createHttpError from "http-errors";
import {createSession} from "../services/session-services.js"
import {findUser, signup} from "../services/auth-services.js"
import { compareHash } from "../utils/hash.js";

export const registerController = async (req, res) => {
    const { email } = req.body;
    const user = await findUser({ email });
    if (user) {
    throw createHttpError(409, "Email in use")
}

    const newUser = await signup(req.body);

    const data = {
        name: newUser.name,
        email: newUser.email,
    };

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data,
    })
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;
        const user = await findUser({ email });
    if (!user) {
        throw createHttpError(401, "User not found");
}
    const passwordCompare = await compareHash(password, user.password);

    if (!passwordCompare) {
        throw createHttpError(401, "Password invalid");
    }

    const { accessToken, refreshToken, _id, refreshTokenValidUntil } = await createSession(user._id);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });
    
    res.cookie("sessionId", _id, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
           accessToken: accessToken,
       }
      
    })
}
