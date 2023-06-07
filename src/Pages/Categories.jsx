import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  TextField,
  Button,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { defaultFilter, RecordsPerPage } from "../utils/constant";
import categoryService from "../service/category.service";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import { toast } from "react-toastify";
function Categories() {
  const [filters, setFilters] = useState(defaultFilter);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const navigate = useNavigate();
  const [categoryRecords, setCategoryRecords] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });

  useEffect(() => {
    getAllCategories();
  }, []);
  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const searchAllCategories = (filters) => {
    categoryService.getAll(filters).then((res) => {
      setCategoryRecords(res);
    });
  };
  // console.log("Catt : ", bookRecords);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      searchAllCategories({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  // console.log(bookRecords);
  const columns = [{ id: "Category", label: "Category Name", minWidth: 100  }];

  const onConfirmDelete = () => {
    categoryService
      .deleteCategory(selectedId)
      .then((res) => {
        toast.success(" Category deleted SUCESSFULLY");
        setOpen(false);
        setFilters({ ...filters, pageIndex: 1 });
      })
      .catch((e) => toast.error("FAIL TO DELETE"));
  };
  return (
    <div className="flex-1 ml-40 mr-40">
    <Typography
    variant="h4"
    sx={{
      marginTop: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      color: "#474747",
    }}
  >
    Categories
  </Typography>
  <center>
          <hr
            style={{
              background: "red",
              color: "red",
              borderColor: "red",
              height: "4px",
              marginInline: "30px",
              width: "200px",
            }}
          />
        </center>
  <div className="flex justify-end mt-11">
  <TextField
    name="text"
    placeholder="Search..."
    variant="outlined"
    size="small"
    onChange={(e) => {
      setFilters({
        ...filters,
        keyword: e.target.value,
        pageIndex: 1,
      });
    }}
    sx={{ width: "280px" }}
  />
  <Button
    variant="contained"
    sx={{
      color: "white",
      backgroundColor: "#f14d54",
      "&:hover": {
        backgroundColor: "#f14d54",
      },
      marginLeft: "8px",
      width: "100px",
    }}
    onClick={() => {
      navigate("/add-category");
    }}
  >
    ADD
  </Button>
</div>
<div className="mt-8">
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              style={{ minWidth: column.minWidth }}
            >
              {column.label}
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody sx={{ marginTop: "20px" }}>
        {categoryRecords?.items?.map((row, index) => (
          <TableRow key={row.id}>
            <TableCell>
              {row.name}
            </TableCell>
            <TableCell
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => {
                  navigate(`/add-category/${row.id}`);
                }}
              >
                <b>Edit</b>
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => {
                  setOpen(true);
                  setSelectedId(row.id ?? 0);
                }}
              >
                <b>Delete</b>
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {!categoryRecords.items.length && (
          <TableRow className="TableRow">
            <TableCell colSpan={5} className="TableCell">
              <Typography align="center" className="noDataText">
                No Categories
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
</div>
<div className="mt-10 mb-10 flex justify-end">
  <TablePagination
    rowsPerPageOptions={RecordsPerPage}
    component="div"
    count={categoryRecords.totalItems}
    rowsPerPage={filters.pageSize || 0}
    page={filters.pageIndex - 1}
    onPageChange={(e, newPage) => {
      setFilters({ ...filters, pageIndex: newPage + 1 });
    }}
    onRowsPerPageChange={(e) => {
      setFilters({
        ...filters,
        pageIndex: 1,
        pageSize: Number(e.target.value),
      });
    }}
  />
</div>
<ConfirmationDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={() => onConfirmDelete()}
  title="Delete category"
  description="Are you sure you want to delete this category?"
/>
</div>
  );
}

export default Categories;