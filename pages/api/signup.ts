// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from "bcrypt";
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
    const client = await clientPromise;
    const db = client.db("test-env");

    const existingUser = await db
      .collection("customer")
      .find({ email: { $eq: req.body.email } })
      .toArray();

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: "The email already exists" });
    }

    if (req.body.voucherCode.length != 8) {
      return res
        .status(400)
        .json({ message: "The voucher code is not valid!" });
    }

    const existingVoucher = await db
      .collection("voucher")
      .findOne({ voucherCode: req.body.voucherCode });

    if (existingVoucher && existingVoucher._id) {
      return res
        .status(400)
        .json({ message: "The voucher code is not valid!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await db.collection("customer").insertOne({
      userName: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
      address: req.body.address,
      propertyType: req.body.propertyType,
      numberOfBedroom: req.body.numberOfBedroom,
      balance: 200,
      isAdmin: false,
    });

    await db.collection("voucher").insertOne({
      userId: newUser.insertedId,
      voucherCode: req.body.voucherCode,
    });

    const userDetails = await db
      .collection("customer")
      .findOne({ _id: newUser.insertedId });
    const token = jwt.sign({ userId: newUser.insertedId }, JWT_KEY, {
      expiresIn: "24h",
    });
    return res.status(200).json({
      message: "user created successfully",
      data: {
        email: userDetails?.email,
        isAdmin: userDetails?.isAdmin,
      },
      token,
    });
  } catch (e) {
    console.error(e);
  }
}
