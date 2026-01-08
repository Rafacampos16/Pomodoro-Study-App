import { useEffect, useState } from "react";
import { Check, Trash2, History, X } from "lucide-react";


export default function TaskList({
  onTasksChange,
  tasks = [],
  setTasks,
}) {


    const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("taskHistory");
    return saved ? JSON.parse(saved) : [];
  });

    const [showHistory, setShowHistory] = useState(false);

    const [clearing, setClearing] = useState(false);

    const [isHolding, setIsHolding] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [clearTimeoutId, setClearTimeoutId] = useState(null);
    


    let clearTimeout;

       const startClear = () => {
  setIsHolding(true);

  const id = setTimeout(() => {
    // 👇 só aqui começa a animação
        setIsClearing(true);

        // espera a animação antes de apagar de vez
        setTimeout(() => {
          setHistory([]);
          setIsClearing(false);
        }, 500); // duração da animação
      }, 1000); // tempo de segurar

      setClearTimeoutId(id);
    };

    const cancelClear = () => {
      if (clearTimeoutId) {
        clearTimeout(clearTimeoutId);
        setClearTimeoutId(null);
      }
      setIsHolding(false);
    };



    

  const [text, setText] = useState("");

  useEffect(() => {
  localStorage.setItem("taskHistory", JSON.stringify(history));
}, [history]);


  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const pending = tasks.filter(t => !t.done).length;
    onTasksChange?.(pending);
  }, [tasks]);



  const addTask = () => {
    if (!text.trim()) return;

    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
      },
    ]);


    setText("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

 const removeTask = (task) => {
  if (task.done) {
    setHistory(prev => [
      {
        text: task.text,
        createdAt: task.createdAt,
        finishedAt: new Date().toISOString(),
      },
      ...prev
    ]);
  }

  setTasks(prev => prev.filter(t => t.id !== task.id));
};



 return (
  <div className="task-list">
    <div className="task-header">
      <h3>Tarefas</h3>

      <button
        className="history-toggle icon tooltip"
        onClick={() => setShowHistory(v => !v)}
      >
        <History size={18} />
        <span className="tooltip-text">Histórico</span>
      </button>
    </div>

    <input
      placeholder="Adicionar tarefa..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addTask()}
    />

    <ul>
      {tasks.map(task => (
        <li
          key={task.id}
          className={`task-item ${task.done ? "done" : ""}`}
        >
          <span onClick={() => toggleTask(task.id)}>
            {task.text}
          </span>

          <div className="actions">
            <button
              className="task-done-btn"
              onClick={() => toggleTask(task.id)}
            >
              <Check size={14} color="currentColor" />
            </button>

            <button
              className="task-done-btn"
              onClick={() => removeTask(task)}
            >
              <Trash2 size={14} color="currentColor" />
            </button>

          </div>
        </li>
      ))}
    </ul>

    {showHistory && (
      <div className={`task-history ${isClearing ? "clearing" : ""}`}>
        <div className="history-header">
          <h3>Histórico</h3>

          <div className="history-actions">
            <span className="history-badge">
              {history.length}
            </span>

          <button
            className={`clear-history icon tooltip ${isHolding ? "holding" : ""}`}
            onMouseDown={startClear}
            onMouseUp={cancelClear}
            onMouseLeave={cancelClear}
          >
            <Trash2 size={16} />
            <span className="tooltip-text">Segure para apagar</span>
          </button>


          </div>
        </div>



        <ul>
          {history.length === 0 && (
            <p className="empty">Nenhuma tarefa concluída</p>
          )}

          {history.map((h, i) => (
            <li key={i}>
              <span>{h.text}</span>
              <small>
                {new Date(h.createdAt).toLocaleDateString("pt-BR")}
              </small>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
}
