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

    console.log(method);

    switch(method){
        case "PUT":
            const tariff = await db
            .collection("tariff")
            .findOne({_id: req.body.id});

            const { electricityDay, electricityNight, gas, standingCharge} = req.body;

            if(tariff && tariff._id){
                await db.collection("tariff")
                .updateOne({_id : req.body.id},
                    {
                        $set: {
                            electricityDay,
                            electricityNight,
                            gas,
                            standingCharge
                        }
                    }
                    )
            } else {
                await db.collection("tariff").insertOne({
                    electricityDay,
                    electricityNight,
                    gas,
                    standingCharge
                })
            }

            return res.status(200)
            .json({
                message: "tariff updated successfully"
            });
        case "GET":
            return res.status(200)
            .json({
                message: "test response"
            });
    }
  } catch (ex) {
    console.error(ex);
  }
}
