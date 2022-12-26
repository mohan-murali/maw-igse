import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FloatLabelInput, PasswordInput } from "../components";

const Login: NextPage = () => {
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
      const res = await axios.post("/api/login", data);
      if (window) {
        window.localStorage.setItem("auth-token", res.data.token);
      }
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <main>
      <div className="app flex justify-content-center align-items-center">
        <Card className="card flex p-3 shadow-4">
          <h5 className="text-center">Login</h5>
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
            <PasswordInput
              className="field"
              id="password"
              required
              register={register}
              isError={!!errors?.password?.type}
              validationMessage="Password is required"
              label="Password"
              showFeedback={false}
            />
            <div className="flex flex-column">
              <Button
                type="submit"
                icon="pi pi-check"
                iconPos="right"
                label="Login"
                className="my-2"
              />
              <small>
                Don&apos;t have an account yet? Click{" "}
                <Link href="/signup">here</Link> to sign up
              </small>
            </div>
          </form>
        </Card>
        <Toast ref={toast} />
      </div>
    </main>
  );
};

export default Login;
