import React from "react";

/**
 * props:
 *  - tasks: [{id, text, point}]
 *  - completedIds: number[] 已完成的 task id
 *  - onComplete(task): function 點完成時呼叫
 */
function TaskList({ tasks = [], completedIds = [], onComplete}) {
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
              <div style={{ fontSize: 12, color: "#666" }}>{task.point} 分</div>
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
              {done ? (task.doneLabel || "已完成") : (task.completeLabel || "完成")}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
