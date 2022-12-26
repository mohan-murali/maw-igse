import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { SelectItemOptionsType } from "primereact/selectitem";
import React from "react";

export interface DropDownInputProps{
    id: string;
    required: boolean;
    isError?: boolean;
    validationMessage?: string;
    className?:string;
    optionLabel:string;
    label:string;
    placeholder:string;
    options?: SelectItemOptionsType;
    value: any;
    onChange: (e:DropdownChangeParams)=>void;
}
export const DropDownInput: React.FC<DropDownInputProps>=({
    id,
    required,
    isError,
    validationMessage,
    className,
    label,
    placeholder,
    options,
    value,
    optionLabel,
    onChange
}) => (
        <div className={className}>
            <span className="p-float-label">
            <Dropdown
                id={id}
                options={options}
                optionLabel={optionLabel}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
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
