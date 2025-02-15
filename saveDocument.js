document.addEventListener("DOMContentLoaded", () => {
    const saveDropdownBtn = document.getElementById("save-dropdown-btn");
    const saveDropdownMenu = document.getElementById("save-dropdown-menu");
    const saveTextBtn = document.getElementById("save-text-btn");
    const savePdfBtn = document.getElementById("save-pdf-btn");
    const saveHtmlBtn = document.getElementById("save-html-btn");
    const notepad = document.querySelector(".notepad");

    // Toggle dropdown menu visibility
    saveDropdownBtn.addEventListener("click", () => {
      saveDropdownMenu.classList.toggle("show");
    });

    // Save document as text
    saveTextBtn.addEventListener("click", () => {
      const textContent = notepad.innerText;
      const blob = new Blob([textContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "notepad.txt";
      link.click();
      URL.revokeObjectURL(url); // Clean up the URL object
    });

    // Save document as PDF
    savePdfBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const textContent = notepad.innerText;

      // Add text to PDF
      doc.text(textContent, 10, 10);

      // Fetch images from notepad
      const images = Array.from(notepad.querySelectorAll("img"));
      let yOffset = 20; // Initial Y position for images

      images.forEach((img, index) => {
        const imgSrc = img.src;

        // Load the image as base64 if it is not already in base64
        if (imgSrc.startsWith("data:image")) {
          doc.addImage(imgSrc, 'JPEG', 10, yOffset, 180, 160);
        } else {
          const imgElement = new Image();
          imgElement.src = imgSrc;

          imgElement.onload = function () {
            doc.addImage(imgElement, 'JPEG', 10, yOffset, 180, 160);
            yOffset += 170; // Adjust yOffset for next image
            doc.save("notepad.pdf");
          };
        }

        yOffset += 170; // Adjust yOffset for the next image
      });

      // Save the PDF after processing images
      doc.save("notepad.pdf");
    });

    // Save document as HTML
    saveHtmlBtn.addEventListener("click", () => {
      const htmlContent = notepad.innerHTML;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "notepad.html";
      link.click();
      URL.revokeObjectURL(url); // Clean up the URL object
    });
});