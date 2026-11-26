const defaultSubjects = [
  { code: "BCA-101", name: "Programming in Python", credits: 4, max: 100, obtained: 86 },
  { code: "BCA-102", name: "HTML & Web Design", credits: 4, max: 100, obtained: 88 },
  { code: "BCA-106", name: "Mathematics", credits: 4, max: 100, obtained: 82 },
  { code: "BCA-104", name: "Computer Fundamentals & Architecture", credits: 3, max: 100, obtained: 79 },
  { code: "BCA-105", name: "Communication Skills", credits: 3, max: 100, obtained: 84 }
];

let subjects = JSON.parse(JSON.stringify(defaultSubjects));

const tbody = document.getElementById("subjectsBody");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const resetBtn = document.getElementById("resetBtn");

function getGradeInfo(percentage) {
  if (percentage >= 90) return { grade: "O", points: 10 };
  if (percentage >= 80) return { grade: "A+", points: 9 };
  if (percentage >= 70) return { grade: "A", points: 8 };
  if (percentage >= 60) return { grade: "B+", points: 7 };
  if (percentage >= 50) return { grade: "B", points: 6 };
  if (percentage >= 40) return { grade: "C", points: 5 };
  return { grade: "F", points: 0 };
}

function renderTable() {
  tbody.innerHTML = "";

  subjects.forEach((sub, index) => {
    const pct = sub.max > 0 ? (sub.obtained / sub.max) * 100 : 0;
    const { grade } = getGradeInfo(pct);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true" data-index="${index}" data-field="code">${sub.code}</td>
      <td contenteditable="true" data-index="${index}" data-field="name">${sub.name}</td>
      <td contenteditable="true" data-index="${index}" data-field="credits">${sub.credits}</td>
      <td contenteditable="true" data-index="${index}" data-field="max">${sub.max}</td>
      <td contenteditable="true" data-index="${index}" data-field="obtained">${sub.obtained}</td>
      <td><strong>${grade}</strong></td>
      <td class="no-print">
        <button type="button" class="delete-btn" onclick="deleteSubject(${index})" title="Remove Subject">×</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  attachCellListeners();
  calculateTotals();
}

function attachCellListeners() {
  const editableCells = tbody.querySelectorAll('[contenteditable="true"]');
  editableCells.forEach((cell) => {
    cell.addEventListener("blur", (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const field = e.target.dataset.field;
      const val = e.target.innerText.trim();

      if (field === "credits" || field === "max" || field === "obtained") {
        const num = parseFloat(val);
        subjects[idx][field] = isNaN(num) || num < 0 ? 0 : num;
      } else {
        subjects[idx][field] = val || "-";
      }
      renderTable();
    });
  });
}

function calculateTotals() {
  let totalCredits = 0;
  let totalMax = 0;
  let totalObtained = 0;
  let weightedPoints = 0;
  let allPassed = subjects.length > 0;

  subjects.forEach((sub) => {
    const pct = sub.max > 0 ? (sub.obtained / sub.max) * 100 : 0;
    const { points } = getGradeInfo(pct);

    totalCredits += sub.credits;
    totalMax += sub.max;
    totalObtained += sub.obtained;
    weightedPoints += sub.credits * points;

    if (pct < 40) {
      allPassed = false;
    }
  });

  const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const sgpa = totalCredits > 0 ? weightedPoints / totalCredits : 0;

  document.getElementById("totalCredits").innerHTML = `<strong>${totalCredits}</strong>`;
  document.getElementById("totalMax").innerHTML = `<strong>${totalMax}</strong>`;
  document.getElementById("totalObtained").innerHTML = `<strong>${totalObtained}</strong>`;
  document.getElementById("percentageDisplay").innerText = `${overallPercentage.toFixed(2)}%`;
  document.getElementById("sgpaDisplay").innerText = sgpa.toFixed(2);

  const statusEl = document.getElementById("resultStatus");
  statusEl.innerText = allPassed ? "PASS" : "FAIL";
  statusEl.className = `summary-value ${allPassed ? "status-pass" : "status-fail"}`;
}

window.deleteSubject = function (index) {
  subjects.splice(index, 1);
  renderTable();
};

addSubjectBtn.addEventListener("click", () => {
  subjects.push({
    code: `BCA-10${subjects.length + 1}`,
    name: "New Subject",
    credits: 4,
    max: 100,
    obtained: 75
  });
  renderTable();
});

resetBtn.addEventListener("click", () => {
  subjects = JSON.parse(JSON.stringify(defaultSubjects));
  renderTable();
});

renderTable();