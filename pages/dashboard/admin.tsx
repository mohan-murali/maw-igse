import axios from "axios";
import { NextPage } from "next";
import router from "next/router";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef } from "react";
import { AdminPriceSettingForm } from "../../components";

interface Props {
  res: any;
}

const AdminDashboard: NextPage<Props> = ({ res }) => {
  const toast = useRef(null);

  console.log(res);
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
      const res = await axios.get("/api/admin", {
        headers: {
          token: window.localStorage.getItem("auth-token"),
        },
      });
      console.log(res);
    } catch (e: any) {
      if (e.response.status === 401) {
        router.push("/");
        showError();
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main>
      <div className="app flex justify-content-center">
        <Card className="flex p-3 shadow-4">
          <h5 className="text-center">Admin Dashboard</h5>
          <TabView>
            <TabPanel header="Set Price">
              <AdminPriceSettingForm />
            </TabPanel>
            <TabPanel header="Readings">This is test</TabPanel>
            <TabPanel header="Statistics">This is test</TabPanel>
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
//   const res = await axios.get("/api/admin", {
//     headers: {
//       token: window.localStorage.getItem("auth-token"),
//     },
//   });
//   console.log(res);
//   // Pass data to the page via props
//   return { props: { res } };
// };
