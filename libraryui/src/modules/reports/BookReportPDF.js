import React, { Fragment, useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";

const BookReportPDF = (props) => {
  //   const styles = StyleSheet.create({
  //     table: {
  //       width: "100%",
  //     },
  //     row: {
  //       display: "flex",
  //       flexDirection: "row",
  //       borderTop: "1px solid #EEE",
  //       paddingTop: 8,
  //       paddingBottom: 8,
  //     },
  //     headerStyle: {
  //       display: "flex",
  //       flexDirection: "row",
  //       borderTop: "1px solid #EEE",
  //       paddingTop: 8,
  //       paddingBottom: 8,
  //       fontWeight: "bold",
  //     },
  //     header: {
  //       borderTop: "none",
  //     },
  //     bold: {
  //       fontWeight: "bold",
  //     },
  //     // So Declarative and unDRY 👌
  //     row1: {
  //       width: "27%",
  //     },
  //     row2: {
  //       width: "15%",
  //     },
  //     row3: {
  //       width: "15%",
  //     },
  //     row4: {
  //       width: "20%",
  //     },
  //     row5: {
  //       width: "27%",
  //     },
  //     image: {
  //       marginVertical: 15,
  //       marginHorizontal: 100,
  //     },
  //   });

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      color: "black",
      padding: 10,
    },
    section: {
      margin: 10,
      padding: 10,
    },
    viewer: {
      width: "100%", //the pdf viewer will take up all of the width and height
      height: window.innerHeight,
    },
    headerStyle: {
      display: "flex",
      flexDirection: "row",
      padding: 8,
      fontWeight: "bold",
      fontSize: "11px",
      backgroundColor: "#ee0e0e",
    },
    table: {
      width: "100%",
      fontSize: "11px",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      borderTop: "1px solid #EEE",
      paddingTop: 8,
      paddingBottom: 8,
    },
    header: {
      borderTop: "none",
    },
    bold: {
      fontWeight: "bold",
    },
    // So Declarative and unDRY 👌
    row1: {
      width: "30%",
      fontSize: "11px",
    },
    row2: {
      width: "15%",
      fontSize: "11px",
    },
    row3: {
      width: "15%",
      fontSize: "11px",
    },
    row4: {
      width: "20%",
      fontSize: "11px",
    },
    row5: {
      width: "27%",
      fontSize: "11px",
    },
    image: {
      width: "50px",
      marginRight: "2px",
      //   height: "50px",
    },
  });

  const [doc, setDoc] = useState(null);

  return (
    <div>
      <PDFViewer style={styles.viewer}>
        {/* Start of the document*/}
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={[styles.table]}>
              <View style={styles.headerStyle}>
                <Text style={styles.row1}>Name</Text>
                <Text style={styles.row2}>Author</Text>
                <Text style={styles.row3}>Publication</Text>
                <Text style={styles.row4}>Shelf</Text>
                <Text style={styles.row5}>parent Shelf</Text>
              </View>
            </View>
            {props.books.map((row, i) => (
              <View key={i} style={styles.row} wrap={false}>
                <Image
                  style={styles.image}
                  src={`assets/bookImages/${
                    row.bookImage !== "" ? row.bookImage : "book.png"
                  }`}
                ></Image>
                <Text style={styles.row1}>{row.bookNameInEnglish}</Text>
                <Text style={styles.row2}>{row.author}</Text>
                <Text style={styles.row3}>{row.publication}</Text>
                <Text style={styles.row4}>{row.shelfName}</Text>
                <Text style={styles.row5}>{row.parentShelfName}</Text>
              </View>
            ))}
          </Page>
        </Document>
      </PDFViewer>
      {doc}
    </div>
  );
};

BookReportPDF.propTypes = {};

export default BookReportPDF;
