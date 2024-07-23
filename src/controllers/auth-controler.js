import createHttpError from "http-errors";
import {createSession, deleteSession, findSession} from "../services/session-services.js"
import {findUser, signup} from "../services/auth-services.js"
import { compareHash } from "../utils/hash.js";
import jwt from 'jsonwebtoken';
import { SMTP, TEMPLATES_DIR } from "../constants/smtp-constants.js";
import  env  from '../utils/env.js';
import { sendEmail } from "../utils/sendMail.js";
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import path from 'node:path';
import  User  from "../db/models/User.js";
import bcrypt from 'bcrypt';

const setupResponseSession = (res, { refreshToken, refreshTokenValidUntil, _id }) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });
    
    res.cookie("sessionId", _id, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });
};

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

    const session = await createSession(user._id);

    setupResponseSession(res, session);
  
    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        }
    })
};

export const refreshController = async (req, res) => {
    const { refreshToken, sessionId } = req.cookies;

    const currentSession = await findSession({ _id: sessionId, refreshToken });
    if (!currentSession) {
        throw createHttpError(401, "Session not found");
    }
    const refreshTokenExpired = new Date() > new Date(currentSession.refreshTokenValidUntil);
    if (refreshTokenExpired) {
        throw createHttpError(401, "Session expired");
    }
    
    const newSession = await createSession(currentSession.userId);

    setupResponseSession(res, newSession);

    res.status(200).json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: newSession.accessToken,
        }
    });
};

export const logoutController = async (req, res) => {
    const { sessionId } = req.cookies;
    if (!req.cookies.sessionId) {
        throw createHttpError(401, "Session not found");
    }
    await deleteSession({ _id: sessionId });

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw createHttpError(404, "User not found");
    }
    console.log(user);
    const resetToken = jwt.sign({
        sub: user._id,
        email,
    },
        env('JWT_SECRET'),
        { expiresIn: '5m' });
    
    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
        from: env(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });

    res.json({
        message: 'Reset password email was successfully sent!',
        status: 200,
        data: {},
    });
};

export const resetPasswordController = async (req, res) => {
    const { token, password } = req.body;
    let entries;

    try {
        entries = jwt.verify(token, env("JWT_SECRET"));
    } catch (error) {
        if (error instanceof Error) throw createHttpError(401,' Token is expired or invalid.');
        throw error;
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found')
    }

    const encryptedPassword = await bcrypt.hash(password,10);

    await User.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
    )
    res.json({
        message: 'Password was successfilly reset!',
        status: 200,
        data: {},
    });
};