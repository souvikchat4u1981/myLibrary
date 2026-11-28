import React, { Fragment, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Chart from "react-apexcharts";
import { pdf } from "@react-pdf/renderer";
import {
  DELETE_READING_LOG,
  GET_ALL_BOOKS,
  GET_READING_LOGS,
  SAVE_READING_LOG,
} from "../../queries/BookQueries";
import CustomLoader from "../../lib/customLoader/CustomLoader";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../lib/toastMessage/Toastmessage";
import ReadingCalendarPDF, {
  compressImageToDataUrl,
} from "./ReadingCalendarPDF";
import "./reading.scss";

const todayStr = () => new Date().toISOString().slice(0, 10);
const toYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const ReadingTracker = () => {
  const [logs, setLogs] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeMonth, setActiveMonth] = useState(todayStr().slice(0, 7)); // YYYY-MM
  const [selectedDay, setSelectedDay] = useState(""); // YYYY-MM-DD or ""
  const [showAllMonths, setShowAllMonths] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [exporting, setExporting] = useState(false);

  // Entry form state
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [readingId, setReadingId] = useState(0);
  const [bookSearch, setBookSearch] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [readingDate, setReadingDate] = useState(todayStr());
  const [status, setStatus] = useState("Reading");
  const [notes, setNotes] = useState("");

  const { loading: logsLoading, refetch } = useQuery(GET_READING_LOGS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getReadingLogs && !data.getReadingLogs.failure) {
        setLogs(data.getReadingLogs.readingList || []);
      }
    },
    onError: (err) => console.log(err),
  });

  const { loading: booksLoading } = useQuery(GET_ALL_BOOKS, {
    fetchPolicy: "cache-first",
    onCompleted: (data) => {
      if (
        data?.getAllBooksWithAuthorAndShelf &&
        !data.getAllBooksWithAuthorAndShelf.failure
      ) {
        setBooks(data.getAllBooksWithAuthorAndShelf.bookList || []);
      }
    },
    onError: (err) => console.log(err),
  });

  const [saveReadingLog, { loading: saving }] = useMutation(SAVE_READING_LOG, {
    onCompleted: (data) => {
      if (data?.saveReadingLog && !data.saveReadingLog.failure) {
        SuccessMessage(readingId > 0 ? "Reading log updated" : "Reading log added");
        resetForm();
        setShowEntryForm(false);
        refetch();
      } else {
        ErrorMessage(data?.saveReadingLog?.message || "Failed to save");
      }
    },
    onError: (err) => {
      console.log(err);
      ErrorMessage("Error saving reading log");
    },
  });

  const [deleteReadingLog, { loading: deleting }] = useMutation(
    DELETE_READING_LOG,
    {
      onCompleted: (data) => {
        if (data?.deleteReadingLog && !data.deleteReadingLog.failure) {
          SuccessMessage("Reading log deleted");
          refetch();
        } else {
          ErrorMessage(data?.deleteReadingLog?.message || "Delete failed");
        }
      },
      onError: (err) => console.log(err),
    }
  );

  const resetForm = () => {
    setReadingId(0);
    setSelectedBookId("");
    setBookSearch("");
    setReadingDate(selectedDay || todayStr());
    setStatus("Reading");
    setNotes("");
  };

  const openNewEntry = () => {
    resetForm();
    setShowEntryForm(true);
  };

  const openEditEntry = (item) => {
    setReadingId(item.readingId);
    setSelectedBookId(String(item.bookId));
    setBookSearch(item.bookNameInEnglish || item.bookName || "");
    setReadingDate(item.readingDate || todayStr());
    setStatus(item.status || "Reading");
    setNotes(item.notes || "");
    setShowEntryForm(true);
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!selectedBookId) {
      ErrorMessage("Please select a book");
      return;
    }
    saveReadingLog({
      variables: {
        readingId: readingId || 0,
        bookId: Number(selectedBookId),
        readingDate,
        status,
        notes,
      },
    });
  };

  const matchingBooks = useMemo(() => {
    const q = bookSearch.trim().toLowerCase();
    if (!q) return books.slice(0, 60);
    return books
      .filter(
        (b) =>
          (b.bookName || "").toLowerCase().includes(q) ||
          (b.bookNameInEnglish || "").toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q)
      )
      .slice(0, 60);
  }, [books, bookSearch]);

  const dateCountMap = useMemo(() => {
    const map = {};
    logs.forEach((l) => {
      if (l.readingDate) {
        map[l.readingDate] = (map[l.readingDate] || 0) + 1;
      }
    });
    return map;
  }, [logs]);

  const visibleLogs = useMemo(() => {
    const q = searchParam.trim().toLowerCase();
    return logs.filter((l) => {
      if (selectedDay && l.readingDate !== selectedDay) return false;
      if (!selectedDay && !showAllMonths && !(l.readingDate || "").startsWith(activeMonth)) {
        return false;
      }
      if (!q) return true;
      return (
        (l.bookName || "").toLowerCase().includes(q) ||
        (l.bookNameInEnglish || "").toLowerCase().includes(q) ||
        (l.author || "").toLowerCase().includes(q) ||
        (l.publication || "").toLowerCase().includes(q) ||
        (l.status || "").toLowerCase().includes(q) ||
        (l.notes || "").toLowerCase().includes(q)
      );
    });
  }, [logs, selectedDay, showAllMonths, activeMonth, searchParam]);

  const monthLabel = useMemo(() => {
    if (selectedDay) return selectedDay;
    if (showAllMonths) return "All Months";
    const [y, m] = activeMonth.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [activeMonth, selectedDay, showAllMonths]);

  const readingChartData = useMemo(() => {
    const monthMap = {};
    logs.forEach((l) => {
      if (!l.readingDate) return;
      const ym = l.readingDate.slice(0, 7);
      if (!monthMap[ym]) monthMap[ym] = { completed: 0, reading: 0 };
      if (l.status === "Completed") monthMap[ym].completed += 1;
      else monthMap[ym].reading += 1;
    });
    const months = Object.keys(monthMap).sort().slice(-12);
    return {
      months,
      series: [
        {
          name: "Completed",
          data: months.map((m) => monthMap[m].completed),
        },
        {
          name: "Reading",
          data: months.map((m) => monthMap[m].reading),
        },
      ],
      options: {
        chart: {
          type: "bar",
          stacked: true,
          toolbar: { show: false },
          background: "transparent",
          fontFamily: "Inter, sans-serif",
        },
        colors: ["#10b981", "#6366f1"],
        plotOptions: {
          bar: { borderRadius: 6, columnWidth: "48%" },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: months,
          labels: { style: { colors: "#94a3b8", fontSize: "11px" } },
        },
        yaxis: {
          allowDecimals: false,
          title: { text: "Books", style: { color: "#94a3b8" } },
          labels: {
            style: { colors: "#94a3b8" },
            formatter: (v) => Math.round(v),
          },
        },
        grid: { borderColor: "rgba(148,163,184,0.15)" },
        legend: { labels: { colors: "#94a3b8" } },
        tooltip: { theme: "dark" },
      },
    };
  }, [logs]);

  const handleExportPDF = async () => {
    if (visibleLogs.length === 0) {
      ErrorMessage("No reading entries to export");
      return;
    }
    setExporting(true);
    try {
      const itemsWithThumbs = await Promise.all(
        visibleLogs.map(async (item) => {
          const imgFile =
            item.bookImage && item.bookImage !== "" ? item.bookImage : "book.png";
          const imgUrl = `${process.env.PUBLIC_URL}/assets/bookImages/${imgFile}`;
          const compressedThumb = await compressImageToDataUrl(imgUrl, 72, 100, 0.62);
          return { ...item, compressedThumb };
        })
      );

      const blob = await pdf(
        <ReadingCalendarPDF
          items={itemsWithThumbs}
          periodLabel={monthLabel}
          appName={window.Configs?.applicationName || "My Library"}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Reading_Calendar_${monthLabel.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      SuccessMessage("Compressed PDF downloaded");
    } catch (err) {
      console.error(err);
      ErrorMessage("Failed to generate PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Fragment>
      {(logsLoading || booksLoading || saving || deleting || exporting) && (
        <CustomLoader />
      )}

      {/* ── Hero Header ── */}
      <div className="glass-hero">
        <div>
          <div className="glass-hero-eyebrow">
            <i className="fa-solid fa-calendar-check"></i>
            Reading Tracker & Calendar
          </div>
          <h1 className="glass-hero-title">Reading Calendar</h1>
          <p className="glass-hero-sub">
            Log daily reading sessions, browse by month, and export a compact PDF.
          </p>
        </div>

        <div className="d-flex flex-column align-items-stretch align-items-lg-end gap-3 flex-grow-1">
          <div className="glass-stat-row justify-content-lg-end">
            <div className="glass-stat-chip">
              <div className="stat-icon">
                <i className="fa-solid fa-book-open-reader"></i>
              </div>
              <div>
                <div className="stat-value">{visibleLogs.length}</div>
                <div className="stat-label">{monthLabel}</div>
              </div>
            </div>

            <div className="glass-stat-chip">
              <div className="stat-icon">
                <i className="fa-solid fa-check-double"></i>
              </div>
              <div>
                <div className="stat-value">
                  {logs.filter((l) => l.status === "Completed").length}
                </div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-lg-end w-100">
            <div className="glass-search-wrap">
              <i className="fa fa-search glass-search-icon"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search book, author, publisher..."
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value)}
              />
              {searchParam && (
                <button
                  type="button"
                  className="glass-search-clear"
                  onClick={() => setSearchParam("")}
                  title="Clear search"
                >
                  <i className="fa fa-times"></i>
                </button>
              )}
            </div>

            <input
              type="month"
              className="form-control"
              style={{ width: "auto" }}
              value={activeMonth}
              onChange={(e) => {
                setActiveMonth(e.target.value);
                setSelectedDay("");
                setShowAllMonths(false);
              }}
            />

            <button
              type="button"
              className={`saas-toolbar-btn ${showAllMonths ? "primary" : ""}`}
              onClick={() => {
                setShowAllMonths(!showAllMonths);
                setSelectedDay("");
              }}
            >
              {showAllMonths ? "Selected Month" : "All Months"}
            </button>

            <button
              type="button"
              className="saas-toolbar-btn"
              onClick={handleExportPDF}
            >
              <i className="fa-solid fa-file-pdf text-danger"></i>
              Export PDF
            </button>

            <button
              type="button"
              className="saas-toolbar-btn primary"
              onClick={openNewEntry}
            >
              <i className="fa fa-plus"></i>
              Log Reading
            </button>
          </div>
        </div>
      </div>

      {/* ── Entry Screen (Frosted Panel) ── */}
      {showEntryForm && (
        <form className="reading-entry-card mb-4" onSubmit={handleSaveEntry}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-bold">
              <i className="fa-solid fa-pen-to-square me-2 golden-text"></i>
              {readingId > 0 ? "Edit Reading Entry" : "New Reading Entry"}
            </h5>
            <button
              type="button"
              className="saas-toolbar-btn"
              onClick={() => setShowEntryForm(false)}
            >
              <i className="fa fa-times"></i>
            </button>
          </div>

          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label">Search & Select Book *</label>
              <input
                type="text"
                className="form-control form-control-sm mb-2"
                placeholder="Type book name or author to filter..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
              />
              <select
                className="form-select form-select-sm"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                required
              >
                <option value="">-- Select Book --</option>
                {matchingBooks.map((b) => (
                  <option key={b.bookId} value={b.bookId}>
                    {b.bookName}
                    {b.bookNameInEnglish ? ` (${b.bookNameInEnglish})` : ""} —{" "}
                    {b.author}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Reading Date *</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Status</label>
              <select
                className="form-select form-select-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="saas-toolbar-btn primary w-100 justify-content-center">
                <i className="fa fa-save"></i>
                {readingId > 0 ? "Update" : "Save"}
              </button>
            </div>

            <div className="col-12">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Notes (e.g., Chapter 1-4, thoughts...)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </form>
      )}

      {/* ── Reading Graph (Monthly Progress) ── */}
      {readingChartData.months.length > 0 && (
        <div className="card p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
            <h6 className="mb-0 fw-bold">
              <i className="fa-solid fa-chart-simple me-2 golden-text"></i>
              Monthly Reading Progress
            </h6>
            <span className="saas-badge">
              {readingChartData.months.length} Month(s)
            </span>
          </div>
          <Chart
            options={readingChartData.options}
            series={readingChartData.series}
            type="bar"
            height={230}
          />
        </div>
      )}

      {/* ── Display Screen: Calendar + Monthly Book List ── */}
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="reading-calendar-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold">
                <i className="fa-regular fa-calendar me-2 golden-text"></i>
                Calendar View
              </h6>
              {selectedDay && (
                <button
                  type="button"
                  className="saas-toolbar-btn"
                  style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}
                  onClick={() => setSelectedDay("")}
                >
                  Show Full Month
                </button>
              )}
            </div>

            <Calendar
              className="glass-calendar"
              value={selectedDay ? new Date(selectedDay) : new Date(`${activeMonth}-01`)}
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) {
                  setActiveMonth(toYmd(activeStartDate).slice(0, 7));
                  setSelectedDay("");
                  setShowAllMonths(false);
                }
              }}
              onClickDay={(val) => {
                const ymd = toYmd(val);
                setSelectedDay(selectedDay === ymd ? "" : ymd);
                setShowAllMonths(false);
              }}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;
                const count = dateCountMap[toYmd(date)];
                return count ? (
                  <span className="calendar-dot-badge" title={`${count} book(s)`}>
                    {count}
                  </span>
                ) : null;
              }}
            />
          </div>
        </div>

        <div className="col-lg-8">
          <div className="tableContainer table-scroll-fixed">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Reading Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      No reading entries for {monthLabel}. Click &quot;Log Reading&quot; to add one!
                    </td>
                  </tr>
                )}
                {visibleLogs.map((item) => (
                  <tr key={item.readingId}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                            item.bookImage && item.bookImage !== ""
                              ? item.bookImage
                              : "book.png"
                          }`}
                          alt={item.bookName}
                          style={{
                            width: "40px",
                            height: "54px",
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `${process.env.PUBLIC_URL}/assets/bookImages/book.png`;
                          }}
                        />
                        <div>
                          <div className="fw-semibold">{item.bookName}</div>
                          {item.bookNameInEnglish && (
                            <small className="text-muted">
                              {item.bookNameInEnglish}
                            </small>
                          )}
                          {item.notes && (
                            <div className="small text-muted fst-italic">
                              {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{item.author}</td>
                    <td>{item.publication}</td>
                    <td>{item.readingDate}</td>
                    <td>
                      <span
                        className={`saas-badge ${
                          item.status === "Completed" ? "text-success" : ""
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <span
                          className="saas-action-icon text-success"
                          title="Edit"
                          onClick={() => openEditEntry(item)}
                        >
                          <i className="fa fa-pen"></i>
                        </span>
                        <span
                          className="saas-action-icon text-danger"
                          title="Delete"
                          onClick={() =>
                            deleteReadingLog({
                              variables: { readingId: item.readingId },
                            })
                          }
                        >
                          <i className="fa fa-trash"></i>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReadingTracker;
