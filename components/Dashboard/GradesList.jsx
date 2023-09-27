/*
 * Created By: JABER Mohamad,Moetassem Chebbo
 * Project: SIS Application
 * File: components\Admin\StudentsList.js
 * École Supérieure des Affaires (ESA)
 * Copyright (c) 2023 ESA
 */

import React, { useEffect } from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import axios from "axios";
import selection_data from "../../utilities/selection_data";

import { useSession } from "next-auth/react";
import CustomPagination from "./Pagination";


const GradeList = () => {
  const [pageSize, setPageSize] = useState(10);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();

  setTimeout(() => {
    setMessage("");
  }, selection_data.message_disapear_timing);

  const columns = [
    {
        //   field: "student_id",
          headerName: "Student ID",
          headerAlign: "center",
          align: "center",
          width: 150,
    
        },

    {
    //   field: "student_firstname",
      headerName: "First Name",
      headerAlign: "center",
      align: "center",
      width: 150,

    },
    {
        //   field: "student_lastname",
          headerName: "Last Name",
          headerAlign: "center",
          align: "center",
          width: 150,
    
        },



    {
    //   field: "course_id",
      headerName: "Course ID",
      headerAlign: "center",
      align: "center",
      width: 120,
    },

    {
    //   field: "grade",
      headerName: "Grades",
      headerAlign: "center",
      align: "center",
      width: 150,
      
    },
    {
      field: "action",
      headerName: "Action",
      width: `${(session?.user.role === "2" || session?.user.role === "3") ? 300 : 150}`,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            className="primary-button hover:text-white"

            // disabled={params.id !== presentEnable}
            type="button"
            hidden={
              session.user.role === "1" || session.user.role === "0"
                ? true
                : false
            }
          >
            Edit
          </button>      
        </div>
      ),
    },
  ];



  return (
    <>
      <div className="text-center text-red-500 font-bold p-2">{message}</div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          getRowId={1}
          rows={1}
          getRowHeight={() => "auto"}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
         
          rowsPerPageOptions={[5, 10, 15, 20]}

          checkboxSelection
      
          disableSelectionOnClick
      
          components={{
            NoRowsOverlay: () => (
              <div className="grid h-[100%] place-items-center">No Data</div>
            ),
            Pagination: CustomPagination,
          }}
        />
      </Box>

      <div className="grid lg:grid-cols-1 p-5 shadow-sm">

      </div>
    </>
  );
};

export default GradeList;
