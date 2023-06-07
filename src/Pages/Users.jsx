import React from "react";
import { useAuthContext } from "../context/auth";
import userService from "../service/user.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { defaultFilter, RecordsPerPage } from "../utils/constant";
import ConfirmationDialog from "../Components/ConfirmationDialog";
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

function Users() {
   
  const authContext = useAuthContext();
  const [filters, setFilters] = useState(defaultFilter);
  const [userList, setUserList] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.keyword === "") delete filters.keyword;
      getAllUsers({ ...filters });
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const getAllUsers = async (filters) => {
    await userService.getAllUsers(filters).then((res) => {
      if (res) {
        setUserList(res);
      }
    });
  };

  const columns = [
    { id: "firstName", label: "First Name", minWidth: 100 },
    { id: "lastName", label: "Last Name", minWidth: 100 },
    {
      id: "email",
      label: "Email",
      minWidth: 170,
    },
    {
      id: "roleName",
      label: "Role",
      minWidth: 130,
    },
  ];

  const onConfirmDelete = async () => {
    await userService
      .deleteUser(selectedId)
      .then((res) => {
        if (res) {
          toast.success("User Deleted Successfully !");
          setOpen(false);
          setFilters({ ...filters });
        }
      })
      .catch((e) => toast.error("User not deleted, error!"));
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
      Users
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
            {userList?.items?.map((row, index) => (
              <TableRow key={`${index}-${row.id}-${row.email}`}>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
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
                      navigate(`/edit-user/${row.id}`);
                    }}
                  >
                    <b>Edit</b>
                  </Button>
                  {row.id !== authContext.user.id && (<Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => {
                      setOpen(true);
                      setSelectedId(row.id ?? 0);
                    }}
                  >
                    <b>Delete</b>
                  </Button>)}
                </TableCell>
              </TableRow>
            ))}
            {!userList?.items?.length && (
              <TableRow className="TableRow">
                <TableCell colSpan={5} className="TableCell">
                  <Typography align="center" className="noDataText">
                    No Users
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
        count={userList?.totalItems || 0}
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
      title="Delete user"
      description="Are you sure you want to delete this user?"
    />
  </div>
);
}

export default Users;