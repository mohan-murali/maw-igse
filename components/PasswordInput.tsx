import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import React from "react";

export interface PasswordInputProps {
  id: string;
  required: boolean;
  isError?: boolean;
  validationMessage?: string;
  className?: string;
  label: string;
  showFeedback: boolean;
  value: string;
  onChange: (e: any) => void;
}

export const  PasswordInput: React.FC<PasswordInputProps> =  ({
  id,
  required,
  isError,
  validationMessage,
  className,
  label,
  showFeedback,
  value,
  onChange,
}) => {
  const onTextChange = (e: any) => {
    onChange(e.target.value);
  };

  const header = <h6>Pick a password</h6>;
  const footer = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
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
          header={showFeedback ? header : undefined}
          footer={showFeedback ? footer : undefined}
          onChange={onChange}
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
