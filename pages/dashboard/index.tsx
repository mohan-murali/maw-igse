import { NextPage } from "next";
import { TabPanel, TabView } from 'primereact/tabview';
import { CustomerReadingsForm } from "../../components";

const Dashboard: NextPage=()=>{
    return(
        <div className="card">
            <h5>Customer Dashboard</h5>
            <TabView>
                <TabPanel header="Readings">
                    <CustomerReadingsForm />
                </TabPanel>
                <TabPanel header="Payment">
                    Payment related info
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Dashboard;