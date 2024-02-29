// import AdminLayout from "../../layouts/AdminLayout"
// import Spreadsheet from "react-spreadsheet";

// const Marketing = () => {
//     const columnLabels = ["FirstName", "LastName", "CellNumber", "Email", "Country"];
//     const data = [
//         [{ value: "" },
//         { value: "" },
//         { value: "" },
//         { value: "" },
//         { value: "" }],

//         [{ value: "" },
//         { value: "" },
//         { value: "" },
//         { value: "" },
//         { value: "" }],

//     ];
//     return (
//         <AdminLayout>
//             <div className="w-50">
//                 <Spreadsheet data={data}
//                     columnLabels={columnLabels}
//                 />
//             </div>
//         </AdminLayout>
//     )
// }

// export default Marketing
// "use strict";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import { AgGridReact } from "ag-grid-react";
// import React, { useState } from "react";

// const CustomButtonComponent = ({ selectedRecord, updateSelectedRecord }) => {
//     console.log(selectedRecord, updateSelectedRecord)
//     return (
//       <button
//         onClick={() => {
//           window.alert("clicked");
//             updateSelectedRecord(selectedRecord);
//         }}
//       >
//         Push Me!
//       </button>
//     );
//   };


// const Marketing = () => {

//     const [rowData, setRowData] = useState([
//         { make: "Tesla", model: "Model Y", price: 64950, electric: true },
//         { make: "Ford", model: "F-Series", price: 33850, electric: false },
//         { make: "Toyota", model: "Corolla", price: 29600, electric: false },
//       ]);
//       const [selectedRecord, setSelectedRecord] = useState(null);

//       const updateSelectedRecord = (record) => {
//         setSelectedRecord(record);
//       };
//       console.log(selectedRecord)
    
//       const onCellClicked = (event) => {
//         if (event.colDef.headerName === "Actions") {
//           // Handle click on the Actions column
//           // You can access the row data using event.data
//           console.log("Selected Record: ", event.data);
//           updateSelectedRecord(event.data);
//         }
//       };
//       // Column Definitions: Defines the columns to be displayed.
//       const [colDefs, setColDefs] = useState([
//         {
//             field: "make",
//             editable: true,
//         },
//         { field: "model", editable: true, },
//         { field: "price", editable: true, },
//         { field: "electric" ,editable: true, },
//         {
//             headerName: "Actions",
//             cellRenderer: CustomButtonComponent,
//             flex: 1,
//             cellRendererParams: {
//               updateSelectedRecord: updateSelectedRecord,
//             },
//           },
//       ]);


     

//   return (
//     <div
//     className="ag-theme-quartz" // applying the grid theme
//     style={{ height: 500 }} // the grid will fill the size of the parent container
//    >
//      <AgGridReact
//          rowData={rowData}
         
//          onCellClicked={onCellClicked}
//          columnDefs={colDefs}
//      />
//    </div>
//   );
// };


// export default Marketing

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import TAButton from '../../components/common/TAButton'

const Marketing = () => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow]=useState({})

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Extract headers
        const headerRow = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
        setHeaders(headerRow);

        // Extract data
        const rowData = XLSX.utils.sheet_to_json(sheet, { header: headerRow });
        setData(rowData);
      };

      reader.readAsBinaryString(selectedFile);
    }
  };
  console.log(selectedRow)

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {file && (
        <div className='d-flex'>
        <div className='d-flex ' style={{width:"60%"}}>
          <h3>Data:</h3>
          <div style={{overflow:"auto", height:"70vh"}}>
          <table className='' style={{ overflow:"auto"}}>
            <thead>
              <tr>
                <th>Sr#</th>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    <td>{rowIndex+1}</td>
                  {headers.map((header, columnIndex) => (
                    <td key={columnIndex}>{row[header]}</td>
                  ))}
                    <td><TAButton handleClick={()=>setSelectedRow(row)}  buttonText={"Select"} /></td>

                </tr>
              ))}
            </tbody>
          </table>
            </div>
        </div>
        <div className='rounded border p-2 m-2 shadow'>
<div className='d-flex ' style={{gap:"5px"}}>
   <div><label>Email</label>
    <input type='text' value={selectedRow.Email} className='form-control' />
    </div> 
    <div><label>Type</label>

    <select type='text' placeholder='Select' className='form-select' >
    <option value={''}>Select</option>
    <option value={'studebt'}>Student</option>
    <option value={'tutor'}>Tutor</option>
    </select>

    </div>
    

</div>
<label>Message</label>

<textarea className='form-control'  placeholder='Type message that you need to send to student or tutor' />
<TAButton buttonText={'Send'} />
        </div>
        </div>
      )}
    </div>
  );
};

export default Marketing;
