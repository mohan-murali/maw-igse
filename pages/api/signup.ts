// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try{

        const client = await clientPromise;
        const db = client.db("test-env");

        const existingUser = await db
            .collection("customer")
            .find({ email: {$eq: req.body.email}})
            .toArray();

        console.log(existingUser);
        if(existingUser && existingUser.length > 0){
            return res.status(400).json({message: "The email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = await db.collection("customer").insertOne({
            userName: req.body.userName,
            password: hashedPassword,
            email: req.body.email,
            address: req.body.address
        });
        console.log(newUser);
        return res.status(200).json({message: "user created successfully"});

    }catch (e){
        console.error(e);
    }
}
