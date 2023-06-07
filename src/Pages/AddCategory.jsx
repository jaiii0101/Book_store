import {
    Button,
    FormControl,
    TextField,
    Typography,
  } from "@mui/material";
  import { Formik } from "formik";
  import React, { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { toast } from "react-toastify";
  import * as Yup from "yup";
  import categoryService from "../service/category.service";

  function AddCategory() {

    const { id } = useParams();
    const initialValues = { name: ""};
    const [initialValuestate, setInitialValueState] = useState(initialValues);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (id) getCategoryById();
      },[id]);
  
    const getCategoryById = () => {
      categoryService.getById(Number(id)).then((res) => {
        setInitialValueState({
          id: res.id,
          name: res.name,
        });
      });
    };
  
    const validate = Yup.object({
      name: Yup.string().required("Category name is required"),
     });
  
    const onSubmit = (values) => {
      categoryService
        .save(values)
        .then(() => {
          toast.success(
            values.id
              ? "Record update successfully"
              : "Record creates successfully"
          );
          navigate("/categories");
        })
        .catch(() => toast.error("Recored update fail"));
    };

    return (
      <div className="flex-1 ml-40 mr-40">
        {id ? (
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
          Edit Category
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
        ) : (
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
          Add Category
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
        )}
        <Formik
          initialValues={initialValuestate}
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
            setFieldValue,
            setFiledError,
          }) => (
            <form onSubmit={handleSubmit} className="flex-1 ml-40 mr-40">
              <div className="grid grid-cols-2 gap-5 mt-5 ">
                <FormControl fullWidth>
                  <label>Category Name*</label>
                  <TextField
                    size="small"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    sx={{ height: "40px" }}
                  />
                  <div className="text-red-600">
                    {errors.name && touched.name && errors.name}
                  </div>
                </FormControl>
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
                    navigate("/categories");
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
  
  export default AddCategory;