import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import Button from "../button/Button";

const ExportExcel = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const createDownLoadData = () => {
    handleExport().then((url) => {
      console.log(url);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", props.fileName + ".xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };

    const wbout = XLSX.write(workbook, wopts);

    // The application/octet-stream MIME type is used for unknown binary files.
    // It preserves the file contents, but requires the receiver to determine file type,
    // for example, from the filename extension.
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });

    return blob;
  };

  const s2ab = (s) => {
    // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
    // create an ArrayBuffer with a size in bytes
    const buf = new ArrayBuffer(s.length);

    console.log(buf);

    //create a 8 bit integer array
    const view = new Uint8Array(buf);

    console.log(view);
    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; ++i) {
      // console.log(s.charCodeAt(i));
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const titleCase = (str) => {
    str = str.replaceAll("_", " ");
    return str.split(" ").map(capitalize).join(" ");
  };

  const capitalize = (str) => {
    if (str.length === 0) return str;
    return str[0].toUpperCase() + str.substr(1);
  };

  const GetExcelColumnName = (num) => {
    for (var ret = "", a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
  };

  const handleExport = () => {
    const title = "";
    if (props.reportHeader)
      title = [{ A: props.reportHeader || "Excel Report" }, {}];

    //Forming headers
    let keys = Object.keys(data[0]);
    let i = 1;
    let headers = {};
    keys.forEach((m) => {
      headers[GetExcelColumnName(i)] = titleCase(m);

      i++;
    });
    let table1 = [];
    table1.push(headers);

    data.forEach((row) => {
      //   const studentDetails = row.STUDENT_DETAILS;
      //   const marksDetails = row.MARKS;
      i = 1;
      let r = {};
      keys.forEach((m) => {
        let val = "";
        if (Array.isArray(row[m])) {
          val = row[m].toString();
        } else if (row[m] === null) {
          val = "";
        } else {
          if (row[m].constructor.name === "Object") {
            val = row[m].value;
          } else val = row[m].toString();
        }
        r[GetExcelColumnName(i)] = val;
        i++;
      });

      table1.push(r);
      i++;
    });
    let finalData = [];
    if (props.reportHeader) finalData = [...title, ...table1];
    else finalData = [...table1];

    console.log(finalData);

    //create a new workbook
    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, props.sheetName || "Sheet1");

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.

    const workbookBlob = workbook2blob(wb);
    let dataInfo = {};
    if (props.reportHeader) {
      dataInfo = {
        titleCell: "A2",
        titleRange: "A1:" + GetExcelColumnName(keys.length) + "2",
        tbodyRange: `A3:${GetExcelColumnName(keys.length)}${finalData.length}`,
        theadRange: `A3:${GetExcelColumnName(keys.length)}3`,
      };
    } else {
      dataInfo = {
        tbodyRange: `A1:${GetExcelColumnName(keys.length)}${finalData.length}`,
        theadRange: `A1:${GetExcelColumnName(keys.length)}1`,
      };
    }

    return addStyle(workbookBlob, dataInfo, data);
  };

  const addStyle = (workbookBlob, dataInfo, data) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: "Calibri",
          fontSize: 11,
          verticalAlignment: "center",
        });
        let keys = Object.keys(data[0]);
        let i = 1;
        keys.forEach((m) => {
          sheet.column(GetExcelColumnName(i)).width(15);
          i++;
        });

        //Set Width of cell
        if (props.reportHeader) {
          sheet.range(dataInfo.titleRange).merged(true).style({
            bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        }

        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            horizontalAlignment: "left",
          });
        }
        //Header Style

        sheet.range(dataInfo.theadRange).style({
          fill: "006bb6",
          bold: true,
          fontColor: "ffffff",
          horizontalAlignment: "center",
        });

        //Record cell border
        sheet.range(dataInfo.tbodyRange).style({
          border: true,
          borderStyle: "thin",
        });

        // if (dataInfo.tFirstColumnRange) {
        //   sheet.range(dataInfo.tFirstColumnRange).style({
        //     bold: true,
        //   });
        // }

        // if (dataInfo.tLastColumnRange) {
        //   sheet.range(dataInfo.tLastColumnRange).style({
        //     bold: true,
        //   });
        // }
        let row = 2;
        data.forEach((m) => {
          let col = 1;
          let cols = Object.entries(m);
          console.log(cols);
          cols.forEach((m1) => {
            if (m1[1].constructor.name === "Object") {
              console.log(m1[1]);
              const cell = sheet.row(row).cell(col);
              let keys = Object.keys(m1[1]);

              let stl = {};
              keys.forEach((m2) => {
                if (m2 === "backGround") {
                  stl["fill"] = m1[1]["backGround"];
                }
                if (m2 === "alignment") {
                  stl["horizontalAlignment"] = m1[1]["alignment"];
                  stl["verticalAlignment"] = "center";
                }
                if (m2 === "fontColor") {
                  stl["fontColor"] = m1[1]["fontColor"];
                }
                if (m2 === "bold") {
                  stl["bold"] = m1[1]["bold"];
                }
                if (m2 === "fontSize") {
                  stl["fontSize"] = m1[1]["fontSize"];
                }
              });
              cell.style({ ...stl });
            }
            col++;
          });
          row++;
        });
      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  return (
    <Button
      onClick={() => {
        createDownLoadData();
      }}
    >
      <i className="fa fa-download me-1"></i>
      {props.buttonText ? props.buttonText : "Download"}
    </Button>
  );
};

ExportExcel.propTypes = {
  sheetName: PropTypes.string,
  reportHeader: PropTypes.string,
  data: PropTypes.array,
  fileName: PropTypes.string,
  buttonText: PropTypes.string,
};

export default ExportExcel;
