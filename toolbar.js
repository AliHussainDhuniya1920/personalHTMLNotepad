document.addEventListener("DOMContentLoaded", () => {
    const boldBtn = document.getElementById("boldBtn");
    const italicBtn = document.getElementById("italicBtn");
    const underlineBtn = document.getElementById("underlineBtn");
    const orderedListBtn = document.getElementById("orderedListBtn");
    const unorderedListBtn = document.getElementById("unorderedListBtn");
    const codeBtn = document.getElementById("codeBtn");
    const notepad = document.querySelector(".notepad");
  
    let lastUploadDate = localStorage.getItem("lastUploadDate");
  
    // Open IndexedDB
    const dbRequest = indexedDB.open("NotepadDB", 39);
    let db;
  
    dbRequest.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains("contentData")) {
        db.createObjectStore("contentData", { keyPath: "id" });
      }
    };
  
    dbRequest.onsuccess = (event) => {
      db = event.target.result;
      loadNotepadContent();

    };
  
    // Save the notepad content and images (Blobs)
    function saveNotepadContent() {
      const transaction = db.transaction("contentData", "readwrite");
      const store = transaction.objectStore("contentData");
      const timestamp = Date.now();
  
      store.put({ id: "notepad", content: notepad.innerHTML, timestamp });
    }
  
    // Load the saved content and images (Blobs)
    function loadNotepadContent() {
      const transaction = db.transaction("contentData", "readonly");
      const store = transaction.objectStore("contentData");
      const request = store.get("notepad");
  
      request.onsuccess = () => {
        if (request.result) {
          notepad.innerHTML = request.result.content;
      
        }
      };
    }
  
    // Function to delete expired content after 15 days
    function deleteExpiredContent() {
      const transaction = db.transaction("contentData", "readwrite");
      const store = transaction.objectStore("contentData");
      const request = store.get("notepad");
  
      request.onsuccess = () => {
        if (request.result) {
          const savedTime = request.result.timestamp;
          const currentTime = Date.now();
          const timeDifference = (currentTime - savedTime) / 1000; // Convert to seconds
  
          if (timeDifference >= 15 * 24 * 60 * 60) { // DELETE after 15 days
            store.delete("notepad");
            console.log("Notepad content deleted after 15 days.");
          }
        }
      };
    }
  
    // Text Formatting Functions
    boldBtn.addEventListener("click", () => document.execCommand("bold"));
    italicBtn.addEventListener("click", () => document.execCommand("italic"));
    underlineBtn.addEventListener("click", () => document.execCommand("underline"));
    orderedListBtn.addEventListener("click", () => document.execCommand("insertOrderedList"));
    unorderedListBtn.addEventListener("click", () => document.execCommand("insertUnorderedList"));
    codeBtn.addEventListener("click", () => document.execCommand("formatBlock", false, "pre"));
  
  
    // Listen for changes in the notepad content
    notepad.addEventListener("input", () => saveNotepadContent());
  
    // Check for expired content
    deleteExpiredContent();
  });
  