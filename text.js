document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("reset-btn");

  const textCircles = document.querySelectorAll(".color-circle[data-type='text']");
  const customTextPicker = document.getElementById("custom-text-picker");
  const notepad = document.querySelector(".notepad");
  let currentTextColor = "#000000"; // Default text color

  // Open IndexedDB
  const dbRequest = indexedDB.open("NotepadDB", 67);
  let db;

  dbRequest.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains("textData")) {
      db.createObjectStore("textData", { keyPath: "id" });
    }
  };

  dbRequest.onsuccess = (event) => {
    db = event.target.result;
    deleteExpiredContent(); // Check for expired data
    loadNotepadContent();
  };

  function saveNotepadContent() {
    const transaction = db.transaction("textData", "readwrite");
    const store = transaction.objectStore("textData");
    const timestamp = Date.now(); // Store current time
    store.put({ id: "notepad", content: notepad.innerHTML, timestamp });
  }

  function loadNotepadContent() {
    const transaction = db.transaction("textData", "readonly");
    const store = transaction.objectStore("textData");
    const request = store.get("notepad");

    request.onsuccess = () => {
      if (request.result) {
        notepad.innerHTML = request.result.content;
      }
    };
  }

   // Reset to default settings
   resetBtn.addEventListener("click", () => {
    // Show a confirmation dialog before resetting
    const isConfirmed = confirm("Do you really want to reset all settings to default?");

    if (isConfirmed) {
      // Clear the notepad content
      notepad.innerHTML = '';

      // Reset to default font-size (16px) only, without affecting text color
      notepad.style.fontSize = "16px";

      // Clear saved data from IndexedDB (but keep the text color setting)
      const transaction = db.transaction("textData", "readwrite");
      const store = transaction.objectStore("textData");
      store.delete("notepad");

      console.log("Notepad has been reset to default settings (font-size only).");
    } else {
      console.log("Reset cancelled.");
    }
  });


  function deleteExpiredContent() {
    const transaction = db.transaction("textData", "readwrite");
    const store = transaction.objectStore("textData");
    const request = store.get("notepad");

    request.onsuccess = () => {
      if (request.result) {
        const savedTime = request.result.timestamp;
        const currentTime = Date.now();
        const daysDifference = (currentTime - savedTime) / (1000 * 60 * 60 * 24);

        if (daysDifference >= 10) {
          store.delete("notepad");
          console.log("Old notepad content deleted after 15 days.");
        }
      }
    };
  }

  notepad.addEventListener("input", () => saveNotepadContent());

  // Apply text color while typing
  notepad.addEventListener("keydown", (e) => {
    if (e.key.length === 1) {
      document.execCommand("foreColor", false, currentTextColor);
    }
  });

  // Change text color (predefined)
  textCircles.forEach((circle) => {
    circle.addEventListener("click", (e) => {
      currentTextColor = e.target.getAttribute("data-color");
    });
  });

  // Handle custom text color (without modifying preset color circles)
  customTextPicker.addEventListener("input", (e) => {
    currentTextColor = e.target.value;
  });
});
