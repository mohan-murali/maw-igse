import { InputText } from "primereact/inputtext";
import { FieldValues, UseFormRegister, ValidationRule } from "react-hook-form";
import {useState} from "react";

export interface FloatLabelInputProps {
  id: string;
  required: boolean;
  register: UseFormRegister<FieldValues>;
  label: string;
  type?: string;
  isError?: boolean;
  validationPattern?: ValidationRule<RegExp>;
  validationMessage?: string;
  maxLength?:number;
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
  maxLength,
  label, className
}) => {
  const [value, setValue] = useState("");
  const onTextChange = (e:any)=>{
    if(maxLength){
      const text = e.target.value;
      if(text.length < maxLength){
        setValue(text)
      }
    } else {
      setValue(e.target.value);
    }
  }
  return (
      <div className={className}>
        <span className="p-float-label">
          <InputText
              type={type}
              id={id}
              value={value}
              {...register(id, {
                required: required,
                pattern: validationPattern,
                maxLength: maxLength,
                onChange: onTextChange
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
  )
};

