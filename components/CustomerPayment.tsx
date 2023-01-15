import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { QrReaderInput } from "./QrReaderInput";

interface CustomerPaymentProps {
  email: string;
  amount: number;
  fetchData: () => void;
}

export const CustomerPayment: React.FC<CustomerPaymentProps> = ({
  email,
  amount,
  fetchData,
}) => {
  const [currentBill, setCurrentBill] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getData = useCallback(async () => {
    try {
      var res = await axios.get("/api/dashboard", {
        headers: {
          token: window.localStorage.getItem("auth-token"),
        },
      });
      if (res.data?.data?.length > 0) {
        const bill = res.data.data.reduce(
          (sum: number, curr: any) => sum + curr.amount,
          0
        );
        setCurrentBill(bill);
      } else {
        setCurrentBill(0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData, amount]);

  const router = useRouter();

  const toast = useRef(null);
  const showSuccess = (message: string, detail: string) => {
    if (toast && toast.current)
      //@ts-ignore
      toast.current.show({
        severity: "success",
        summary: message,
        detail,
        life: 3000,
      });
  };

  const showError = (detail: string) => {
    if (toast && toast.current)
      //@ts-ignore
      toast.current.show({
        severity: "error",
        summary: "There was some Error",
        detail,
        life: 3000,
      });
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log(data);
      const res = await axios.post(
        "/api/customer",
        {
          currentBalance: amount,
          email,
          voucherCode: data.voucherCode,
        },
        {
          headers: {
            token: window.localStorage.getItem("auth-token"),
          },
        }
      );
      console.log(res);
      showSuccess(
        "voucher accepted",
        "your voucher was accepted. Balance updated successfully"
      );
      reset();
      fetchData();
    } catch (e: any) {
      console.error(e);
      showError(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  function ParseFloat(str: any, val: any) {
    str = str.toString();
    str = str.slice(0, str.indexOf(".") + val + 1);
    return Number(str);
  }

  const payBill = async () => {
    try {
      setLoading(true);
      if (currentBill > amount) {
        setError("Your Balance is low. Please top up");
      } else {
        const res = await axios.put(
          "/api/customer",
          {
            currentBalance: ParseFloat(amount - currentBill, 2),
            email,
          },
          {
            headers: {
              token: window.localStorage.getItem("auth-token"),
            },
          }
        );
        console.log(res);
        showSuccess(
          "payment completed",
          "Your bill payment completed successfully"
        );
        fetchData();
      }
    } catch (e: any) {
      console.error(e);
      showError(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  return (
    <div className="flex flex-column">
      <div className="mb-2">
        Welcome <strong>{email}</strong>.
      </div>
      <div className="mb-2">Your current balance is:</div>
      <strong>{amount.toFixed(2)}</strong>
      {currentBill > 0 ? (
        <>
          <div>Your total bill amout is: </div>
          <strong>{currentBill}</strong>
          <Button
            type="button"
            label="Pay"
            loading={loading}
            onClick={payBill}
          />
        </>
      ) : (
        <h6>You have no pending bill</h6>
      )}
      {error && (
        <div id={`validation-help`} className="p-error p-d-block pb-3">
          {error}
        </div>
      )}
      <h6 className="text-center">Top up your balance with Voucher</h6>
      <form className="p-fluid" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="voucherCode"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <QrReaderInput
              id="voucherCode"
              required
              className="field"
              isError={!!errors?.voucherCode?.type}
              maxLength={8}
              validationMessage="voucher code is required"
              label="Voucher Code"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Button
          type="submit"
          icon="pi pi-check"
          iconPos="right"
          label="Submit Voucher"
          loading={loading}
          className="p-mt-2"
        />
      </form>
      <Toast ref={toast} />
    </div>
  );
};
