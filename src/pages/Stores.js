import React, { useState, useEffect } from "react";
import { getStores } from "../services/storeService";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { formatDate } from "../utils/dateUtils";
const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showTokens, setShowTokens] = useState({});
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await getStores();
        if (data && Array.isArray(data.stores)) {
          setStores(data.stores);
          const visibility = {};
          data.stores.forEach((store) => {
            if (store?.id) visibility[store.id] = false;
          });
          setShowTokens(visibility);
        } else {
          setStores([]);
        }

        setError("");
      } catch (err) {
        setError("Failed to load stores.");
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const toggleTokenVisibility = (id) => {
    setShowTokens((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    if (!text) {
      setSnackbarMessage("No token available");
      return;
    }

if (navigator.clipboard?.writeText) {
      // Modern asynchronous API
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setSnackbarMessage("Token copied to clipboard!");
          setTimeout(() => setSnackbarMessage(""), 2000);
        })
        .catch(() => {
          fallbackCopyText(text);
        });
    } else {
      // Fallback for older browsers
      fallbackCopyText(text);
    }
  };

  const fallbackCopyText = (text) => {
    // Create a temporary textarea to copy the text from
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setSnackbarMessage("Token copied to clipboard!");
        setTimeout(() => setSnackbarMessage(""), 2000);
      } else {
        setSnackbarMessage("Failed to copy token");
      }
    } catch (err) {
      setSnackbarMessage("Failed to copy token");
    }

    document.body.removeChild(textArea);
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && page > 0) setPage(page - 1);
    if (direction === "next" && (page + 1) * rowsPerPage < stores.length)
      setPage(page + 1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const styles = {
    container: { padding: "0 20px 20px", fontFamily: "Arial, sans-serif" },
    heading: { margin: "0 0 20px" },
    error: { color: "red" },
    snackbar: { color: "green", marginBottom: 10 },
    emptyMessage: {
      backgroundColor: "#f9f9f9",
      padding: 20,
      border: "1px dashed #ccc",
      borderRadius: 8,
      marginTop: 20,
      textAlign: "center",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 20,
    },
    th: {
      border: "1px solid #ddd",
      padding: 10,
      backgroundColor: "#0080ff17",
      fontWeight: "bold",
      textAlign: "left",
    },
    td: {
      border: "1px solid #ddd",
      padding: 10,
      textAlign: "left",
      fontSize: 14,
    },
    btn: {
      padding: "8px 10px",
      marginLeft: 10,
      border: "none",
      backgroundColor: "#1976d2",
      color: "white",
      cursor: "pointer",
      borderRadius: 4,
    },
    btnCopy: { backgroundColor: "#4caf50" },
    badge: {
      display: "inline-block",
      backgroundColor: "#006ed5",
      padding: "4px 7px",
      margin: 2,
      color: "#fff",
      borderRadius: 4,
      fontSize: 12,
    },
    btnDisabled: {
      cursor: "not-allowed",
      opacity: 0.7,
    },
    pagination: {
      marginTop: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    select: {
      padding: "5px 8px",
      borderRadius: 4,
      border: "1px solid #ccc",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: 64,
    },
  };
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Connected Stores</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {snackbarMessage && <p style={styles.snackbar}>{snackbarMessage}</p>}

      {stores.length === 0 && !loading && !error ? (
        <div style={styles.emptyMessage}>
          <p>No stores connected yet</p>
          <p>Connect your first Shopify store to get started</p>
        </div>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>S.No</th>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Shop Domain</th>
                <th style={styles.th}>Created At</th>
                <th style={styles.th}>Access Token</th>
                <th style={styles.th}>Scopes</th>
              </tr>
            </thead>
            <tbody>
              {stores
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((store, index) => (
                  <tr key={store.id}>
                    <td style={styles.td}>{page * rowsPerPage + index + 1}</td>
                    <td style={styles.td}>{store.id}</td>
                    <td style={styles.td}>{store.shop_domain || "N/A"}</td>
                    <td style={styles.td}>{formatDate(store.created_at)}</td>
                    <td style={styles.td} className="token-cell">
                      {showTokens[store.id]
                        ? store.access_token
                        : "•••••••••••••••"}
                      <div>
                        <IconButton
                          onClick={() => toggleTokenVisibility(store.id)}
                          size="small"
                        >
                          {showTokens[store.id] ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                        <IconButton
                          onClick={() => copyToClipboard(store.access_token)}
                          size="small"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {store.scope
                        ? store.scope.split(",").map((s, i) => (
                            <span key={i} style={styles.badge}>
                              {s.trim()}
                            </span>
                          ))
                        : "No scopes"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <div className="pagination-no">
              <button
                style={{
                  ...styles.btn,
                  ...(page === 0 ? styles.btnDisabled : {}),
                }}
                onClick={() => handlePageChange("prev")}
                disabled={page === 0}
              >
                Previous
              </button>
                <div style={{ fontSize: 14, color: '#666' }}>
              Page {page + 1} of {Math.ceil(stores.length / rowsPerPage)}
            </div>
              <button
                style={{
                  ...styles.btn,
                  ...((page + 1) * rowsPerPage >= stores.length
                    ? styles.btnDisabled
                    : {}),
                }}
                onClick={() => handlePageChange("next")}
                disabled={(page + 1) * rowsPerPage >= stores.length}
              >
                Next
              </button>
            </div>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              style={styles.select}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          
          </div>
        </>
      )}
    </div>
  );
};

export default Stores;
