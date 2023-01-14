import clientPromise from "./mongodb";

export default async function validateVoucher(voucherCode: string) {
  console.log("function called");
  const client = await clientPromise;
  const db = client.db("test-env");

  const validVoucher = await db.collection("voucher").findOne({
    voucherCode,
  });

  if (validVoucher && validVoucher._id) {
    if (validVoucher.isValid) {
      await db.collection("voucher").updateOne(
        { _id: validVoucher._id },
        {
          $set: {
            isValid: false,
          },
        }
      );

      return true;
    }
  }

  return false;
}
