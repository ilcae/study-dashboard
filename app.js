import axios from "axios";

/* =========================
   CONFIG
========================= */
const API_BASE = "https://veff-2026-quotes.netlify.app/api/v1";
const LOCAL_API_BASE = "http://localhost:3000/api/v1";

/* =========================
   TASK FEATURE
========================= */

const loadTasks = async () => {
  try {
    const response = await axios.get(LOCAL_API_BASE + "/tasks");
      response.data.forEach((task) => {
        renderTask(task)
      })
  } catch (err) {
    console.error(`Error loading tasks: ${err}`);
  }
}

const renderTask = (task) => { 
  const taskList = document.querySelector(".task-list");
  const li = document.createElement("li")
  const input = document.createElement("input");
  const label = document.createElement("label")
  input.type = "checkbox";
  input.checked = task.finished
  label.textContent = task.task;
  input.addEventListener("change", () => {
    updateTaskStatus(task.id, input.checked ? 1 : 0);
  });
  input.id = "task-" + task.id;
  label.htmlFor = "task-" + task.id;
  li.appendChild(input);
  li.appendChild(label);
  taskList.appendChild(li);
}

const updateTaskStatus = async (id, finished) => {
  try {
    await axios.patch(LOCAL_API_BASE + "/tasks/" + id, {finished: finished});
} catch (err) {
  console.error(`Error updating task: ${err}`);
}
};

const addTask = async () => {
  const input = document.getElementById("new-task")
  const taskText = input.value.trim();
  if (!taskText) return;
  try {
    const response = await axios.post(LOCAL_API_BASE + "/tasks", { task: taskText });
    input.value = "";
    renderTask(response.data);
  } catch (err) {
    console.error(`Error adding task: ${err}`)
  }
}

const wireTaskEvents = () => {
  const addTaskButton = document.getElementById("add-task-btn");
  if (addTaskButton) {
    addTaskButton.addEventListener("click", addTask);
  }

  const newTaskInput = document.getElementById("new-task");
  if (newTaskInput) {
    newTaskInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addTask();
      }
    })
  }
}

/* =========================
   notes FEATURE
========================= */

const loadNotes = async () => {
  try {
    const response = await axios.get(LOCAL_API_BASE + "/notes");
    const notesTextArea = document.getElementById("notes-text");
    notesTextArea.value = response.data.notes;
  } catch (err) {
  console.error(`Error loading notes: ${err}`);
}
}

const saveNotes = async () => {
  const notesTextarea = document.getElementById("notes-text");
  const saveButton = document.getElementById("save-notes-btn");
  try {
    await axios.put(LOCAL_API_BASE + "/notes", { notes: notesTextarea.value });
    saveButton.disabled = true;
  } catch (err) {
    console.error(`Error saving notes: ${err}`);
  }
};

const wireNotesEvents = () => {
  const notesTextarea = document.getElementById("notes-text");
  const saveButton = document.getElementById("save-notes-btn");
  if (notesTextarea && saveButton) {
    notesTextarea.addEventListener("input", () => {
      saveButton.disabled = false;
    });
    saveButton.addEventListener("click", saveNotes);
  }
};


/* =========================
   QUOTE FEATURE
========================= */

/**
 * Fetch a quote from the API
 * @param {string} category - quote category
 */
const loadQuote = async (category = "general") => {
  try {
    const response = await axios.get(API_BASE + "/quotes", {
      params: { category: category },
    });
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    quoteText.textContent = `"${response.data.quote}"`;
    quoteAuthor.textContent = response.data.author;
  } catch (err) {
    console.error(`Error occurred: ${err}`);
  }
};

/**
 * Attach event listeners for quote feature
 */
const wireQuoteEvents = () => {

  const dropdownMenu = document.getElementById("quote-category-select");
  if (dropdownMenu) {
    dropdownMenu.addEventListener("change", () => {
      loadQuote(dropdownMenu.value);
    });
  }

  const newQuoteButton = document.getElementById("new-quote-btn");
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", () => {
      loadQuote(dropdownMenu.value);
    });
  }
};


/* =========================
   CUSTOM FEATURE
========================= */

/* =========================
   INIT
========================= */

/**
 * Initialize application
 */
const init = async () => {
  wireQuoteEvents();
  wireTaskEvents();
  wireNotesEvents();

  const select = document.getElementById("quote-category-select");
  const category = select?.value || "general";

  await loadQuote(category);
  await loadTasks();
  await loadNotes();


};



/* =========================
   EXPORT (DO NOT REMOVE)
========================= */

export { init, loadQuote, wireQuoteEvents };

init();
