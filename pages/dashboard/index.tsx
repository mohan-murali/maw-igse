import axios from "axios";
import { NextPage } from "next";
import router from "next/router";
import { Card } from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { CustomerPayment, CustomerReadingsForm } from "../../components";

interface Props {
  res: any;
}

const Dashboard: NextPage<Props> = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/login", {
        headers: {
          token: window.localStorage.getItem("auth-token"),
        },
      });
      console.log(res);
      if (res.data.data.isAdmin) {
        router.push("/dashboard/admin");
      }
      setEmail(res.data.data.email);
      setAmount(res.data.data.balance);
    } catch (e) {
      console.error(e);
    }
  };

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
              <CustomerPayment email={email} amount={amount} />
            </TabPanel>
          </TabView>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;

// export const getServerSideProps: GetServerSideProps = async () => {
//   // Fetch data from external API

//   // Pass data to the page via props
//   return { props: { res } };
// };
