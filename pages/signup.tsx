import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    DropDownInput,
    FloatLabelInput,
    NumberInput,
    PasswordInput
} from "../components";

const SignUp: NextPage = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const toast = useRef(null);

  const showSuccess = () => {
    if (toast && toast.current)
      //@ts-ignore
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: "Message Content",
        life: 3000,
      });
  };
  const onSubmit = async (data: any) => {
    try {
      console.log(data);
      const res = await axios.post("/api/signup", data);
      if (window) {
        window.localStorage.setItem("auth-token", res.data.token);
      }
      showSuccess();
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };
  const propertyTypes = [
    { name: "Detached", value: "Detached" },
    { name: "Semi-Detached", value: "Semi-Detached" },
    { name: "Terraced", value: "Terraced" },
    { name: "Flat", value: "Flat" },
    { name: "Cottage", value: "Cottage" },
    { name: "Bungalow", value: "Bungalow" },
    { name: "Mansion", value: "Mansion" },
  ];

  return (
    <main>
      <div className="app flex justify-content-center align-items-center">
        <Card className="card flex p-3 shadow-4">
          <h5 className="text-center">Sign Up</h5>
          <form className="p-fluid" onSubmit={handleSubmit(onSubmit)}>
            <FloatLabelInput
              className="field"
              id="email"
              required
              register={register}
              label="Email"
              isError={!!errors?.email?.type}
              validationPattern={
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
              }
              validationMessage={
                errors?.email?.type === "required"
                  ? "Email is not available."
                  : "Invalid Email Format"
              }
            />
            <FloatLabelInput
              className="field"
              id="userName"
              required
              register={register}
              isError={!!errors?.userName?.type}
              validationMessage="User Name is required"
              label="User Name"
            />
            <PasswordInput
              className="field"
              id="password"
              required
              register={register}
              isError={!!errors?.password?.type}
              validationMessage="Password is required"
              label="Password"
              showFeedback
            />
            <FloatLabelInput
              id="address"
              required
              className="field"
              register={register}
              isError={!!errors?.address?.type}
              validationMessage="Address is required"
              label="Address"
            />
            <Controller
              name="propertyType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DropDownInput
                  {...field}
                  required
                  className="field"
                  id="propertyType"
                  placeholder="select property type"
                  optionLabel="name"
                  label="Property Type"
                  options={propertyTypes}
                  isError={!!errors?.propertyType?.type}
                  validationMessage="Property Type is required"
                />
              )}
            />
            <Controller
              name="numberOfBedroom"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  required
                  className="field"
                  id="numberOfBedroom"
                  label="Number of bedrooms"
                  isError={!!errors?.propertyType?.type}
                  validationMessage="Property Type is required"
                />
              )}
            />
            <FloatLabelInput
              id="voucherCode"
              required
              className="field"
              register={register}
              isError={!!errors?.voucherCode?.type}
              maxLength={8}
              validationMessage="voucher code is required"
              label="Voucher Code"
            />
            <div className="flex flex-column">
              <Button
                type="submit"
                icon="pi pi-check"
                iconPos="right"
                label="Sign Up"
                className="my-2"
              />
              <small>
                Already have an account? Click <Link href="/">here</Link> to
                login
              </small>
            </div>
          </form>
        </Card>
        <Toast ref={toast} />
      </div>
    </main>
  );
};
export default SignUp;
