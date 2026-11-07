// Shared navigation and footer behaviour
document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "×" : "☰";
    });
  }

  // Academic planner: tasks are stored locally in this browser.
  const taskForm = document.querySelector("#task-form");
  if (taskForm) {
    const input = document.querySelector("#task-input");
    const list = document.querySelector("#task-list");
    const empty = document.querySelector("#empty-state");
    const count = document.querySelector("#remaining-count");
    const clear = document.querySelector("#clear-completed");
    const filters = [...document.querySelectorAll(".filter-btn")];
    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem("adedotunTasks") || "[]"); } catch (_) { tasks = []; }
    let filter = "all";

    function save() { localStorage.setItem("adedotunTasks", JSON.stringify(tasks)); }
    function render() {
      list.innerHTML = "";
      const visible = tasks.filter(task => filter === "all" || (filter === "active" ? !task.done : task.done));
      count.textContent = tasks.filter(task => !task.done).length;
      empty.hidden = visible.length > 0;
      empty.textContent = tasks.length === 0 ? "Your task list is clear. Add a task to get started." : "No tasks match this filter.";
      visible.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item${task.done ? " done" : ""}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox"; checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.done ? "not completed" : "completed"}`);
        checkbox.addEventListener("change", () => { task.done = checkbox.checked; save(); render(); });
        const text = document.createElement("span"); text.textContent = task.text;
        const remove = document.createElement("button"); remove.type = "button"; remove.className = "delete-task"; remove.textContent = "Delete";
        remove.setAttribute("aria-label", `Delete ${task.text}`);
        remove.addEventListener("click", () => { tasks = tasks.filter(item => item.id !== task.id); save(); render(); });
        li.append(checkbox, text, remove); list.append(li);
      });
    }
    taskForm.addEventListener("submit", event => {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      tasks.unshift({ id: Date.now(), text: value, done: false });
      save(); input.value = ""; render(); input.focus();
    });
    filters.forEach(button => button.addEventListener("click", () => {
      filter = button.dataset.filter;
      filters.forEach(item => item.classList.toggle("active", item === button));
      render();
    }));
    clear.addEventListener("click", () => { tasks = tasks.filter(task => !task.done); save(); render(); });
    render();
  }

  // Contact form validation. This is a front-end demonstration; no message is transmitted.
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const fields = ["name", "email", "phone", "message"];
    const feedback = document.querySelector("#form-feedback");
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const values = Object.fromEntries(fields.map(id => [id, document.getElementById(id).value.trim()]));
      const errors = {
        name: values.name ? "" : "Please enter your name.",
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? "" : "Enter a valid email address.",
        phone: /^\d+$/.test(values.phone) ? "" : "Use digits only for the phone number.",
        message: values.message ? "" : "Please enter a message."
      };
      let valid = true;
      fields.forEach(id => {
        document.getElementById(`${id}-error`).textContent = errors[id];
        if (errors[id]) valid = false;
      });
      feedback.classList.toggle("success", valid);
      feedback.textContent = valid
        ? "All fields are valid. This demo does not send the message; connect a form service to receive submissions."
        : "Please correct the highlighted fields and try again.";
    });
    fields.forEach(id => document.getElementById(id).addEventListener("input", () => {
      document.getElementById(`${id}-error`).textContent = "";
    }));
  }
});