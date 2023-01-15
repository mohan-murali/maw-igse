import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import validateVoucher from "../../lib/voucherValdiator";

type Data = {
  message: string;
  data?: any;
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

    const { token } = req.headers;

    // Check if token is present
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token found. Authorization Denied" });
    }

    const tokenUser = jwt.verify(token as string, JWT_KEY) as any;

    if (!tokenUser || !tokenUser.userId) {
      return res.status(401).json({ message: "Invalid token. Access Denied" });
    }

    const { email, currentBalance, voucherCode } = req.body;
    switch (method) {
      case "PUT":
        console.log("body of the req is ->", req.body);

        //update customers balance
        await db.collection("customer").updateOne(
          { email },
          {
            $set: { balance: parseFloat(currentBalance) },
            $currentDate: { lastModified: true },
          }
        );

        //update the bill to paid
        await db.collection("bills").updateMany(
          { email, isPaid: false },
          {
            $set: { isPaid: true },
            //@ts-ignore
            $currentDate: { lastModified: true },
          }
        );

        return res.status(200).json({
          message: "payment completed",
        });

      case "POST":
        const isValidVoucher = await validateVoucher(voucherCode);
        if (!isValidVoucher) {
          return res.status(401).json({
            message: "voucher code is not valid",
          });
        }

        const balance = parseFloat(currentBalance);

        const result = await db.collection("customer").updateOne(
          { email },
          {
            $set: { balance: balance + 200 },
            $currentDate: { lastModified: true },
          }
        );

        console.log(result);

        return res.status(200).json({
          message: "balance updated",
        });
    }
  } catch (ex) {
    console.error(ex);
  }
}
