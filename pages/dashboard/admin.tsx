import axios from "axios";
import { NextPage } from "next";
import router from "next/router";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomerPayment, CustomerReadingsForm } from "../../components";

interface Props {
  res: any;
}

const AdminDashboard: NextPage<Props> = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [token, setToken] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    const authToken = window.localStorage.getItem("auth-token");
    if (authToken) {
      setToken(authToken);
    } else {
      router.push("/");
      showError();
    }
  }, []);

  const showError = () => {
    if (toast && toast.current)
      //@ts-ignore
      toast.current.show({
        severity: "error",
        summary: "Token Invalid",
        detail: "Your session is invalid or timed out. Redirecting to login",
        life: 3000,
      });
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get("/api/login", {
        headers: {
          token,
        },
      });
      console.log(res);
      if (res.data.data.isAdmin) {
        router.push("/dashboard/admin");
      }
      setEmail(res.data.data.email);
      setAmount(res.data.data.balance);
    } catch (e: any) {
      if (e.response.status === 401) {
        router.push("/");
        showError();
      }
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main>
      <div className="app flex justify-content-center">
        <Card className="flex p-3 shadow-4">
          <h5 className="text-center">Customer Dashboard</h5>
          <TabView>
            <TabPanel header="Readings">
              <CustomerReadingsForm email={email} />
            </TabPanel>
            <TabPanel header="Payment">
              <CustomerPayment
                email={email}
                amount={amount}
                fetchData={fetchData}
              />
            </TabPanel>
          </TabView>
        </Card>
        <Toast ref={toast} />
      </div>
    </main>
  );
};

export default AdminDashboard;

// export const getServerSideProps: GetServerSideProps = async () => {
//   // Fetch data from external API

//   // Pass data to the page via props
//   return { props: { res } };
// };
