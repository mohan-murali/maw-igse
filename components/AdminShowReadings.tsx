import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

interface AdminShowReadingsProps {
  readings: any;
}

export const AdminShowReadings: React.FC<AdminShowReadingsProps> = ({
  readings,
}) => {
  const dateBodyTemplate = (rowData: any) => {
    console.log(rowData);
    return new Date(rowData.submissionDate).toDateString();
  };
  return (
    <DataTable value={readings} stripedRows responsiveLayout="scroll">
      <Column field="email" header="Email" sortable></Column>
      <Column
        field="submissionDate"
        header="Submission Date"
        body={dateBodyTemplate}
        sortable
      ></Column>
      <Column
        field="dayReading"
        header="Electricity Reading (day)"
        sortable
      ></Column>
      <Column
        field="nightReading"
        header="Electricity Reading (night)"
        sortable
      ></Column>
      <Column field="gasReading" header="Gas Reading " sortable></Column>
    </DataTable>
  );
};
