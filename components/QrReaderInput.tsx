import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { QrReader } from "react-qr-reader";

export interface QrReaderInputProps {
  id: string;
  required: boolean;
  label: string;
  type?: string;
  isError?: boolean;
  validationMessage?: string;
  maxLength?: number;
  className?: string;
  value: string;
  onChange: (e:any) => void;
}

export const QrReaderInput: React.FC<QrReaderInputProps> = ({
  id,
  required,
  isError,
  type,
  validationMessage,
  maxLength,
  label,
  className,
  value,
  onChange
}) => {
  const [showQrReader, setShowQrReader] = useState(false);
  const lastResult = useRef()
  const onTextChange = (e: any) => {
    if (maxLength) {
      const text = e.target.value;
      if (text.length < maxLength) {
        onChange(text);
      }
    } else {
        onChange(e.target.value);
    }
  };

  const onReadResult = (result:any, error:any) => {
    if (!!result) {
        //@ts-ignore
        if (result?.text) {
          //@ts-ignore
          if (lastResult.current === result.text) {
            return
          }
          lastResult.current = result.text;
          onChange(result?.text);
          setShowQrReader(false);
        }
      }

      if (!!error) {
        console.info(error);
      }
  }

  return (
    <div className={`${className}`}>
      <span className="p-float-label">
        <InputText
          type={type}
          id={id}
          value={value}
          onChange={onTextChange}
        />
        <label htmlFor={id}>{label}</label>
      </span>
      <Button
        type="button"
        label="Scan QR"
        className="p-button-info p-button-text"
        onClick={(e) => setShowQrReader(true)}
      />
      {required && isError && (
        <small id={`${id}-help`} className="p-error p-d-block">
          {validationMessage}
        </small>
      )}
      {showQrReader && (
        <QrReader
          constraints={{
            facingMode: "user",
          }}
          onResult={onReadResult}
        />
      )}
    </div>
  );
};
