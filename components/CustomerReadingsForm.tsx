import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { DateInput } from "./DateInput";
import { NumberInput } from "./NumberInput";

export interface CustomerReadingsFormProps {
  email: string;
}

export const CustomerReadingsForm: React.FC<CustomerReadingsFormProps> = ({
  email,
}) => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
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
      data.email = email;
      const res = await axios.post("/api/dashboard", data, {
        headers: {
          token: window.localStorage.getItem("auth-token"),
        },
      });
      console.log(res);
      showSuccess();
      resetFormDetail(data);
    } catch (e) {
      console.error(e);
    }
  };

  const resetFormDetail = (detail?: any) => {
    if (detail) {
      Object.keys(detail).forEach((k) => {
        if (detail[k]) {
          setValue(k, (detail as any)[k], {
            shouldDirty: true,
          });
        }
      });
    }
  };

  return (
    <div className="form-main">
      <form className="p-fluid" onSubmit={handleSubmit(onSubmit)}>
        <DateInput
          className="field"
          id="submissionDate"
          required
          register={register}
          isError={!!errors?.submissionDate?.type}
          validationMessage="submission date is required"
          label="Submission Date"
        />
        <Controller
          name="dayReading"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              className="field"
              id="dayReading"
              label="Meter Reading for Day (in kWh)"
              isError={!!errors?.dayReading?.type}
              validationMessage="meter reading for day is required"
            />
          )}
        />
        <Controller
          name="nightReading"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              className="field"
              id="nightReading"
              label="Meter Reading for Nigh (in kWh)"
              isError={!!errors?.nightReading?.type}
              validationMessage="meter reading for night is required"
            />
          )}
        />
        <Controller
          name="gasReading"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              className="field"
              id="gasReading"
              label="Gas meter reading (in kWh)"
              isError={!!errors?.gasReading?.type}
              validationMessage="gas meter reading is required"
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
