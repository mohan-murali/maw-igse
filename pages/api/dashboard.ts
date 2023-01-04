import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

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

    switch (method) {
      case "POST":
        const { email, submissionDate, dayReading, nightReading, gasReading } =
          req.body;
        const prevReadings = await db
          .collection("readings")
          .find({ email })
          .sort({ $natural: -1 })
          .limit(1)
          .toArray();

        if (prevReadings.length > 0) {
          const tariff = await db.collection("tariff").findOne({});
          const reading = prevReadings[0];

          if (
            dayReading < reading.dayReading ||
            nightReading < reading.nightReading ||
            gasReading < reading.gasReading
          ) {
            return res.status(400).json({
              message: " Invalid Readings",
            });
          }

          const currentDate = new Date(submissionDate);
          const prevDate = new Date(reading.submissionDate);
          const timeDifference = currentDate.getTime() - prevDate.getTime();

          const days = timeDifference / (1000 * 3600 * 24);

          const avgDay = dayReading - reading.dayReading;
          const avgNight = nightReading - reading.nightReading;
          const avgGas = gasReading - reading.gasReading;

          const average = await db.collection("average").findOne({ email });

          if (average && average._id) {
            console.log("average found");
            await db.collection("average").updateOne(
              { _id: average._id },
              {
                $set: {
                  email,
                  avgDay,
                  avgNight,
                  avgGas,
                },
              }
            );
          } else {
            console.log("average not found");
            await db.collection("average").insertOne({
              email,
              avgDay,
              avgNight,
              avgGas,
            });
          }

          if (tariff && days > 0) {
            const totalBill =
              avgDay * tariff.electricityDay +
              avgNight * tariff.electricityNight +
              avgGas * tariff.gas +
              days * tariff.standingCharge;

            console.log(totalBill);
            await db.collection("bills").insertOne({
              email,
              amount: totalBill,
              isPaid: false,
            });
          }
        }

        await db.collection("readings").insertOne({
          email,
          submissionDate,
          dayReading,
          nightReading,
          gasReading,
        });

        return res.status(200).json({
          message: "test",
        });
      case "GET":
        const userDetails = await db
          .collection("customer")
          .findOne({ _id: new ObjectId(tokenUser.userId) });

        if (userDetails) {
          const unpaidBills = await db
            .collection("bills")
            .find({ email: { $eq: userDetails.email }, isPaid: { $eq: false } })
            .toArray();

          console.log(unpaidBills);

          return res.status(200).json({
            message: "success",
            data: unpaidBills,
          });
        } else {
          return res.status(400).json({
            message: "User not found",
          });
        }
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
