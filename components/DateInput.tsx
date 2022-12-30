import { Calendar } from "primereact/calendar";
import { FieldValues, UseFormRegister } from "react-hook-form";

export interface DateInputProps {
  id: string;
  required: boolean;
  register: UseFormRegister<FieldValues>;
  label: string;
  isError?: boolean;
  validationMessage?: string;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  id,
  required,
  register,
  isError,
  validationMessage,
  label,
  className,
}) => {
  return (
    <div className={`${className}`}>
      <label htmlFor={id}>{label}</label>
      <Calendar
        id="icon"
        {...register(id, {
          required,
        })}
        showIcon
      />
      {required && isError && (
        <small id={`${id}-help`} className="p-error p-d-block">
          {validationMessage}
        </small>
      )}
    </div>
  );
};
