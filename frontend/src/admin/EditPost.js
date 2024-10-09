import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../components/moduleToolbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = yup.object({
  title: yup
    .string("Add a post title")
    .min(4, "Text content should have a minimum of 4 characters")
    .required("Post title is required"),
  content: yup
    .string("Add text content")
    .min(10, "Text content should have a minimum of 10 characters")
    .required("Text content is required"),
});

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      title,
      content,
      image: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      updatePost(values);
      actions.resetForm();
    },
  });

  const singlePostById = async () => {
    try {
      const { data } = await axios.get(`/api/post/${id}`);
      setTitle(data.post.title);
      setContent(data.post.content);
      setImagePreview(data.post.image.url);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching post");
    }
  };

  useEffect(() => {
    singlePostById();
  });

  const updatePost = async (values) => {
    try {
      const { data } = await axios.put(`/api/update/post/${id}`, values);
      if (data.success) {
        toast.success("Post updated");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating post");
    }
  };

  return (
    <Box sx={{ bgcolor: "white", padding: "20px 200px" }}>
      <Typography variant="h5" sx={{ pb: 4 }}>
        {" "}
        Edit post{" "}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <TextField
          sx={{ mb: 3 }}
          fullWidth
          id="title"
          label="Post title"
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && Boolean(errors.title)}
          helperText={touched.title && errors.title}
        />
        <ReactQuill
          theme="snow"
          placeholder="Write the post content..."
          modules={modules}
          value={values.content}
          onChange={(e) => setFieldValue("content", e)}
        />
        <Dropzone
          acceptedFiles=".jpg,.jpeg,.png"
          multiple={false}
          onDrop={(acceptedFiles) =>
            acceptedFiles.map((file) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = () => {
                setFieldValue("image", reader.result);
              };
            })
          }
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <Box {...getRootProps()} sx={{ border: "2px dashed blue", p: 2 }}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop here!</p>
              ) : (
                <p>Drag and drop an image here, or click to select one</p>
              )}
              {values.image && (
                <img
                  src={values.image || imagePreview}
                  alt=""
                  style={{ maxWidth: "100px" }}
                />
              )}
            </Box>
          )}
        </Dropzone>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Update post
        </Button>
      </Box>
    </Box>
  );
};

export default EditPost;
