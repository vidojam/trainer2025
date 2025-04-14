const label = document.getElementById("label");
const qaContainer = document.getElementById("qaContainer");
const addQA = document.getElementById("addQA");
const saveQA = document.getElementById("saveQA");
const startBtn = document.getElementById("startBtn");
const inputSection = document.getElementById("inputSection");
const stopBtn = document.getElementById("stopBtn");


let qaList = [];
let currentIndex = 0;
let showingQuestion = true;
let intervalId = null;

label.textContent = "Press Start To Begin.";


// Load from localStorage
function loadQA() {
  const stored = localStorage.getItem("qaList");
  qaList = stored ? JSON.parse(stored) : [];
}

// Save Q&A from input fields
function saveQAList() {
    qaList = [];
    const pairs = qaContainer.querySelectorAll(".qa-pair");
    pairs.forEach(pair => {
      const qInput = pair.querySelector(".question");
      const aInput = pair.querySelector(".answer");
      const q = qInput.value.trim();
      const a = aInput.value.trim();
      if (q && a) {
        qaList.push({ question: q, answer: a });
      }
    });
  
    localStorage.setItem("qaList", JSON.stringify(qaList));
    currentIndex = 0;
    showingQuestion = true;
    updateLabel();
    inputSection.style.display = "none"; // hide entry form
  
    startRotation(); // 🟢 Auto-start on save
  }
  
  let posX = 100;
  let posY = 100;
  let velX = 1.5;
  let velY = 1.5;
  
  function updateLabelPosition() {
    const label = document.getElementById("label");
    const rect = label.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
  
    posX += velX;
    posY += velY;
  
    // Horizontal boundary
    if (posX + rect.width >= winWidth) {
      posX = winWidth - rect.width;
      velX *= -1;
    } else if (posX <= 0) {
      posX = 0;
      velX *= -1;
    }
  
    // Vertical boundary
    if (posY + rect.height >= winHeight) {
      posY = winHeight - rect.height;
      velY *= -1;
    } else if (posY <= 0) {
      posY = 0;
      velY *= -1;
    }
  
    label.style.left = posX + "px";
    label.style.top = posY + "px";
  }
  
  


// Show question or answer alternately
function updateLabel() {
    if (qaList.length === 0) {
      label.textContent = "Your question will appear here...";
      label.style.backgroundColor = "#4caf50";
      return;
    }
  
    const current = qaList[currentIndex];
  
    if (showingQuestion) {
      label.textContent = current.question;
      label.style.backgroundColor = "#4caf50";
    } else {
      label.textContent = current.answer;
      label.style.backgroundColor = "#ffeb3b";
    }
  
    // ➕ Add this line to randomize shape every time
    randomizeLabelShape();
  
    if (!showingQuestion) {
      currentIndex = (currentIndex + 1) % qaList.length;
    }
  
    showingQuestion = !showingQuestion;
  }
  

    randomizeLabelShape(); // Call the function to randomize shape

    function randomizeLabelShape() {
      const shapes = ["rectangle", "square", "circle"];
      const colors = ["#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0", "#009688", "#ffc107"];
      const chosenShape = shapes[Math.floor(Math.random() * shapes.length)];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      const complementaryColor = getComplementaryColor(chosenColor);

      // Set label color
      label.style.backgroundColor = chosenColor;

      // Set background color of the screen
      document.body.style.backgroundColor = complementaryColor;

    
      label.classList.remove("spin");
      void label.offsetWidth;
      label.classList.add("spin");
    
      label.style.backgroundColor = chosenColor;
      label.style.borderRadius = "20px"; // Default rounded
      label.style.width = "auto";
      label.style.height = "auto";
      label.style.padding = "20px 40px";
      label.style.display = "inline-block";
      label.style.justifyContent = "center";
      label.style.alignItems = "center";
    
      if (chosenShape === "square") {
        label.style.display = "flex";
        label.style.padding = "20px";
        label.style.width = "min-content";
        label.style.height = "min-content";
      }
    
      if (chosenShape === "circle") {
        // Make it a big pill or full circle if possible
        label.style.display = "inline-flex";
        label.style.padding = "40px";
        label.style.borderRadius = "50%";
        label.style.minWidth = "180px";
        label.style.minHeight = "180px";
        label.style.width = "auto";
        label.style.height = "auto";
        label.style.flexDirection = "column";
        label.style.alignItems = "center";
        label.style.justifyContent = "center";
        label.style.textAlign = "center";
      }
    }
    
    function getComplementaryColor(hex) {
      // Remove "#" if present
      hex = hex.replace("#", "");
    
      // Convert to RGB
      const r = 255 - parseInt(hex.substring(0, 2), 16);
      const g = 255 - parseInt(hex.substring(2, 4), 16);
      const b = 255 - parseInt(hex.substring(4, 6), 16);
    
      // Convert back to hex
      const compHex = "#" + [r, g, b]
        .map(val => val.toString(16).padStart(2, '0'))
        .join("");
    
      return compHex;
    }
    
    
    
      

// Add Q&A input fields
addQA.onclick = () => {
  const div = document.createElement("div");
  div.className = "qa-pair";

  const qInput = document.createElement("input");
  qInput.className = "question";
  qInput.placeholder = "Question";

  const aInput = document.createElement("input");
  aInput.className = "answer";
  aInput.placeholder = "Answer";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = () => div.remove();

  div.appendChild(qInput);
  div.appendChild(aInput);
  div.appendChild(deleteBtn);
  qaContainer.appendChild(div);
};

// Save Q&A to storage
saveQA.onclick = () => {
  saveQAList();
  renderQA();
};

// Render saved Q&A for editing (if needed)
function renderQA() {
  qaContainer.innerHTML = "";
  qaList.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "qa-pair";

    const qInput = document.createElement("input");
    qInput.className = "question";
    qInput.value = item.question;

    const aInput = document.createElement("input");
    aInput.className = "answer";
    aInput.value = item.answer;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => {
      qaList.splice(index, 1);
      saveQAList();
      renderQA();
    };

    div.appendChild(qInput);
    div.appendChild(aInput);
    div.appendChild(deleteBtn);
    qaContainer.appendChild(div);
  });
}



// Bouncing label animation
function startBouncingLabel() {
  const label = document.getElementById("label");
  label.textContent = "Press Start To Begin."; // 👈 Set initial label text

  let dx = 1.3, dy = 1.1;

  function animate() {
    const rect = label.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    x += dx;
    y += dy;

    if (x + rect.width >= winWidth || x <= 0) dx = -dx;
    if (y + rect.height >= winHeight || y <= 0) dy = -dy;

    label.style.left = `${x}px`;
    label.style.top = `${y}px`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

setInterval(updateLabelPosition, 20); // 🟢 Moves the label continuously


// Start alternating Q & A every 10s
function startRotation() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(updateLabel, 10000);
}

stopBtn.onclick = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      label.textContent = "Program stopped.";
      label.style.backgroundColor = "#4caf50";
    }
  };

// Start button logic
startBtn.onclick = () => {
    if (qaList.length === 0) {
      alert("Please save at least one question/answer pair first.");
      return;
    }
  
    if (intervalId) return; // already running
  
    updateLabel(); // show first question
    startRotation(); // begin Q&A cycling
  };
  

// Init
loadQA();
renderQA(); 
updateLabel();
startBouncingLabel();

stopBtn.onclick = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      label.textContent = "Program stopped.";
      label.style.backgroundColor = "#4caf50";
    }
  };

  // Removed duplicate randomizeLabelShape function
  
  



