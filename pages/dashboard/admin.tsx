import axios from "axios";
import { NextPage } from "next";
import router from "next/router";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminPriceSettingForm, DoughnutChart } from "../../components";
import { AdminShowReadings } from "../../components/AdminShowReadings";

interface Props {
  res: any;
}

const AdminDashboard: NextPage<Props> = ({ res }) => {
  const [tariff, setTariff] = useState();
  const [readings, setReadings] = useState([]);
  const [average, setAverage] = useState();
  const toast = useRef(null);

  console.log(res);
  const showError = (summary: string, message: string) => {
    if (toast && toast.current)
      //@ts-ignore
      toast.current.show({
        severity: "error",
        summary: summary,
        detail: message,
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
      setTariff(res.data.tariff);
      setReadings(res.data.readings);
      setAverage(res.data.average);
    } catch (e: any) {
      if (e.response?.status === 401) {
        router.push("/");
        showError(
          "token expired",
          "the session token of the user expired. You will be logged out"
        );
      } else {
        showError(
          "Somthing wrong with the server",
          "There was some problem with the server. Our team is looking into it"
        );
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
              <AdminPriceSettingForm tariff={tariff} />
            </TabPanel>
            <TabPanel header="Readings">
              <AdminShowReadings readings={readings} />
            </TabPanel>
            <TabPanel header="Statistics">
              <DoughnutChart
                labels={average ? Object.keys(average) : ""}
                data={average ? Object.values(average) : ""}
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
//   const res = await axios.get("/api/admin", {
//     headers: {
//       token: window.localStorage.getItem("auth-token"),
//     },
//   });
//   console.log(res);
//   // Pass data to the page via props
//   return { props: { res } };
// };
