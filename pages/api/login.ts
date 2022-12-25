// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user } from "../../models";

type Data = {
    message: string;
    data?: user;
    token?: string;
};

const JWT_KEY = process.env.JWT_KEY || "";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "you need to send email and password" });
        }

        const client = await clientPromise;
        const db = client.db("test-env");

        const user = await db.collection("customer").findOne({ email: email });

        if (user && user._id) {
            const { userName, email, isAdmin, address } = user;
            const passwordMatched = await bcrypt.compare(
                password as string,
                user.password
            );
            if (passwordMatched) {
                const token = jwt.sign({ userId: user._id }, JWT_KEY, {
                    expiresIn: "24h",
                });

                return res.status(200).json({
                    message: "logged in successfully",
                    data: {
                        userName,
                        email,
                        address,
                        isAdmin,
                    },
                    token,
                });
            } else {
                return res
                    .status(400)
                    .json({ message: "incorrect userid or password" });
            }
        } else {
            return res.status(400).json({ message: "incorrect userid or password" });
        }
    } catch (e) {
        console.error(e);
    }
}
