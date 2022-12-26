import { InputNumber, InputNumberValueChangeParams } from "primereact/inputnumber";
import React from "react";

export interface NumberInputProps{
    id: string;
    required: boolean;
    label: string;
    isError?: boolean;
    validationMessage?: string;
    className?:string;
    value:number,
    onChange: (e: InputNumberValueChangeParams) => void;
}
export const NumberInput: React.FC<NumberInputProps> = ({
    id,
    required,
    isError,
    validationMessage,
    label, className,
    value,
    onChange
}) => {
    return(
        <div className={className}>
            <label htmlFor={id}>{label}</label>
            <InputNumber
                inputId={id}
                value={value}
                onValueChange={onChange}
            />
            {required && isError && (
                <small id={`${id}-help`} className="p-error p-d-block">
                    {validationMessage}
                </small>
            )}
        </div>
    )
}