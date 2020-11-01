import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";
import Modal from "./components/Modal.jsx";
import SheetJSFT from "./utils/AcceptedFormats";

function App() {
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      await setFile(acceptedFiles[0]);
      await setOpen(true);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="app">
      <div {...getRootProps({ className: "drop-area" })}>
        <input {...getInputProps({ accept: SheetJSFT })} />
        {isDragActive ? (
          <h1>Great! You can drop the click now</h1>
        ) : (
          <h1>Drag or Browse Your File!</h1>
        )}
      </div>
      <Modal isOpen={open} callback={() => setOpen(false)} file={file} />
    </div>
  );
}

export default App;
