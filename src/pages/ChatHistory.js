import React, { useState, useEffect } from "react";
import { getStores, getChatHistory } from "../services/storeService";

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedResponses, setExpandedResponses] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);

  // Maximum words to show in collapsed state
  const MAX_WORDS_DISPLAY = 50;

  // Fetch stores for dropdown
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        if (data && Array.isArray(data.stores)) {
          setStores(data.stores);
        } else {
          setStores([]);
          console.warn("Stores data is not in expected format:", data);
        }
      } catch (err) {
        console.error("Error loading stores:", err);
        setStores([]);
      }
    };

    fetchStores();
  }, []);

  // Fetch chat history based on selected store and pagination
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const storeId = selectedStore || null;
        const data = await getChatHistory(
          storeId,
          rowsPerPage,
          page * rowsPerPage
        );

        if (data && Array.isArray(data.chat_history)) {
          setChatHistory(data.chat_history);

          // Check if pagination data is provided in the API response
          if (data.pagination && typeof data.pagination.total === "number") {
            setTotalCount(data.pagination.total);
          }
          // Fallback to total_count if pagination object is not available
          else if (data.total_count !== undefined) {
            setTotalCount(data.total_count);
          }
          // If no pagination info is provided, estimate based on current data
          else {
            // If we're on the first page and got fewer items than requested,
            // we can assume this is the total count
            if (page === 0 && data.chat_history.length < rowsPerPage) {
              setTotalCount(data.chat_history.length);
            }
            // Otherwise, we need to assume there might be more pages
            else if (data.chat_history.length === rowsPerPage) {
              // We don't know the exact count, so we'll set it to a large number
              // to ensure pagination works
              setTotalCount((page + 2) * rowsPerPage);
            } else {
              // We got fewer items than requested, so this must be the last page
              setTotalCount(page * rowsPerPage + data.chat_history.length);
            }
          }

          // Initialize expanded state for new items
          const newExpandedState = {};
          data.chat_history.forEach((chat) => {
            if (chat?.id && expandedResponses[chat.id] === undefined) {
              newExpandedState[chat.id] = false;
            }
          });
          setExpandedResponses((prev) => ({ ...prev, ...newExpandedState }));
        } else {
          setChatHistory([]);
          setTotalCount(0);
          console.warn("Chat history data is not in expected format:", data);
        }

        setError("");
      } catch (err) {
        setError("Failed to load chat history. Please try again later.");
        console.error("Error loading chat history:", err);
        setChatHistory([]);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchChatHistory();
  }, [selectedStore, page, rowsPerPage]);

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
    setPage(0); // Reset to first page when store changes
    setInitialLoad(true); // Treat this as an initial load
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && page > 0) setPage(page - 1);
    if (direction === "next" && (page + 1) * rowsPerPage < totalCount)
      setPage(page + 1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const toggleResponseExpand = (chatId) => {
    setExpandedResponses((prev) => ({
      ...prev,
      [chatId]: !prev[chatId],
    }));
  };

  // Function to truncate text by word count and add ellipsis
  const truncateText = (text, maxWords = MAX_WORDS_DISPLAY) => {
    if (!text) return "";

    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;

    return words.slice(0, maxWords).join(" ") + "...";
  };

  // Function to check if text needs truncation
  const needsTruncation = (text) => {
    if (!text) return false;
    const words = text.split(/\s+/);
    return words.length > MAX_WORDS_DISPLAY;
  };
  // Add this function to your component
  const formatResponseContent = (text) => {
    if (!text) return "";

    // Format markdown-style links: [text](url)
    let formattedText = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #1976d2; text-decoration: none; font-weight: 500;">$1</a>'
    );

    // Format image links: ![alt](url)
    formattedText = formattedText.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<div style="margin: 10px 0;"><img src="$2" alt="$1" style="max-width: 100%; border-radius: 4px; max-height: 200px;" /></div>'
    );

    // Format bold text: **text**
    formattedText = formattedText.replace(
      /\*\*([^*]+)\*\*/g,
      "<strong>$1</strong>"
    );

    // Format numbered lists
    formattedText = formattedText.replace(
      /(\d+\.\s[^\n]+)(\n|$)/g,
      '<div style="margin: 5px 0;">$1</div>'
    );

    // Format line breaks
    formattedText = formattedText.replace(/\n/g, "<br />");

    return formattedText;
  };
  const styles = {
    // Add these to your styles object
    formattedContent: {
      lineHeight: 1.5,
    },
    productItem: {
      marginBottom: 15,
      padding: 10,
      borderRadius: 4,
    },
    productImage: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: 4,
      marginTop: 8,
      marginBottom: 8,
    },
    productLink: {
      color: "#1976d2",
      textDecoration: "none",
      fontWeight: 500,
    },
    productPrice: {
      fontWeight: "bold",
      margin: "5px 0",
    },
    productDescription: {
      margin: "5px 0 10px 0",
      color: "#555",
    },
    container: { padding: "0 20px 20px", fontFamily: "Arial, sans-serif" },
    heading: { margin: "0 0 20px" },
    error: {
      color: "red",
      backgroundColor: "#f8d7da",
      padding: "12px 16px",
      borderRadius: 4,
      marginBottom: 20,
    },
    emptyMessage: {
      backgroundColor: "#f9f9f9",
      padding: 20,
      border: "1px dashed #ccc",
      borderRadius: 8,
      marginTop: 20,
      textAlign: "center",
    },
    filterContainer: {
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
    },
    select: {
      padding: "8px 12px",
      borderRadius: 4,
      border: "1px solid #ccc",
      minWidth: 200,
    },
    loadingIndicator: {
      display: "inline-block",
      marginLeft: 10,
      width: 20,
      height: 20,
      border: "2px solid #f3f3f3",
      borderTop: "2px solid #1976d2",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    chatCard: {
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    chatHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 12,
      flexWrap: "wrap",
    },
    storeBadge: {
      backgroundColor: "#1976d2",
      color: "white",
      padding: "4px 8px",
      borderRadius: 4,
      fontSize: 12,
      marginRight: 8,
      display: "inline-block",
    },
    sessionBadge: {
      border: "1px solid #1976d2",
      color: "#1976d2",
      padding: "3px 8px",
      borderRadius: 4,
      fontSize: 12,
      display: "inline-block",
    },
    timestamp: {
      color: "#666",
      fontSize: 12,
    },
    messageContainer: {
      marginBottom: 12,
      display: "flex",
      gap: 10,
    },
    messageLabel: {
      fontWeight: 500,
      marginBottom: 4,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
    },
    messageBubble: {
      padding: 12,
      borderRadius: 8,
      padding: "6px 12px",
      fontSize: 15,
    },
    customerBubble: {
      backgroundColor: "#f5f5f5",
    },
    aiBubble: {
      backgroundColor: "#e3f2fd",
    },
    readMoreBtn: {
      backgroundColor: "transparent",
      border: "none",
      color: "#1976d2",
      cursor: "pointer",
      padding: "4px 8px",
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      marginTop: 8,
    },
    pagination: {
      marginTop: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    paginationBtn: {
      padding: "8px 12px",
      backgroundColor: "#1976d2",
      color: "white",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      marginRight: 8,
    },
    paginationBtnDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
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

  if (loading && initialLoad) {
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
      <h2 style={styles.heading}>Chat History</h2>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.filterContainer}>
        <select
          value={selectedStore}
          onChange={handleStoreChange}
          style={styles.select}
        >
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store?.id} value={store?.id || ""}>
              {store?.shop_domain || "Unknown Store"}
            </option>
          ))}
        </select>

        {loading && <div style={styles.loadingIndicator}></div>}
      </div>

      {chatHistory.length === 0 && !loading ? (
        <div style={styles.emptyMessage}>
          <p style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
            No chat history available
          </p>
          <p>
            {selectedStore
              ? "This store has no chat history yet."
              : "No chat history found for any store."}
          </p>
        </div>
      ) : (
        <>
          {chatHistory.map((chat) => (
            <div key={chat?.id } style={styles.chatCard}>
              <div style={styles.chatHeader}>
                <div>
                  <span style={styles.storeBadge}>
                    {chat?.stores?.shop_domain || "Unknown Store"}
                  </span>
                  <span style={styles.sessionBadge}>
                    Session: {(chat?.session_id || "").substring(0, 8)}...
                  </span>
                </div>
                <span style={styles.timestamp}>
                  {formatDate(chat?.created_at)}
                </span>
              </div>

              <div style={styles.messageContainer}>
                <div style={styles.messageLabel}>Customer:</div>
                <div
                  style={{ ...styles.messageBubble, ...styles.customerBubble }}
                >
                  {chat?.message || "No message content"}
                </div>
              </div>

              <div style={styles.messageContainer}>
                <div style={styles.messageLabel}>AI Response:</div>
                <div style={{ ...styles.messageBubble, ...styles.aiBubble }}>
                  {needsTruncation(chat?.response) ? (
                    <>
                      {expandedResponses[chat?.id] ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatResponseContent(chat?.response),
                          }}
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatResponseContent(
                              truncateText(chat?.response)
                            ),
                          }}
                        />
                      )}
                      <button
                        style={styles.readMoreBtn}
                        onClick={() => toggleResponseExpand(chat?.id)}
                      >
                        {expandedResponses[chat?.id]
                          ? "Show Less"
                          : "Read More"}
                        <span
                          style={{
                            marginLeft: 4,
                            display: "inline-block",
                            transform: expandedResponses[chat?.id]
                              ? "rotate(180deg)"
                              : "none",
                          }}
                        >
                          ▼
                        </span>
                      </button>
                    </>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatResponseContent(
                          chat?.response || "No response content"
                        ),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          <div style={styles.pagination}>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              style={styles.select}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>

            <div>
              <button
                onClick={() => handlePageChange("prev")}
                disabled={page === 0}
                style={{
                  ...styles.paginationBtn,
                  ...(page === 0 ? styles.paginationBtnDisabled : {}),
                }}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange("next")}
                disabled={(page + 1) * rowsPerPage >= totalCount}
                style={{
                  ...styles.paginationBtn,
                  ...((page + 1) * rowsPerPage >= totalCount
                    ? styles.paginationBtnDisabled
                    : {}),
                }}
              >
                Next
              </button>
            </div>

            <div style={{ fontSize: 14, color: "#666" }}>
              Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHistory;
