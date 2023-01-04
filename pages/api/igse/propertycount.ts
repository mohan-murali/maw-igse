import jwt, { TokenExpiredError } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

type Data = {
  message: string;
  count?: {
    detached: number;
    semiDetached: number;
    terraced: number;
    flat: number;
    cottage: number;
    bungalow: number;
    mansion: number;
  };
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

    const userToken = jwt.verify(token as string, JWT_KEY) as any;

    console.log(userToken);
    if (!userToken || !userToken.userId) {
      return res.status(401).json({ message: "Invalid token. Access Denied" });
    }

    switch (method) {
      case "GET":
        let detached = 0;
        let semiDetached = 0;
        let terraced = 0;
        let flat = 0;
        let cottage = 0;
        let bungalow = 0;
        let mansion = 0;

        const customers = await db.collection("customer").find({}).toArray();

        for (let i = 0; i < customers.length; i++) {
          console.log(customers[i]);
          if (customers[i].propertyType) {
            switch (customers[i].propertyType) {
              case "Detached":
                detached = detached + 1;
                break;
              case "Semi-Detached":
                semiDetached = semiDetached + 1;
                break;
              case "Terraced":
                terraced = terraced + 1;
                break;
              case "Flat":
                flat = flat + 1;
                break;
              case "Cottage":
                cottage = cottage + 1;
                break;
              case "Bungalow":
                bungalow = bungalow + 1;
                break;
              case "Mansion":
                mansion = mansion + 1;
                break;
            }
          }
        }

        return res.status(200).json({
          message: "success",
          count: {
            detached,
            semiDetached,
            terraced,
            flat,
            cottage,
            bungalow,
            mansion,
          },
        });
    }
  } catch (ex: any) {
    if (ex instanceof TokenExpiredError) {
      return res.status(401).json({
        message: ex.message,
      });
    }
    console.error(ex);
    return res.status(500).json({
      message: ex.message,
    });
  }
}
