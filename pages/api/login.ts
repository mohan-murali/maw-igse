// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from "bcrypt";
import { ObjectID } from "bson";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
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
    const { method } = req;

    const client = await clientPromise;
    const db = client.db("test-env");

    switch (method) {
      case "POST":
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
          return res
            .status(400)
            .json({ message: "you need to send email and password" });
        }

        const user = await db.collection("customer").findOne({ email: email });

        if (user && user._id) {
          const { email, isAdmin } = user;
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
                email,
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
          return res
            .status(400)
            .json({ message: "incorrect userid or password" });
        }
      case "GET":
        const { token } = req.headers;

        // Check if token is present
        if (!token) {
          return res
            .status(401)
            .json({ message: "No token found. Authorization Denied" });
        }

        const tokenUser = jwt.verify(token as string, JWT_KEY) as any;

        if (!tokenUser || !tokenUser.userId) {
          return res
            .status(401)
            .json({ message: "Invalid token. Access Denied" });
        }

        const userDetails = await db
          .collection("customer")
          .findOne({ _id: new ObjectID(tokenUser.userId) });

        if (userDetails) {
          return res.status(200).json({
            message: "user details found",
            data: {
              email: userDetails.email,
              isAdmin: userDetails.isAdmin,
              balance: userDetails.balance,
            },
          });
        } else {
          return res.status(400).json({
            message: "User not found",
          });
        }
    }
  } catch (e) {
    console.error(e);
  }
}
