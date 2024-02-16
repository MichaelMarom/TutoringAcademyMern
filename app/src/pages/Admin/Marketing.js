import AdminLayout from "../../layouts/AdminLayout"
import Spreadsheet from "react-spreadsheet";

const Marketing = () => {
    const columnLabels = ["FirstName", "LastName", "CellNumber", "Email", "Country"];
    const data = [
        [{ value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" }],

        [{ value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" }],

    ];
    return (
        <AdminLayout>
            <div className="w-50">
                <Spreadsheet data={data}
                    columnLabels={columnLabels}
                />
            </div>
        </AdminLayout>
    )
}

export default Marketing