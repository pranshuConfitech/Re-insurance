
import React, { useEffect, useState } from "react";

import { IconButton, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";

import PdfReview from "./pdf.preview";

const DocumentModal = ({ document, onClose, baseDocumentURL }:{ document:any, onClose:any, baseDocumentURL:any }) => {
  //   const classes = useStyles();

  return (
    <Modal
      open={Boolean(document)}
      onClose={onClose}

      //   className={classes.modal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div>
        <IconButton

          //   className={classes.closeButton}
          edge="end"
          sx={{ width: "50px", height: "50px" }}

          //   color="white"
          onClick={onClose}
          aria-label="close"
        >
          <Close
            sx={{
              width: "50px",
              height: "50px",
              color: "white",
            }}
          />
        </IconButton>
        {document && RenderPreview(document, baseDocumentURL)}
      </div>
    </Modal>
  );
};

const RenderPreview = (document:any, baseDocumentURL:any) => {
  const { docFormat, documentName } = document;
  const completeURL = `${baseDocumentURL}${documentName}`;
  const [img, setImg] = useState<any>();

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const res = await fetch(completeURL, {
          headers: {
            Authorization: `Bearer ${(window as any).getToken?.()}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const file = await res.blob();

        setImg(URL.createObjectURL(file));
      } catch (error) {
        alert('Failed to fetch the image');

        // Handle the error (e.g., display a fallback image or show an error message)
      }
    };

    fetchImg();
  }, []);

  if (docFormat.split("/")[0] === "image") {
    return (
      <img
        src={img} // Complete URL for images
        // src={encodeURI(completeURL)} // Complete URL for images
        alt="Document Preview"
        style={{
          width: "100%",
          height: "80vh",
          objectFit: "contain",
        }}
      />
    );
  } else if (docFormat === "application/pdf") {
    return (
      <div
        style={{
          width: "80vw",
          height: "80vh",
          objectFit: "contain",
        }}
      >
        <PdfReview url={completeURL} onClick={(e:any) => e.stopPropagation()} />;
      </div>
    );
  } else {
    return null;
  }
};

export default DocumentModal;
