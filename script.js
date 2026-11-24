const form = document.getElementById("resultForm");
    const message = document.getElementById("message");
    const subjects = [
      "Web Technology",
      "Programming in C",
      "Computer Fundamentals",
      "Mathematics",
      "English"
    ];

    function gradeFromPercentage(percentage) {
      if (percentage >= 90) return "A+";
      if (percentage >= 80) return "A";
      if (percentage >= 70) return "B";
      if (percentage >= 60) return "C";
      if (percentage >= 40) return "D";
      return "F";
    }

    function showText(id, value) {
      document.getElementById(id).textContent = value;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("studentName").value.trim();
      const roll = document.getElementById("rollNumber").value.trim();
      const course = document.getElementById("course").value;
      const exam = document.getElementById("exam").value;
      const year = document.getElementById("year").value.trim();
      const markInputs = [...document.querySelectorAll("#subjects input")];

      if (!name || !roll || !course || !year) {
        message.textContent = "Please complete all student details.";
        message.className = "message error";
        return;
      }

      const marks = markInputs.map(input => Number(input.value));
      const hasInvalidMark = markInputs.some((input, index) =>
        input.value.trim() === "" || !Number.isFinite(marks[index]) ||
        marks[index] < 0 || marks[index] > 100
      );

      if (hasInvalidMark) {
        message.textContent = "Enter a valid mark from 0 to 100 for every subject.";
        message.className = "message error";
        return;
      }

      const total = marks.reduce((sum, mark) => sum + mark, 0);
      const maximum = subjects.length * 100;
      const percentage = (total / maximum) * 100;
      const passed = marks.every(mark => mark >= 40);
      const grade = passed ? gradeFromPercentage(percentage) : "F";

      showText("outName", name);
      showText("outRoll", roll);
      showText("outCourse", course);
      showText("outYear", year);
      showText("resultExam", exam);

      const marksBody = document.getElementById("marksBody");
      marksBody.replaceChildren();
      subjects.forEach((subject, index) => {
        const row = document.createElement("tr");
        [subject, "100", String(marks[index])].forEach(value => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        });
        marksBody.appendChild(row);
      });

      showText("outTotal", `${total}/${maximum}`);
      showText("outPercent", `${percentage.toFixed(2)}%`);
      showText("outGrade", grade);

      const status = document.getElementById("outStatus");
      status.textContent = passed ? "PASS" : "FAIL";
      status.className = `status ${passed ? "passed" : "failed"}`;

      document.getElementById("emptyState").style.display = "none";
      document.getElementById("result").style.display = "block";
      message.textContent = "Result calculated successfully.";
      message.className = "message success";
    });

    form.addEventListener("reset", function () {
      message.textContent = "";
      message.className = "message";
      document.getElementById("emptyState").style.display = "flex";
      document.getElementById("result").style.display = "none";
    });

    document.getElementById("printButton").addEventListener("click", function () {
      window.print();
    });

    document.getElementById("editButton").addEventListener("click", function () {
      document.getElementById("studentName").focus();
      document.getElementById("formPanel").scrollIntoView({ behavior: "smooth" });
    });
