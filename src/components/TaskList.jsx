// TaskList.jsx
import React from "react";

function TaskList({ tasks = [], completedIds = [], onComplete, onScanQRCode, lang = "zh" }) {
  const dict = {
    zh: { point: "分", complete: "完成", scan: "掃描", done: "已完成", startScan: "開始掃描" },
    en: { point: "pt", complete: "Complete", scan: "Scan", done: "Done", startScan: "Start Scan" },
  };

  return (
    <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
      {tasks.map((task) => {
        const done = completedIds.includes(task.id);
        const isQRTask = task.requiresQRCode;

        return (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #eee",
              borderRadius: 8,
              marginBottom: 8,
              background: done ? "#f6fff6" : "#fff",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600 }}>{task.text}</div>
              <div style={{ fontSize: 12, color: "#666" }}>
                {task.point} {dict[lang].point}
              </div>
            </div>

            {/* 按鈕區塊 */}
            {done ? (
              <button
                disabled
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  backgroundColor: "#9e9e9e",
                  color: "#fff",
                  cursor: "not-allowed",
                }}
              >
                {task.doneLabel || dict[lang].done}
              </button>
            ) : isQRTask ? (
              <button
                onClick={() => onScanQRCode && onScanQRCode(task)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {dict[lang].startScan}
              </button>
            ) : (
              <button
                onClick={() => onComplete && onComplete(task)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: 6,
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {task.completeLabel || dict[lang].complete}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
