import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

type Data = {
  message: string;
};

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

        console.log("body of the req is ->", req.body);

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

          if (tariff && days > 0) {
            const totalBill =
              (dayReading - reading.dayReading) * tariff.electricityDay +
              (nightReading - reading.nightReading) * tariff.electricityNight +
              (gasReading - reading.gasReading) * tariff.gas +
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
    }
  } catch (ex) {
    console.error(ex);
  }
}
