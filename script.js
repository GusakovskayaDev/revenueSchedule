
const data = {
  "Выручка руб.": [300000, 300000, 270000, 150000, 170000, 290000, 310000],
  "Наличные": [100000, 100000, 90000, 60000, 50000, 40000, 45000],
  "Безналичный расчет": [100000, 100000, 90000, 75000, 95000, 105000, 106000],
  "Кредитные карты": [100521, 100521, 100521, 100000, 90000, 110000, 10000],
  "Средний чек. руб.": [1300, 1000, 900, 1100, 1200, 1300, 1300],
  "Средний гость руб.": [1200, 1300, 1200, 1100, 1000, 1200, 1200],
  "Удаление из чека (после оплаты) руб.": [1000, 1100, 900, 700, 900, 799, 1000],
  "Удаление из чека (до оплаты) руб.": [1300, 1300, 900, 700, 550, 400, 500],
  "Количество чеков": [34, 36, 30, 29, 30, 28, 16],
  "Количество гостей": [34, 36, 38, 35, 32, 20, 21],
};

// Рисование графика на canvas
function drawGraph(canvas, values) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 150;
  const padding = 20;

  const maxValue = Math.max(...values);
  const xStep = (width - 2 * padding) / (values.length - 1);
  const yScale = (height - 2 * padding) / maxValue;

  // Очистка
  ctx.clearRect(0, 0, width, height);

  // Сетка
  ctx.strokeStyle = "#ddd";
  ctx.beginPath();
  for (let i = 0; i <= maxValue; i += maxValue / 5) {
    const y = height - padding - i * yScale;
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
  }
  ctx.stroke();

  // Линия графика
  ctx.strokeStyle = "#007bff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = padding + index * xStep;
    const y = height - padding - value * yScale;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Точки
  ctx.fillStyle = "#007bff";
  values.forEach((value, index) => {
    const x = padding + index * xStep;
    const y = height - padding - value * yScale;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}

// Логика взаимодействия
document.querySelectorAll(".schedule-item").forEach((item) => {
  item.addEventListener("click", () => {
    const graph = item.nextElementSibling;

    if (!graph.classList.contains("schedule-graph")) return;

    const canvas = graph.querySelector("canvas");

    // Убираем активный график, если он уже видим
    if (graph.classList.contains("active")) {
      graph.classList.remove("active");
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Скрыть все графики
    document.querySelectorAll(".schedule-graph.active").forEach((activeGraph) => {
      activeGraph.classList.remove("active");
      activeGraph.querySelector("canvas").getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    });

    // Показать текущий график
    const title = item.querySelector(".schedule-cell").textContent.trim();
    if (data[title]) {
      graph.classList.add("active");
      drawGraph(canvas, data[title]);
    }
  });
});

// Выбираем все ячейки с классом "yesterday"
document.querySelectorAll('.schedule-cell.yesterday').forEach(cell => {
  const percentageDiv = cell.querySelector('div:last-child');
  const percentageText = percentageDiv.textContent.trim();
  const percentageValue = parseFloat(percentageText.replace('%', ''));

  if (!isNaN(percentageValue)) {
    if (percentageValue >= 0) {
      cell.classList.add('positive');
    } else {
      cell.classList.add('negative');
    }
  }
});