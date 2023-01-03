import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

type Data = {
  message: string;
  readings?: any;
  tariff?: any;
};

const JWT_KEY = process.env.JWT_KEY || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const {
      query: { id },
      method,
    } = req;

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
      case "PUT":
        const tariff = await db.collection("tariff").findOne({});

        const { electricityDay, electricityNight, gas, standingCharge } =
          req.body;

        if (tariff && tariff._id) {
          await db.collection("tariff").updateOne(
            { _id: tariff._id },
            {
              $set: {
                electricityDay,
                electricityNight,
                gas,
                standingCharge,
              },
            }
          );
        } else {
          await db.collection("tariff").insertOne({
            electricityDay,
            electricityNight,
            gas,
            standingCharge,
          });
        }

        return res.status(200).json({
          message: "tariff updated successfully",
        });
      case "GET":
        const readings = (
          await db.collection("readings").find({}).toArray()
        ).map((reading) => ({
          email: reading.email,
          submissionDate: reading.submissionDate,
          dayReading: reading.dayReading,
          nightReading: reading.nightReading,
          gasReading: reading.gasReading,
        }));

        const tarif = await db.collection("tariff").findOne({});
        console.log(readings);
        return res.status(200).json({
          message: "test response",
          readings,
          tariff: tarif,
        });
    }
  } catch (ex) {
    console.error(ex);
  }
}
