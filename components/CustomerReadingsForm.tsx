import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { DateInput } from "./DateInput";
import { NumberInput } from "./NumberInput";

export interface CustomerReadingsFormProps {}

export const CustomerReadingsForm: React.FC<CustomerReadingsFormProps> = ({}) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const toast = useRef(null);
  return (
    <div className="form-main">
      <form className="p-fluid grid formgrid" onSubmit={handleSubmit(onSubmit)}>
        <DateInput
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
