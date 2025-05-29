import React, { useState, useEffect } from 'react';
import { getTokenUsage } from '../services/storeService';

const TokenUsage = () => {
  const [storesUsage, setStoresUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTokenUsage = async () => {
      try {
        setLoading(true);
        const data = await getTokenUsage();

        if (data && Array.isArray(data.stores_usage)) {
          setStoresUsage(data.stores_usage);
        } else {
          setStoresUsage([]);
          console.warn('Token usage data is not in expected format:', data);
        }
        setError('');
      } catch (err) {
        setError('Failed to load token usage data. Please try again later.');
        console.error('Error loading token usage:', err);
        setStoresUsage([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenUsage();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const maxTokenUsage = storesUsage.length > 0 
    ? Math.max(...storesUsage.map(s => s?.token_usage || 0), 1) 
    : 1;

  // Pagination handlers
  const handlePageChange = (direction) => {
    if (direction === 'prev' && page > 0) setPage(page - 1);
    if (direction === 'next' && (page + 1) * rowsPerPage < storesUsage.length) setPage(page + 1);
  };
  
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const styles = {
    container: { padding: "0 20px 20px", fontFamily: "Arial, sans-serif" },
    heading: { margin: "0 0 20px" },
    error: { color: "red", backgroundColor: "#f8d7da", padding: "12px 16px", borderRadius: 4, marginBottom: 20 },
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
    td: { border: "1px solid #ddd", padding: 10, textAlign: "left", fontSize: 14 },
    usageBar: {
      backgroundColor: "rgba(25, 118, 210, 0.1)",
      borderRadius: 5,
      height: 10,
      width: "100%",
      position: "relative",
    },
    usageBarFill: {
      backgroundColor: "#1976d2",
      height: "100%",
      borderRadius: 5,
      transition: "width 0.3s ease",
    },
    pagination: {
      marginTop: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    btn: {
      padding: "8px 10px",
      marginRight: 8,
      border: "none",
      backgroundColor: "#1976d2",
      color: "white",
      cursor: "pointer",
      borderRadius: 4,
    },
    btnDisabled: {
      cursor: "not-allowed",
      opacity: 0.7,
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
    spinner: {
      border: "4px solid #ccc",
      borderTop: "4px solid #1976d2",
      borderRadius: "50%",
      width: 40,
      height: 40,
      animation: "spin 1s linear infinite",
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
      <h2 style={styles.heading}>Token Usage Analytics</h2>

      {error && <div style={styles.error}>{error}</div>}

      {storesUsage.length === 0 && !loading && !error ? (
        <div style={styles.emptyMessage}>
          <p style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>No token usage data available</p>
          <p>Token usage data will appear here once your stores start using tokens</p>
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
                <th style={styles.th}>Token Usage</th>
              </tr>
            </thead>
            <tbody>
              {storesUsage
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((store,index) => (
                  <tr key={store?.id || Math.random()}>
                    <td style={styles.td}>{page * rowsPerPage + index + 1}</td>
                    <td style={styles.td}>{store?.id ?? 'N/A'}</td>
                    <td style={styles.td}>{store?.shop_domain ?? 'N/A'}</td>
                    <td style={styles.td}>{formatDate(store?.created_at)}</td>
                    <td style={{...styles.td, fontWeight: 'bold', textAlign: 'left'}}>
                      {(store?.token_usage || 0).toLocaleString()}
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
                  ...(page === 0 ? styles.btnDisabled : {})
                }}
                onClick={() => handlePageChange('prev')}
                disabled={page === 0}
              >
                Previous
              </button>
               <div style={{ fontSize: 14, color: '#666' }}>
              Page {page + 1} of {Math.ceil(storesUsage.length / rowsPerPage)}
            </div>
              <button
                style={{
                  ...styles.btn,
                  ...((page + 1) * rowsPerPage >= storesUsage.length ? styles.btnDisabled : {})
                }}
                onClick={() => handlePageChange('next')}
                disabled={(page + 1) * rowsPerPage >= storesUsage.length}
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

export default TokenUsage;

