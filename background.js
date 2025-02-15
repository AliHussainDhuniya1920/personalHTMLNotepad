document.addEventListener("DOMContentLoaded", () => {
  const customBgPicker = document.getElementById("custom-bg-picker");
  const bgCircles = document.querySelectorAll(".color-circle[data-type='bg']");
  const body = document.body;
  const resetBgBtn = document.getElementById("reset-bg-btn"); // Button to reset background color

  // Load saved background color
  const savedBgColor = localStorage.getItem("notepadBgColor");
  if (savedBgColor) {
    body.style.backgroundColor = savedBgColor;
    customBgPicker.value = savedBgColor.startsWith("#") ? savedBgColor : rgbToHex(savedBgColor);
  }

  // Change background color (predefined)
  bgCircles.forEach((circle) => {
    circle.addEventListener("click", (e) => {
      const selectedColor = e.target.getAttribute("data-color");
      body.style.backgroundColor = selectedColor;
      localStorage.setItem("notepadBgColor", selectedColor);
      customBgPicker.value = selectedColor;
    });
  });

  // Change background color (custom)
  customBgPicker.addEventListener("input", (e) => {
    const selectedColor = e.target.value;
    body.style.backgroundColor = selectedColor;
    localStorage.setItem("notepadBgColor", selectedColor);
  });

  // Reset background color to default
  resetBgBtn.addEventListener("click", () => {
    // Show a confirmation dialog before resetting
    const isConfirmed = confirm("Do you really want to reset the background color to default?");

    if (isConfirmed) {
      // Reset to default background color (lightblue, for example)
      const defaultBgColor = "white";
      body.style.backgroundColor = defaultBgColor;
      localStorage.setItem("notepadBgColor", defaultBgColor);
      customBgPicker.value = defaultBgColor;

      console.log("Background color has been reset to default.");
    } else {
      console.log("Background color reset cancelled.");
    }
  });

  // Convert named colors to hex
  function rgbToHex(color) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle;
  }
});