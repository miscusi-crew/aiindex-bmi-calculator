"use strict";
const $ = (id) => document.getElementById(id);
let unit = "metric";
const n = (id) => Number($(id).value.replace(",", "."));

function run() {
  const m = unit === "metric" ? n("cm") / 100 : (n("ft") * 12 + n("inch")) * 0.0254;
  const kg = unit === "metric" ? n("kg") : n("lb") * 0.45359237;
  if (!(m > 0.5 && m < 2.8 && kg > 10 && kg < 500)) { $("bmi").textContent = "–"; $("cat").textContent = "Enter a height and weight."; return; }
  const bmi = kg / (m * m);
  $("bmi").textContent = bmi.toFixed(1);
  $("cat").textContent = bmi < 18.5 ? "Underweight range" : bmi < 25 ? "Healthy weight range" : bmi < 30 ? "Overweight range" : "Obesity range";
  // Scale from 15 to 40, matching the gradient stops.
  const stops = [[15, 0], [18.5, 18], [25, 50], [30, 70], [40, 100]];
  let pct = 100;
  for (let i = 1; i < stops.length; i++) {
    if (bmi <= stops[i][0]) { const [a, pa] = stops[i - 1], [b, pb] = stops[i]; pct = pa + ((Math.max(bmi, 15) - a) / (b - a)) * (pb - pa); break; }
  }
  $("marker").style.left = `${pct}%`;
}

document.querySelectorAll("[data-u]").forEach((b) => b.addEventListener("click", () => {
  unit = b.dataset.u;
  document.querySelectorAll("[data-u]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
  $("h-metric").hidden = $("w-metric").hidden = unit !== "metric";
  $("h-imp").hidden = $("w-imp").hidden = unit === "metric";
  run();
}));
$("form").addEventListener("input", run);
$("form").addEventListener("submit", (e) => e.preventDefault());
run();
