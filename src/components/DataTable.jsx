import React, { useState, useEffect } from "react"
import { DataGrid } from "@mui/x-data-grid"
import { Button, Box } from "@mui/material"
import CustomModal from "./CustomModal"

const DataTable = () => {
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  const [rows, setRows] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [columns] = useState([
    { field: "no", headerName: "No", align: "center", headerAlign: "center" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "merk",
      headerName: "Merk",
      flex: 1,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      align: "left",
      headerAlign: "left",
      type: "number",
      editable: true,
      valueFormatter: (params) => {
        return USDollar.format(params)
      },
    },
  ])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/car")
      const jsonData = await response.json()
      const updatedRows = jsonData.map((row, index) => ({
        ...row,
        no: index + 1,
      }))
      setRows(updatedRows)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8080/car/update-batch", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ car: rows }),
      })

      if (response.ok) {
        alert("Changes saved successfully!")
      } else {
        throw new Error("Failed to save changes")
      }
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Failed to save changes")
    }
  }

  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = rows.map((row) =>
      row.carId === oldRow.carId ? newRow : row
    )
    setRows(updatedRows)
    return newRow
  }

  return (
    <Box>
      <CustomModal
        open={openDialog}
        setOpen={setOpenDialog}
        handleNavigate={null}
      />
      <Box mt={2} display='flex' justifyContent='flex-end' mr={10}>
        <Button variant='contained' color='success' onClick={setOpenDialog}>
          Add Data
        </Button>
      </Box>
      <div style={{ margin: "20px" }}>
        <DataGrid
          density='compact'
          getRowId={(row) => row.carId}
          rows={rows}
          columns={columns}
          pageSize={25}
          disableSelectionOnClick
          hideFooter
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </div>
      <Box mt={2} display='flex' justifyContent='flex-end' mr={10}>
        <Button variant='contained' color='primary' onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default DataTable
