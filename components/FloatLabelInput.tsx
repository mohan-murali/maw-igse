import { InputText } from "primereact/inputtext";
import { FieldValues, UseFormRegister, ValidationRule } from "react-hook-form";

export interface FloatLabelInputProps {
  id: string;
  required: boolean;
  register: UseFormRegister<FieldValues>;
  label: string;
  type?: string;
  isError?: boolean;
  validationPattern?: ValidationRule<RegExp>;
  validationMessage?: string;
  className?:string;
}

export const FloatLabelInput: React.FC<FloatLabelInputProps> = ({
  id,
  required,
  register,
  isError,
  type,
  validationPattern,
  validationMessage,
  label, className
}) => (
    <div className={className}>
    <span className="p-float-label">
      <InputText
        type={type}
        id={id}
        {...register(id, {
          required: required,
          pattern: validationPattern,
        })}
      />
      <label htmlFor={id}>{label}</label>
    </span>
    {required && isError && (
      <small id={`${id}-help`} className="p-error p-d-block">
        {validationMessage}
      </small>
    )}
    </div>
  );

