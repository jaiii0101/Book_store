import {
    FormControl,
    Select,
    MenuItem,
    Typography,
    InputLabel,
    TextField,
    Button,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import userService from "../service/user.service";
  import { useAuthContext } from "../context/auth";
  import { useNavigate, useParams } from "react-router-dom";
  import { toast } from "react-toastify";
  import * as Yup from "yup";
  import { Formik } from "formik";

  function EditUser() {
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState();
    const {id} = useParams();
    const navigate = useNavigate();
    const authContext = useAuthContext();
    const initialValues = {
    id: 0,
    email: "",
    lastName: "",
    firstName: "",
    roleId: 3,
  };
    const [initialValueState, setInitialValueState] = useState(initialValues);
    
    useEffect(() => {
        getRoles();
      }, []);
    
    useEffect(() => {
        if (id) {
          getUserById();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [id]);
  
      useEffect(() => {
        if (user && roles.length) {
          const roleId = roles.find((role) => role.name === user?.role)?.id;
          setInitialValueState({
            id: user.id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            roleId,
            password: user.password,
          });
        }
      }, [user, roles]);
    
      const validate = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email address format")
          .required("Email is required"),
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        roleId: Yup.number().required("Role is required"),
      });
    
      const getRoles = () => {
        userService.getAllRoles().then((res) => {
          if (res) {
            setRoles(res);
          }
        });
      };
    
      const getUserById = () => {
        userService.getById(Number(id)).then((res) => {
          if (res) {
            setUser(res);
          }
        });
      };
    
      const onSubmit = (values) => {
        const updatedValue = {
          ...values,
          role: roles.find((r) => r.id === values.roleId).name,
        };
        userService
          .update(updatedValue)
          .then((res) => {
            if (res) {
              toast.success("User updated successfully !");
              navigate("/users");
            }
          })
          .catch((e) => toast.error("Not Updated,error !"));
      };

    return (
        <div className="flex-1 ml-40 mr-40">
          <>
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
          Edit User
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
          </>
        <Formik
          initialValues={initialValueState}
          validationSchema={validate}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit} className="flex-1 ml-40 mr-40">
              <div className="grid grid-cols-2 gap-5 mt-5 ">
                <FormControl fullWidth>
                  <label>First Name*</label>
                  <TextField
                    size="small"
                    type="text"
                    name="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                    sx={{ height: "40px" }}
                  />
                  <div className="text-red-600">
                    {errors.firstName && touched.firstName && errors.firstName}
                  </div>
                </FormControl>
                <FormControl fullWidth>
                  <label>Last Name*</label>
                  <TextField
                    size="small"
                    type="text"
                    name="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                    sx={{ height: "40px" }}
                  />
                  <div className="text-red-600">
                    {errors.lastName && touched.lastName && errors.lastName}
                  </div>
                </FormControl>
                <FormControl fullWidth>
                  <label>Email *</label>
                  <TextField
                    size="small"
                    type="text"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    sx={{ height: "40px" }}
                  />
                  <div className="text-red-600">
                    {errors.email && touched.email && errors.email}
                  </div>
                </FormControl>
                {values.id !== authContext.user.id && (
                  <div className="">
                    <FormControl
                      className="dropdown-wrapper"
                      variant="outlined"
                      disabled={values.id === authContext.user.id}
                    >
                      <InputLabel htmlFor="select">Roles</InputLabel>
                      <Select
                        name="roleId"
                        id={"roleId"}
                        onChange={handleChange}
                        disabled={values.id === authContext.user.id}
                        value={values.roleId}
                      >
                        {roles.length > 0 &&
                          roles.map((role) => (
                            <MenuItem value={role.id} key={"name" + role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                )}
              </div>
              <div className="mt-16">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    color: "white",
                    backgroundColor: "#80BF32",
                    "&:hover": {
                      backgroundColor: "#80BF32",
                    },
                    marginLeft: "8px",
                    width: "100px",
                  }}
                  disableElevation
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/users");
                  }}
                  sx={{
                    color: "white",
                    backgroundColor: "#f14d54",
                    "&:hover": {
                      backgroundColor: "#f14d54",
                    },
                    marginLeft: "8px",
                    width: "100px",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    );
  }
  
  export default EditUser;