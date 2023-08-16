import React, { useEffect } from "react";
import { ReactReader } from "react-reader";
import PropTypes from "prop-types";
import { useState } from "react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const BookReader = (props) => {
  const [locallocation, setLocation] = useState(null);
  const location = useLocation();
  const [page, setPage] = useState("");
  const renditionRef = useRef(null);
  const tocRef = useRef(null);
  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);

    // if (renditionRef.current && tocRef.current) {
    //   const { displayed, href } = renditionRef.current.location.start;
    //   const chapter = tocRef.current.find((item) => item.href === href);
    //   setPage(
    //     `Page ${displayed.page} of ${displayed.total} in chapter ${
    //       chapter ? chapter.label : "n/a"
    //     }`
    //   );
    // }
  };

  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (location.state && location.state.data) {
      if (!location.state.data.digitalFileName.includes(".epub")) {
        let uris = [
          {
            uri: `${process.env.PUBLIC_URL}/assets/epubs/${location.state.data.digitalFileName}`,
          }, // Local File
        ];
        setDocs(uris);
      }
    }
  }, [location.state]);

  const navigate = useNavigate();
  return (
    <Fragment>
      <div className="p-2 pt-3 row d-flex">
        <i
          className="fa fa-circle-left fa-2x hand golden-text"
          onClick={() => navigate(-1)}
          title="back to home"
        ></i>
      </div>

      <div style={{ height: "80vh" }}>
        {location.state &&
          location.state.data &&
          location.state.data.digitalFileName.includes(".epub") && (
            <ReactReader
              location={locallocation}
              locationChanged={locationChanged}
              // getRendition={(rendition) => (renditionRef.current = rendition)}
              // tocChanged={(toc) => (tocRef.current = toc)}
              url={`${process.env.PUBLIC_URL}/assets/epubs/${location.state.data.digitalFileName}`}
            />
          )}
        {location.state &&
          location.state.data &&
          !location.state.data.digitalFileName.includes(".epub") && (
            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
          )}
      </div>
      {/* <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          left: "1rem",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {page}
      </div> */}
    </Fragment>
  );
};

BookReader.propTypes = {};

export default BookReader;
