import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 24,
    fontSize: 9,
    color: "#1e293b",
  },
  header: {
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#4f46e5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e1b4b",
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eef2ff",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontWeight: "bold",
    color: "#312e81",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: "#e2e8f0",
  },
  colThumb: { width: "10%" },
  colDate: { width: "14%" },
  colName: { width: "28%", paddingRight: 6 },
  colAuthor: { width: "18%", paddingRight: 6 },
  colPub: { width: "18%", paddingRight: 6 },
  colStatus: { width: "12%" },
  thumb: {
    width: 28,
    height: 38,
    borderRadius: 3,
    objectFit: "cover",
  },
  bookTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#0f172a",
  },
  bookSub: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  statusBadge: {
    fontSize: 8,
    color: "#4338ca",
    backgroundColor: "#eef2ff",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    textAlign: "center",
  },
  footer: {
    marginTop: 12,
    textAlign: "right",
    fontSize: 8,
    color: "#94a3b8",
  },
});

/**
 * Resize and compress any book cover image URL into a lightweight JPEG data URL
 * so the exported PDF stays compact even with many thumbnails.
 */
export const compressImageToDataUrl = (src, maxW = 72, maxH = 100, quality = 0.62) =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const w = Math.max(1, Math.round(img.width * ratio));
        const h = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

const ReadingCalendarPDF = ({ items, periodLabel, appName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{appName || "My Library"} - Reading Log</Text>
          <Text style={styles.subtitle}>Period: {periodLabel}</Text>
        </View>
        <Text style={styles.subtitle}>Total Entries: {items.length}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.colThumb}>Cover</Text>
        <Text style={styles.colDate}>Date</Text>
        <Text style={styles.colName}>Book Name</Text>
        <Text style={styles.colAuthor}>Author</Text>
        <Text style={styles.colPub}>Publisher</Text>
        <Text style={styles.colStatus}>Status</Text>
      </View>

      {items.map((item) => (
        <View key={item.readingId} style={styles.row} wrap={false}>
          <View style={styles.colThumb}>
            {item.compressedThumb ? (
              <Image src={item.compressedThumb} style={styles.thumb} />
            ) : (
              <Text>-</Text>
            )}
          </View>
          <Text style={styles.colDate}>{item.readingDate}</Text>
          <View style={styles.colName}>
            <Text style={styles.bookTitle}>
              {item.bookNameInEnglish || item.bookName}
            </Text>
            {item.bookNameInEnglish && item.bookName !== item.bookNameInEnglish && (
              <Text style={styles.bookSub}>{item.bookName}</Text>
            )}
          </View>
          <Text style={styles.colAuthor}>{item.author || "-"}</Text>
          <Text style={styles.colPub}>{item.publication || "-"}</Text>
          <View style={styles.colStatus}>
            <Text style={styles.statusBadge}>{item.status || "Reading"}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} (Compressed Thumbnails)
      </Text>
    </Page>
  </Document>
);

export default ReadingCalendarPDF;
