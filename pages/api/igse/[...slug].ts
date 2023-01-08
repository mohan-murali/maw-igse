import jwt, { TokenExpiredError } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

type Data = {
  message?: string;
  type?: string;
  bedroom?: string;
  ["average_electricity_gas_cost_per_day"]?: number;
  unit?: string;
};

const JWT_KEY = process.env.JWT_KEY || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { slug } = req.query;
    const [propertyType, numberOfBedroom] = slug as string[];

    console.log(propertyType, numberOfBedroom);
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

    const average = await db
      .collection("average")
      .find({ propertyType, numberOfBedroom })
      .toArray();
    console.log(average);
    let totalEnergyCost = 0;
    let totalDays = 0;
    for (let val of average) {
      totalEnergyCost =
        totalEnergyCost + val.avgDay + val.avgNight + val.avgGas;
      totalDays = totalDays + val.days;
    }

    return res.status(200).json({
      type: propertyType,
      bedroom: numberOfBedroom,
      ["average_electricity_gas_cost_per_day"]: totalEnergyCost / totalDays,
      unit: "pound",
    });
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
