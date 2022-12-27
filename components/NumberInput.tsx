import { InputNumber, InputNumberValueChangeParams } from "primereact/inputnumber";
import React from "react";

export interface NumberInputProps{
    id: string;
    required: boolean;
    label: string;
    isError?: boolean;
    validationMessage?: string;
    className?:string;
    value:number;
    placeholder?: string;
    onChange: (e: InputNumberValueChangeParams) => void;
}
export const NumberInput: React.FC<NumberInputProps> = ({
    id,
    required,
    isError,
    validationMessage,
    label, className,
    value,
    onChange,
    placeholder
}) => {
    return(
        <div className={className}>
            <label htmlFor={id}>{label}</label>
            <InputNumber
                inputId={id}
                value={value}
                onValueChange={onChange}
                placeholder={placeholder}
            />
            {required && isError && (
                <small id={`${id}-help`} className="p-error p-d-block">
                    {validationMessage}
                </small>
            )}
        </div>
    )
}