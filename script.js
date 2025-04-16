let questions = [];
let answers = [];
let index = 0;
let showingQuestion = true;
let interval;
let posX = 100, posY = 100;
let velX = 1.5, velY = 1.2;
let manualStart = true;  // default: only start when Start is clicked


window.onload = function () {
  const saved = JSON.parse(localStorage.getItem("qaList")) || [];

  saved.forEach(item => {
    questions.push(item.question);
    answers.push(item.answer);
  });

  const label = document.getElementById("label");
  label.textContent = "Press Start To Begin.";
  requestAnimationFrame(updateLabelPosition);
};

function saveQuestionAnswer() {
  const q = document.getElementById("question").value.trim();
  const a = document.getElementById("answer").value.trim();

  if (q && a) {
    questions.push(q);
    answers.push(a);

    let qaList = JSON.parse(localStorage.getItem("qaList")) || [];
    qaList.push({ question: q, answer: a });
    localStorage.setItem("qaList", JSON.stringify(qaList));

    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";

    // Only auto-start if manualStart is false
    if (!interval && !manualStart) startSequence();
  } else {
    alert("Please enter both a question and an answer.");
  }
}

function startSequence() {
  if (questions.length === 0 || answers.length === 0 || interval) return;

  if (interval) clearInterval(interval);

  manualStart = false; // Allow auto-restart if user adds new Q&A
showNext(); // Show first item immediately

interval = setInterval(() => {
  const label = document.getElementById("label");
  randomizeLabelShape();

  if (showingQuestion) {
    label.textContent = questions[index];
    label.style.backgroundColor = getRandomColor();
    label.style.color = "black";
  } else {
    label.textContent = answers[index];
    label.style.backgroundColor = "#ffff99"; // Yellow for answers
    label.style.color = "black";
    index = (index + 1) % questions.length;
  }

  showingQuestion = !showingQuestion;
}, 10000);
}


function showNext() {
  const label = document.getElementById("label");
  randomizeLabelShape();

  if (showingQuestion) {
    label.textContent = questions[index];
    label.style.backgroundColor = getRandomColor();
    label.style.color = "black";
  } else {
    label.textContent = answers[index];
    label.style.backgroundColor = "#ffff99"; // Yellow for answers
    label.style.color = "black";
    index = (index + 1) % questions.length;
  }

  showingQuestion = !showingQuestion;
}

function stopSequence() {
  clearInterval(interval);
  interval = null;
  manualStart = true; // Prevent auto-start from saving input

  const label = document.getElementById("label");
  label.textContent = "Press Start To Begin.";
  label.style.backgroundColor = "#4caf50";
  label.style.color = "black";
  label.style.clipPath = "none";
  label.style.borderRadius = "20px";
  label.style.width = "300px";
  label.style.height = "120px";
}
function updateLabelPosition() {
  const label = document.getElementById("label");
  const rect = label.getBoundingClientRect();
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  const margin = 10;

  posX += velX;
  posY += velY;

  if (posX + rect.width + margin >= winWidth) {
    posX = winWidth - rect.width - margin;
    velX *= -1;
  } else if (posX <= margin) {
    posX = margin;
    velX *= -1;
  }

  if (posY + rect.height + margin >= winHeight) {
    posY = winHeight - rect.height - margin;
    velY *= -1;
  } else if (posY <= margin) {
    posY = margin;
    velY *= -1;
  }

  label.style.left = posX + "px";
  label.style.top = posY + "px";

  requestAnimationFrame(updateLabelPosition);
}

function getComplementaryColor(hex) {
  hex = hex.replace("#", "");
  const r = 255 - parseInt(hex.substring(0, 2), 16);
  const g = 255 - parseInt(hex.substring(2, 4), 16);
  const b = 255 - parseInt(hex.substring(4, 6), 16);
  return "#" + [r, g, b].map(val => val.toString(16).padStart(2, '0')).join("");
}

function getRandomColor() {
  const colors = ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0", "#009688", "#ffc107"];
  const chosenColor = colors[Math.floor(Math.random() * colors.length)];
  const complementaryColor = getComplementaryColor(chosenColor);
  document.body.style.backgroundColor = complementaryColor;
  return chosenColor;
}

function randomizeLabelShape() {
  const label = document.getElementById("label");
  const shapes = ["rectangle", "square", "circle", "hexagon", "octagon", "star"];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];

  label.style.transition = "all 0.5s ease-in-out";
  label.style.borderRadius = "0";
  label.style.clipPath = "none";
  label.style.width = "auto";
  label.style.height = "auto";
  label.style.minWidth = "180px";
  label.style.minHeight = "100px";
  label.style.padding = "20px 30px";
  label.style.display = "flex";
  label.style.justifyContent = "center";
  label.style.alignItems = "center";
  label.style.textAlign = "center";
  label.style.fontSize = "24px";

  switch (shape) {
    case "circle":
      label.style.borderRadius = "50%";
      label.style.width = "180px";
      label.style.height = "180px";
      break;
    case "square":
      label.style.borderRadius = "20px";
      label.style.width = "180px";
      label.style.height = "180px";
      break;
    case "rectangle":
      label.style.borderRadius = "20px";
      label.style.width = "300px";
      label.style.height = "120px";
      break;
      case "hexagon":
        label.style.clipPath = "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)";
        label.style.width = "220px";
        label.style.height = "180px";
        break;
      case "octagon":
        label.style.clipPath = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";
        label.style.width = "220px";
        label.style.height = "180px";
        break;
      case "star":
        label.style.clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        label.style.width = "220px";
        label.style.height = "220px";
        break;
  }
}

function clearAll() {
  if (confirm("Are you sure you want to delete all questions and answers?")) {
    localStorage.removeItem("qaList");
    questions = [];
    answers = [];
    index = 0;
    showingQuestion = true;
    stopSequence();
    document.getElementById("label").textContent = "All data cleared. Press Start To Begin.";
  }
}


  
  



