import axios from "axios";
import { NextPage } from "next";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { FloatLabelInput } from "../components";

const Login:NextPage=()=>{
    const {
        control,
        handleSubmit,
        register,
        formState: {errors},
    } = useForm();

    const toast = useRef(null);

    const showSuccess = () => {
      if(toast && toast.current)
      //@ts-ignore
      toast.current.show({severity:'success', summary: 'Success Message', detail:'Message Content', life: 3000});
    }

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

    return(
        <main>
            <div className="app flex justify-content-center align-items-center">
                <Card className="card flex p-3 shadow-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex pb-3">
                            <FloatLabelInput
                                className="pr-3"
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
                                className="pr-3"
                                id="password"
                                type="password"
                                required
                                register={register}
                                isError={!!errors?.password?.type}
                                validationMessage="Password is required"
                                label="Password"
                            />
                        </div>
                        <Button
                            type="submit"
                            icon="pi pi-check"
                            iconPos="right"
                            label="Sign Up"
                            className="p-mt-2"
                        />
                    </form>
                </Card>
                <Toast ref={toast}/>
            </div>
        </main>
    )
}

export default Login;