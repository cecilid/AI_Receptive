// Progress tracking data structure
let progressData = {
  paraphrasing: {
    exerciseCompleted: false,
    quizCompleted: false,
  },
  starters: {
    exerciseCompleted: false,
    quizCompleted: false,
  },
  connectors: {
    exerciseCompleted: false,
    quizCompleted: false,
  },
  activities: [],
}

// Load progress from localStorage on page load
function loadProgress() {
  const saved = localStorage.getItem("learningHubProgress")
  if (saved) {
    progressData = JSON.parse(saved)
    updateProgressDisplay()
  }
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem("learningHubProgress", JSON.stringify(progressData))
  updateProgressDisplay()
}

// Add activity to history
function addActivity(title, type) {
  const activity = {
    title,
    type,
    timestamp: new Date().toISOString(),
  }
  progressData.activities.unshift(activity)
  if (progressData.activities.length > 10) {
    progressData.activities.pop()
  }
  saveProgress()
}

// Update progress display
function updateProgressDisplay() {
  // Calculate overall progress
  const modules = ["paraphrasing", "starters", "connectors"]
  let totalCompleted = 0
  const totalTasks = 6 // 2 tasks per module (exercise + quiz)

  modules.forEach((module) => {
    if (progressData[module].exerciseCompleted) totalCompleted++
    if (progressData[module].quizCompleted) totalCompleted++
  })

  const overallPercentage = Math.round((totalCompleted / totalTasks) * 100)

  // Update header progress
  document.getElementById("totalProgress").textContent = overallPercentage + "%"

  // Update progress page stats
  document.getElementById("completedExercises").textContent =
    (progressData.paraphrasing.exerciseCompleted ? 1 : 0) +
    (progressData.starters.exerciseCompleted ? 1 : 0) +
    (progressData.connectors.exerciseCompleted ? 1 : 0)

  document.getElementById("quizzesPassed").textContent =
    (progressData.paraphrasing.quizCompleted ? 1 : 0) +
    (progressData.starters.quizCompleted ? 1 : 0) +
    (progressData.connectors.quizCompleted ? 1 : 0)

  document.getElementById("overallScore").textContent = overallPercentage + "%"

  // Update module progress bars
  updateModuleProgress("paraphrasing", "paraphrasingProgress", "paraphrasingBar")
  updateModuleProgress("starters", "startersProgress", "startersBar")
  updateModuleProgress("connectors", "connectorsProgress", "connectorsBar")

  // Update activity list
  updateActivityList()
}

// Update individual module progress
function updateModuleProgress(module, percentageId, barId) {
  const completed = (progressData[module].exerciseCompleted ? 1 : 0) + (progressData[module].quizCompleted ? 1 : 0)
  const percentage = (completed / 2) * 100

  document.getElementById(percentageId).textContent = percentage + "%"
  document.getElementById(barId).style.width = percentage + "%"
}

// Update activity list
function updateActivityList() {
  const activityList = document.getElementById("activityList")

  if (progressData.activities.length === 0) {
    activityList.innerHTML =
      '<p class="empty-state">No activities yet. Start completing exercises to see your progress!</p>'
    return
  }

  activityList.innerHTML = progressData.activities
    .map((activity) => {
      const date = new Date(activity.timestamp)
      const timeAgo = getTimeAgo(date)

      return `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
               // <div class="activity-badge">${activity.type}</div>
            </div>
        `
    })
    .join("")
}

// Get time ago string
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)

  if (seconds < 60) return "Just now"
  if (seconds < 3600) return Math.floor(seconds / 60) + " minutes ago"
  if (seconds < 86400) return Math.floor(seconds / 3600) + " hours ago"
  return Math.floor(seconds / 86400) + " days ago"
}

// Show feedback message
function showFeedback(elementId, message, type) {
  const feedback = document.getElementById(elementId)
  feedback.textContent = message
  feedback.className = `feedback ${type} show`
}

// Navigation
document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const section = tab.dataset.section

    // Update active tab
    document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"))
    tab.classList.add("active")

    // Update active section
    document.querySelectorAll(".content-section").forEach((s) => s.classList.remove("active"))
    document.getElementById(section).classList.add("active")
  })
})

// Paraphrasing Exercise
function submitParaphrasing() {
  const input = document.getElementById("paraphrasingInput").value.trim()

  if (!input) {
    showFeedback("paraphrasingFeedback", "Please write your paraphrase before submitting.", "error")
    return
  }

  const original = "technology has revolutionized the way we communicate"
  const inputLower = input.toLowerCase()

  // Check if it's too similar to original
  if (inputLower.includes("technology has revolutionized")) {
    showFeedback(
      "paraphrasingFeedback",
      "Your paraphrase is too similar to the original. Try using different words and sentence structure.",
      "info",
    )
    return
  }

  // Check if it contains key concepts
  const hasCommConcept =
    inputLower.includes("communicat") ||
    inputLower.includes("interact") ||
    inputLower.includes("connect") ||
    inputLower.includes("talk")
  const hasTechConcept =
    inputLower.includes("tech") || inputLower.includes("digital") || inputLower.includes("innovation")
  const hasChangeConcept =
    inputLower.includes("chang") ||
    inputLower.includes("transform") ||
    inputLower.includes("alter") ||
    inputLower.includes("modif")

  if (hasCommConcept && (hasTechConcept || hasChangeConcept)) {
    showFeedback(
      "paraphrasingFeedback",
      "✓ Great work! Your paraphrase captures the main idea while using different words and structure.",
      "success",
    )

    if (!progressData.paraphrasing.exerciseCompleted) {
      progressData.paraphrasing.exerciseCompleted = true
      addActivity("Completed Paraphrasing Exercise", "Exercise")
    }
  } else {
    showFeedback(
      "paraphrasingFeedback",
      "Your paraphrase should include the key concepts: technology/innovation, change/transformation, and communication.",
      "info",
    )
  }
}

// Paraphrasing Quiz
function checkParaphraseQuiz() {
  const selected = document.querySelector('input[name="paraphrase-quiz"]:checked')

  if (!selected) {
    showFeedback("paraphraseQuizFeedback", "Please select an answer.", "error")
    return
  }

  if (selected.value === "b") {
    showFeedback(
      "paraphraseQuizFeedback",
      "✓ Correct! This option uses different vocabulary (learners, finish, tasks, prior, due date) while maintaining the original meaning.",
      "success",
    )

    if (!progressData.paraphrasing.quizCompleted) {
      progressData.paraphrasing.quizCompleted = true
      addActivity("Passed Paraphrasing Quiz", "Quiz")
    }
  } else if (selected.value === "a") {
    showFeedback(
      "paraphraseQuizFeedback",
      "✗ This is too similar to the original. A good paraphrase should use different sentence structure and vocabulary.",
      "error",
    )
  } else {
    showFeedback("paraphraseQuizFeedback", "✗ This is identical to the original sentence, not a paraphrase.", "error")
  }
}

// Sentence Starters Exercise
function submitStarter() {
  const selected = document.getElementById("starterSelect").value

  if (!selected) {
    showFeedback("starterFeedback", "Please select a sentence starter.", "error")
    return
  }

  if (selected === "correct" || selected === "correct2") {
    showFeedback(
      "starterFeedback",
      "✓ Excellent! This is an appropriate academic sentence starter that maintains objectivity and formality.",
      "success",
    )

    if (!progressData.starters.exerciseCompleted) {
      progressData.starters.exerciseCompleted = true
      addActivity("Completed Sentence Starters Exercise", "Exercise")
    }
  } else {
    showFeedback(
      "starterFeedback",
      "✗ This starter is too informal for academic writing. Choose a more formal, objective phrase.",
      "error",
    )
  }
}

// Sentence Starters Quiz
function checkStarterQuiz() {
  const selected = document.querySelector('input[name="starter-quiz"]:checked')

  if (!selected) {
    showFeedback("starterQuizFeedback", "Please select an answer.", "error")
    return
  }

  if (selected.value === "b") {
    showFeedback(
      "starterQuizFeedback",
      '✓ Correct! "However, it could be argued that..." is perfect for introducing a counterargument in academic writing.',
      "success",
    )

    if (!progressData.starters.quizCompleted) {
      progressData.starters.quizCompleted = true
      addActivity("Passed Sentence Starters Quiz", "Quiz")
    }
  } else {
    showFeedback(
      "starterQuizFeedback",
      "✗ This phrase is too subjective for academic writing. Counterarguments should be introduced with more formal, objective language.",
      "error",
    )
  }
}

// Logical Connectors Exercise
function submitConnector() {
  const selected = document.getElementById("connectorSelect").value

  if (!selected) {
    showFeedback("connectorFeedback", "Please select a connector.", "error")
    return
  }

  if (selected === "correct") {
    showFeedback(
      "connectorFeedback",
      '✓ Perfect! "However" is the right choice because it introduces a contrast between positive results and the need for more research.',
      "success",
    )

    if (!progressData.connectors.exerciseCompleted) {
      progressData.connectors.exerciseCompleted = true
      addActivity("Completed Logical Connectors Exercise", "Exercise")
    }
  } else if (selected === "wrong") {
    showFeedback(
      "connectorFeedback",
      '✗ "In addition" is used to add supporting information, not to introduce a contrasting point.',
      "error",
    )
  } else {
    showFeedback(
      "connectorFeedback",
      '✗ "Therefore" indicates a result or conclusion, but here we need a contrast connector.',
      "error",
    )
  }
}

// Logical Connectors Quiz
function checkConnectorQuiz() {
  const selected = document.querySelector('input[name="connector-quiz"]:checked')

  if (!selected) {
    showFeedback("connectorQuizFeedback", "Please select an answer.", "error")
    return
  }

  if (selected.value === "b") {
    showFeedback(
      "connectorQuizFeedback",
      '✓ Correct! "Consequently" clearly shows a cause-and-effect relationship between two ideas.',
      "success",
    )

    if (!progressData.connectors.quizCompleted) {
      progressData.connectors.quizCompleted = true
      addActivity("Passed Logical Connectors Quiz", "Quiz")
    }
  } else if (selected.value === "a") {
    showFeedback(
      "connectorQuizFeedback",
      '✗ "Furthermore" is used to add information, not to show cause and effect.',
      "error",
    )
  } else {
    showFeedback("connectorQuizFeedback", '✗ "Nevertheless" shows contrast, not cause and effect.', "error")
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProgress()
})
