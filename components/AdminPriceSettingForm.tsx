import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumberInput } from "./NumberInput";

export interface AdminPriceSettingFormprops {}

export const AdminPriceSettingForm: React.FC<
  AdminPriceSettingFormprops
> = ({}) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
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
      const res = await axios.post("/api/admin", data);
      showSuccess();
      console.log(res);
      if (window) {
        window.localStorage.setItem("auth-token", res.data.token);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="form-main">
      <form className="p-fluid" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="electricityDay"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              className="field"
              id="electricityDay"
              isDecimal
              label="Electricity rate for day"
              isError={!!errors?.electricityDay?.type}
              validationMessage="Electricity for day is required"
            />
          )}
        />
        <Controller
          name="electricityDay"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              className="field"
              id="electricityDay"
              isDecimal
              label="Electricity rate for night"
              isError={!!errors?.electricityDay?.type}
              validationMessage="Electricity for night is required"
            />
          )}
        />
        <Controller
          name="gas"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              className="field"
              id="gas"
              isDecimal
              label="Gas rate"
              isError={!!errors?.gas?.type}
              validationMessage="gas rate is required"
            />
          )}
        />
        <Controller
          name="standingCharge"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              className="field"
              id="standingCharge"
              isDecimal
              label="Standing Charge"
              isError={!!errors?.standingCharge?.type}
              validationMessage="Standing charge is required"
            />
          )}
        />
        <Button
          type="submit"
          icon="pi pi-check"
          iconPos="right"
          label="Submit Reading"
          className="p-mt-2"
        />
      </form>
      <Toast ref={toast} />
    </div>
  );
};