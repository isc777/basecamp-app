import React from "react";

function TaskList({ tasks = [], completedIds = [], onComplete, lang = "zh" }) {
  const dict = {
    zh: { point: "分", complete: "完成", done: "已完成" },
    en: { point: "pt", complete: "Complete", done: "Done" },
  };

  return (
    <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
      {tasks.map((task) => {
        const done = completedIds.includes(task.id);
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

            <button
              onClick={() => onComplete && onComplete(task)}
              disabled={done}
              style={{
                padding: "6px 12px",
                border: "none",
                borderRadius: 6,
                backgroundColor: done ? "#9e9e9e" : "#4caf50",
                color: "#fff",
                cursor: done ? "not-allowed" : "pointer",
              }}
            >
              {done
                ? task.doneLabel || dict[lang].done
                : task.completeLabel || dict[lang].complete}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
