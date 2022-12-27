import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  DropDownInput,
  FloatLabelInput,
  PasswordInput,
  QrReaderInput,
} from "../components";

const SignUp: NextPage = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const toast = useRef(null);
  const [error, setError] = useState("");

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
      setError("");
      const res = await axios.post("/api/signup", data);
      if (window) {
        window.localStorage.setItem("auth-token", res.data.token);
      }
      router.push("/dashboard");
      showSuccess();
      console.log(res);
    } catch (ex) {
      console.log(ex);
      //@ts-ignore
      setError(ex.response.data.message);
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
          {error && (
            <div id={`validation-help`} className="p-error p-d-block pb-3">
              {error}
            </div>
          )}
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
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <PasswordInput
                  className="field"
                  id="password"
                  required
                  isError={!!errors?.password?.type}
                  validationMessage="Password is required"
                  label="Password"
                  showFeedback
                  value={value}
                  onChange={onChange}
                />
              )}
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
              render={({ field: { value, onChange } }) => (
                <DropDownInput
                  value={value}
                  onChange={onChange}
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
            <FloatLabelInput
              id="numberOfBedroom"
              required
              type="number"
              className="field"
              register={register}
              isError={!!errors?.numberOfBedroom?.type}
              validationMessage="You must enter the number of bedrooms"
              label="Number of bedrooms"
            />
            <Controller
              name="voucherCode"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <QrReaderInput
                  id="voucherCode"
                  required
                  className="field"
                  isError={!!errors?.voucherCode?.type}
                  maxLength={8}
                  validationMessage="voucher code is required"
                  label="Voucher Code"
                  value={value}
                  onChange={onChange}
                />
              )}
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
