document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const cpuChartCanvas = document.getElementById("cpuChartCanvas");
  const cpuChartContext = cpuChartCanvas.getContext("2d");

  const ioChartCanvas = document.getElementById("ioChartCanvas");
  const ioChartContext = ioChartCanvas.getContext("2d");

  const swapChartCanvas = document.getElementById("swapChartCanvas");
  const swapChartContext = swapChartCanvas.getContext("2d");

  const memoryChartCanvas = document.getElementById("memoryChartCanvas");
  const memoryChartContext = memoryChartCanvas.getContext("2d");

  const cpuChart = new Chart(cpuChartContext, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "us",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          fill: "origin",
        },
        {
          label: "sy",
          data: [],
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          fill: "-1",
        },
        {
          label: "id",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          fill: "-1",
        },
        {
          label: "wa",
          data: [],
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          fill: "-1",
        },
        {
          label: "st",
          data: [],
          backgroundColor: "rgba(255, 159, 64, 0.5)",
          fill: "-1",
        },
      ],
    },
    options: {
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: { stacked: false },
        y: { stacked: true },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "CPU Usage",
      },
    },
  });

  const ioChart = new Chart(ioChartContext, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "bi",
          data: [],
          borderColor: "rgba(75, 192, 192, 0.5)",
          fill: false,
        },
        {
          label: "bo",
          data: [],
          borderColor: "rgba(255, 99, 132, 0.5)",
          fill: false,
        },
      ],
    },
    plugins: {
      title: {
        display: true,
        text: "IO Usage",
      },
    },
  });

  const memoryChart = new Chart(memoryChartContext, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "swpd",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          fill: "origin",
        },
        {
          label: "free",
          data: [],
          backgroundColor: "rgba(255, 206, 86, 0.5)",
          fill: "-1",
        },
        {
          label: "buff",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          fill: "-1",
        },
        {
          label: "cache",
          data: [],
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          fill: "-1",
        },
      ],
    },
    options: {
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: true,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Memory Usage",
      },
    },
  });

  const swapChart = new Chart(swapChartContext, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "si",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
        {
          label: "so",
          data: [],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
        },
      ],
    },
    options: {
      scales: {
        x: { stacked: false },
        y: { stacked: false },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Swap Usage",
      },
    },
  });

  cpuChartCanvas.addEventListener("click", () => {
    fileInput.click();
  });

  memoryChartCanvas.addEventListener("click", () => {
    fileInput.click();
  });

  swapChartCanvas.addEventListener("click", () => {
    fileInput.click();
  });

  ioChartCanvas.addEventListener("click", () => {
    fileInput.click();
  });

  document.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  document.addEventListener("drop", async (event) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      for (const item of event.dataTransfer.items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          await loadFile(file);
        }
      }
    } else {
      for (const file of event.dataTransfer.files) {
        await loadFile(file);
      }
    }
  });

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await loadFile(file);
  });

  async function loadFile(file) {
    const text = await file.text();
    const lines = text.split("\n");

    // Reset chart data
    cpuChart.data.labels = [];
    cpuChart.data.datasets.forEach((dataset) => (dataset.data = []));
    ioChart.data.labels = [];
    ioChart.data.datasets.forEach((dataset) => (dataset.data = []));
    memoryChart.data.labels = [];
    memoryChart.data.datasets.forEach((dataset) => (dataset.data = []));
    swapChart.data.labels = [];
    swapChart.data.datasets.forEach((dataset) => (dataset.data = []));
    let i = 0;
    lines.forEach((line) => {
      if (!line.trim() || line.startsWith("procs ") || line.startsWith(" r  b"))
        return; // Ignore empty lines and header lines
      let line_mod = " " + line;
      const parts = line_mod.split(/\s+/);
      let timestamp = parts[19];
      if (!timestamp){
        timestamp = i++;
      }

      cpuChart.data.labels.push(timestamp);
      ioChart.data.labels.push(timestamp);
      cpuChart.data.datasets[0].data.push(parseFloat(parts[13]));
      cpuChart.data.datasets[1].data.push(parseFloat(parts[14]));
      cpuChart.data.datasets[2].data.push(parseFloat(parts[15]));
      cpuChart.data.datasets[3].data.push(parseFloat(parts[16]));
      cpuChart.data.datasets[4].data.push(parseFloat(parts[17]));
      ioChart.data.datasets[0].data.push(parseFloat(parts[5]));
      ioChart.data.datasets[1].data.push(parseFloat(parts[6]));
      memoryChart.data.labels.push(timestamp);
      memoryChart.data.datasets[0].data.push(parseFloat(parts[1]));
      memoryChart.data.datasets[1].data.push(parseFloat(parts[2]));
      memoryChart.data.datasets[2].data.push(parseFloat(parts[3]));
      memoryChart.data.datasets[3].data.push(parseFloat(parts[4]));
      swapChart.data.labels.push(timestamp);
      swapChart.data.datasets[0].data.push(parseFloat(parts[7]));
      swapChart.data.datasets[1].data.push(parseFloat(parts[8]));
    });

    cpuChart.update();
    memoryChart.update();
    swapChart.update();
    ioChart.update();
  }

  function downloadCanvasAsPng(canvas, filename) {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
  
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
  
    // Draw a white background
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
    // Draw the original canvas onto the temporary one
    tempCtx.drawImage(canvas, 0, 0);
  
    // Create the download link
    const link = document.createElement("a");
    link.href = tempCanvas.toDataURL("image/png");
    link.download = filename;
    link.click();
  }
  
  
  const downloadButtons = document.querySelectorAll(".download-btn");
  
  downloadButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      let canvas;
      let filename;
      switch (index) {
        case 0:
          canvas = cpuChartCanvas;
          filename = "cpu-usage.png";
          break;
        case 1:
          canvas = memoryChartCanvas;
          filename = "memory-usage.png";
          break;
        case 2:
          canvas = swapChartCanvas;
          filename = "swap-usage.png";
          break;
        case 3:
          canvas = ioChartCanvas;
          filename = "io-usage.png";
          break;
      }
      downloadCanvasAsPng(canvas, filename);
    });
  });

});
