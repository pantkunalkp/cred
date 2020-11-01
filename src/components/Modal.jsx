import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import XLSX from "xlsx";
import processRows from "../utils/Processing";
import CircularProgress from "@material-ui/core/CircularProgress";
import StatsCard from "./StatsCard";
import Grid from "@material-ui/core/Grid";
import BackDrop from "./BackDrop";
import { useMutation } from "@apollo/client";
import { ADD_INVOICE } from "../graphQL/Mutaions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({ isOpen, callback, file }) => {
  const [data, setData] = useState(null);
  const [rows, setRows] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [addInvoice] = useMutation(ADD_INVOICE);

  const readFile = () => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: "binary", bookVBA: true });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      await setData(data);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (file) {
      readFile();
    }
  }, [file]);

  useEffect(() => {
    if (rows === null) {
      setRows(processRows(data) ? processRows(data) : null);
      console.log(rows);
    }
  }, [rows, data]);
  const handleClose = () => {
    setData(null);
    setRows(null);
    callback();
  };

  const handleSubmit = async () => {
    setUploading(true);
    await setTimeout(() => {
      Promise.all(
        rows[0].map((invoice) => addInvoice({ variables: { invoice } }))
      )
        .then((result) => {
          setUploaded(true);
          setUploading(false);
          console.log(result);
          setMessage("Great You are Done");
        })
        .catch((e) => {
          setMessage("Some Files Failed to Upload, Please Retry");
        });
    });
  };
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">Statistics</DialogTitle>
      {uploading ? <BackDrop /> : ""}
      <DialogContent>
        {file && data && rows ? (
          <Grid container spacing={2}>
            {Object.entries(rows[1]).map((item) => (
              <Grid item>
                <StatsCard title={item[0]} value={item[1]} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <CircularProgress />
        )}
        {message ? <p>{message}</p> : ""}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={uploaded}
        >
          {uploaded ? "Done" : "Upload"}
        </Button>
        <Button onClick={handleClose} variant="contained" color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
