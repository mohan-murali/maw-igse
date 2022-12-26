import { Divider } from 'primereact/divider';
import { Password } from "primereact/password";
import React, { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

export interface PasswordInputProps {
  id: string;
  required: boolean;
  register: UseFormRegister<FieldValues>;
  isError?: boolean;
  validationMessage?: string;
  className?: string;
  label: string;
  showFeedback:boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  required,
  isError,
  validationMessage,
  register,
  className,
  label,
  showFeedback
}) => {
  const [value, setValue] = useState("");
  const onTextChange = (e: any) => {
    setValue(e.target.value);
  };

  const header = <h6>Pick a password</h6>;
    const footer = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

  return (
    <div className="field">
      <span className="p-float-label">
        <Password
          id={id}
          toggleMask
          feedback={showFeedback}
          className={className}
          value={value}
          header={showFeedback? header : undefined}
          footer={showFeedback? footer : undefined}
          {...register(id, {
            required,
            onChange: onTextChange,
          })}
        />
        <label htmlFor={id} className={isError ? "p-error" : ""}>
          {label}
        </label>
      </span>
      {required && isError && (
        <small id={`${id}-help`} className="p-error p-d-block">
          {validationMessage}
        </small>
      )}
    </div>
  );
};
