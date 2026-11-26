import React, { Fragment, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Chart from "react-apexcharts";
import {
  GET_ALL_BOOKS,
  UPDATE_BOOK_PURCHASE_DATE,
} from "../../queries/BookQueries";
import CustomLoader from "../../lib/customLoader/CustomLoader";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../lib/toastMessage/Toastmessage";

const formatCurrency = (val) =>
  `₹${Number(val || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const PurchaseList = () => {
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("report"); // report | list
  const [groupBy, setGroupBy] = useState("month"); // date | month | year
  const [searchParam, setSearchParam] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // all | dated | missing
  const [monthFilter, setMonthFilter] = useState(""); // YYYY-MM

  const { loading, refetch } = useQuery(GET_ALL_BOOKS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (
        data?.getAllBooksWithAuthorAndShelf &&
        !data.getAllBooksWithAuthorAndShelf.failure
      ) {
        setBooks(data.getAllBooksWithAuthorAndShelf.bookList || []);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const [updatePurchaseDate, { loading: updating }] = useMutation(
    UPDATE_BOOK_PURCHASE_DATE,
    {
      onCompleted: (data) => {
        if (
          data?.updateBookPurchaseDate &&
          !data.updateBookPurchaseDate.failure
        ) {
          SuccessMessage("Purchase date updated");
          refetch();
        } else {
          ErrorMessage(
            data?.updateBookPurchaseDate?.message || "Update failed"
          );
        }
      },
      onError: (err) => {
        console.log(err);
        ErrorMessage("Error updating purchase date");
      },
    }
  );

  const handleDateChange = (bookId, newDate) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.bookId === bookId ? { ...b, purchaseDate: newDate } : b
      )
    );
    updatePurchaseDate({
      variables: { bookId, purchaseDate: newDate || "" },
    });
  };

  const filteredBooks = useMemo(() => {
    const q = searchParam.trim().toLowerCase();
    return books
      .filter((m) => {
        if (dateFilter === "dated" && !m.purchaseDate) return false;
        if (dateFilter === "missing" && m.purchaseDate) return false;
        if (
          monthFilter &&
          (!m.purchaseDate || !m.purchaseDate.startsWith(monthFilter))
        ) {
          return false;
        }
        if (!q) return true;
        return (
          (m.bookName || "").toLowerCase().includes(q) ||
          (m.bookNameInEnglish || "").toLowerCase().includes(q) ||
          (m.author || "").toLowerCase().includes(q) ||
          (m.publication || "").toLowerCase().includes(q) ||
          (m.shelfName || "").toLowerCase().includes(q) ||
          (m.parentShelfName || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.purchaseDate && b.purchaseDate) {
          return b.purchaseDate.localeCompare(a.purchaseDate);
        }
        if (a.purchaseDate) return -1;
        if (b.purchaseDate) return 1;
        return (a.bookNameInEnglish || a.bookName || "").localeCompare(
          b.bookNameInEnglish || b.bookName || ""
        );
      });
  }, [books, searchParam, dateFilter, monthFilter]);

  const stats = useMemo(() => {
    const datedCount = filteredBooks.filter((b) => b.purchaseDate).length;
    const totalSpend = filteredBooks.reduce(
      (sum, b) => sum + (Number(b.price) || 0),
      0
    );
    return { total: filteredBooks.length, datedCount, totalSpend };
  }, [filteredBooks]);

  // Grouped Spend Report (by date / month / year)
  const reportRows = useMemo(() => {
    const map = {};
    filteredBooks.forEach((b) => {
      if (!b.purchaseDate) return;
      let key = b.purchaseDate;
      if (groupBy === "month") key = b.purchaseDate.slice(0, 7);
      else if (groupBy === "year") key = b.purchaseDate.slice(0, 4);

      if (!map[key]) {
        map[key] = { period: key, count: 0, spend: 0 };
      }
      map[key].count += 1;
      map[key].spend += Number(b.price) || 0;
    });
    return Object.values(map).sort((a, b) => b.period.localeCompare(a.period));
  }, [filteredBooks, groupBy]);

  const chartData = useMemo(() => {
    const chronological = [...reportRows].reverse().slice(-24);
    return {
      series: [
        {
          name: "Spend (₹)",
          data: chronological.map((r) => Math.round(r.spend)),
        },
        {
          name: "Books",
          data: chronological.map((r) => r.count),
        },
      ],
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false },
          background: "transparent",
          fontFamily: "Inter, sans-serif",
        },
        colors: ["#6366f1", "#0ea5e9"],
        plotOptions: {
          bar: { borderRadius: 6, columnWidth: "55%" },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: chronological.map((r) => r.period),
          labels: { style: { colors: "#94a3b8", fontSize: "11px" } },
        },
        yaxis: [
          {
            title: { text: "Spend (₹)", style: { color: "#94a3b8" } },
            labels: {
              style: { colors: "#94a3b8" },
              formatter: (v) => `₹${Math.round(v)}`,
            },
          },
          {
            opposite: true,
            title: { text: "Books", style: { color: "#94a3b8" } },
            labels: { style: { colors: "#94a3b8" } },
          },
        ],
        grid: { borderColor: "rgba(148,163,184,0.15)" },
        legend: { labels: { colors: "#94a3b8" } },
        tooltip: { theme: "dark" },
      },
    };
  }, [reportRows]);

  const drillDownPeriod = (period) => {
    if (groupBy === "month") {
      setMonthFilter(period);
    } else if (groupBy === "date") {
      setMonthFilter(period.slice(0, 7));
    } else {
      setMonthFilter("");
    }
    setActiveTab("list");
  };

  return (
    <Fragment>
      {(loading || updating) && <CustomLoader />}

      <div className="glass-hero">
        <div>
          <div className="glass-hero-eyebrow">
            <i className="fa-solid fa-bag-shopping"></i>
            Purchase Tracker & Spend Report
          </div>
          <h1 className="glass-hero-title">Book Purchase & Spend</h1>
          <p className="glass-hero-sub">
            Analyze how much was spent by date, month, or year, and manage purchase dates.
          </p>
        </div>

        <div className="d-flex flex-column align-items-stretch align-items-lg-end gap-3 flex-grow-1">
          <div className="glass-stat-row justify-content-lg-end">
            <div className="glass-stat-chip">
              <div className="stat-icon">
                <i className="fa-solid fa-book"></i>
              </div>
              <div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Books</div>
              </div>
            </div>

            <div className="glass-stat-chip">
              <div className="stat-icon">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <div className="stat-value">{stats.datedCount}</div>
                <div className="stat-label">With Date</div>
              </div>
            </div>

            <div className="glass-stat-chip">
              <div className="stat-icon">
                <i className="fa-solid fa-indian-rupee-sign"></i>
              </div>
              <div>
                <div className="stat-value">
                  {formatCurrency(stats.totalSpend)}
                </div>
                <div className="stat-label">Total Spend</div>
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
                >
                  <i className="fa fa-times"></i>
                </button>
              )}
            </div>

            <button
              type="button"
              className={`saas-toolbar-btn ${activeTab === "report" ? "primary" : ""}`}
              onClick={() => setActiveTab("report")}
            >
              <i className="fa-solid fa-chart-column"></i>
              Spend Report
            </button>

            <button
              type="button"
              className={`saas-toolbar-btn ${activeTab === "list" ? "primary" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              <i className="fa-solid fa-list"></i>
              Book List
            </button>
          </div>
        </div>
      </div>

      {/* ── TAB 1: SPEND REPORT ── */}
      {activeTab === "report" && (
        <Fragment>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold text-muted small text-uppercase">
                Group By:
              </span>
              {["date", "month", "year"].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`saas-toolbar-btn ${groupBy === g ? "primary" : ""}`}
                  style={{ padding: "0.4rem 0.9rem", fontSize: "0.8rem" }}
                  onClick={() => setGroupBy(g)}
                >
                  {g === "date" ? "Date-wise" : g === "month" ? "Month-wise" : "Year-wise"}
                </button>
              ))}
            </div>
            <span className="saas-badge">
              {reportRows.length} {groupBy}(s) | Total: {formatCurrency(stats.totalSpend)}
            </span>
          </div>

          {reportRows.length > 0 && (
            <div className="card p-3 mb-4">
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={280}
              />
            </div>
          )}

          <div className="tableContainer">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>
                    {groupBy === "date"
                      ? "Purchase Date"
                      : groupBy === "month"
                      ? "Month (YYYY-MM)"
                      : "Year"}
                  </th>
                  <th>Books Purchased</th>
                  <th>Total Spend</th>
                  <th>Avg / Book</th>
                  <th className="text-end">Details</th>
                </tr>
              </thead>
              <tbody>
                {reportRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No dated purchases found
                    </td>
                  </tr>
                )}
                {reportRows.map((r) => (
                  <tr
                    key={r.period}
                    className="hand"
                    onClick={() => drillDownPeriod(r.period)}
                  >
                    <td className="fw-semibold">{r.period}</td>
                    <td>
                      <span className="saas-badge">{r.count} Books</span>
                    </td>
                    <td className="fw-bold golden-text">
                      {formatCurrency(r.spend)}
                    </td>
                    <td>
                      {r.count > 0 ? formatCurrency(r.spend / r.count) : "-"}
                    </td>
                    <td className="text-end">
                      <span className="saas-toolbar-btn" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}>
                        View Books <i className="fa fa-arrow-right ms-1"></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}

      {/* ── TAB 2: BOOK-WISE PURCHASE LIST ── */}
      {activeTab === "list" && (
        <Fragment>
          <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
            <select
              className="form-select"
              style={{ width: "auto", minWidth: "155px" }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Books</option>
              <option value="dated">Dated Only</option>
              <option value="missing">Missing Date</option>
            </select>

            <input
              type="month"
              className="form-control"
              style={{ width: "auto", minWidth: "155px" }}
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              title="Filter by purchase month"
            />
            {monthFilter && (
              <button
                type="button"
                className="saas-toolbar-btn"
                onClick={() => setMonthFilter("")}
              >
                Clear Month
              </button>
            )}
          </div>

          <div className="tableContainer">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Shelf</th>
                  <th>Price</th>
                  <th style={{ minWidth: "170px" }}>Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      No matching books found
                    </td>
                  </tr>
                )}
                {filteredBooks.map((m) => (
                  <tr key={m.bookId}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/bookImages/${
                            m.bookImage && m.bookImage !== ""
                              ? m.bookImage
                              : "book.png"
                          }`}
                          alt={m.bookName}
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
                          <div className="fw-semibold">{m.bookName}</div>
                          {m.bookNameInEnglish && (
                            <small className="text-muted">
                              {m.bookNameInEnglish}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{m.author}</td>
                    <td>{m.publication}</td>
                    <td>
                      {m.parentShelfName ? `${m.parentShelfName} → ` : ""}
                      {m.shelfName}
                    </td>
                    <td className="fw-semibold">
                      {Number(m.price) > 0 ? formatCurrency(m.price) : "-"}
                    </td>
                    <td>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={m.purchaseDate || ""}
                        onChange={(e) =>
                          handleDateChange(m.bookId, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default PurchaseList;
