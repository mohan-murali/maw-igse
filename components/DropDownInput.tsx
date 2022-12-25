import React, {useState} from "react";
import {FieldValues, UseFormRegister} from "react-hook-form";
import {Dropdown, DropdownChangeParams} from "primereact/dropdown";
import {SelectItemOptionsType} from "primereact/selectitem";

export interface DropDownInputProps{
    id: string;
    required: boolean;
    isError?: boolean;
    validationMessage?: string;
    className?:string;
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
    onChange
}) => (
        <div className={className}>
            <Dropdown
                options={options}
                optionLabel={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {required && isError && (
                <small id={`${id}-help`} className="p-error p-d-block">
                    {validationMessage}
                </small>
            )}
        </div>
    )
