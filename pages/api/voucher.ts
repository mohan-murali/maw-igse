import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import validateVoucher from "../../lib/voucherValdiator";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  const client = await clientPromise;
  const db = client.db("test-env");
  switch (method) {
    case "POST":
      if (req.body.voucherCode.length != 8) {
        return res
          .status(400)
          .json({ message: "The voucher code is not valid!" });
      }

      await validateVoucher(req.body.voucherCode);

      const existingVoucher = await db
        .collection("voucher")
        .findOne({ voucherCode: req.body.voucherCode });

      if (existingVoucher && existingVoucher._id) {
        return res
          .status(400)
          .json({ message: "The voucher code already exists" });
      }

      await db.collection("voucher").insertOne({
        voucherCode: req.body.voucherCode,
        isValid: true,
      });

      return res.status(200).json({
        message: "Voucher added successfully",
      });
  }
  try {
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({
      message: e.message,
    });
  }
}
