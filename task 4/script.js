// Quiz Questions Dataset
const quizData = [
    {
        category: "HTML5 Fundamentals",
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Multi Language",
            "Hyper Transfer Method Level",
            "Home Tool Markup Language"
        ],
        correct: 0
    },
    {
        category: "JavaScript ES6+",
        question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
        options: [
            "var",
            "let",
            "define",
            "global"
        ],
        correct: 1
    },
    {
        category: "DOM Manipulation",
        question: "Which method is commonly used to attach an event handler to a DOM element?",
        options: [
            "element.bindEvent()",
            "element.attachListener()",
            "element.addEventListener()",
            "element.onTrigger()"
        ],
        correct: 2
    },
    {
        category: "Web Development",
        question: "What is the correct HTML syntax for linking an external script named 'app.js'?",
        options: [
            "<script href='app.js'>",
            "<script src='app.js'>",
            "<script name='app.js'>",
            "<link rel='script' href='app.js'>"
        ],
        correct: 1
    }
];

// State Variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// DOM Elements
const quizCard = document.getElementById('quiz-card');
const questionText = document.getElementById('question-text');
const categoryTag = document.getElementById('category-tag');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const validationWarning = document.getElementById('validation-warning');

const questionTracker = document.getElementById('question-tracker');
const progressPercent = document.getElementById('progress-percent');
const progressBarFill = document.getElementById('progress-bar-fill');
const liveScore = document.getElementById('live-score');

const quizBody = document.getElementById('quiz-body');
const scoreContainer = document.getElementById('score-container');
const scorePercentage = document.getElementById('score-percentage');
const scoreText = document.getElementById('score-text');
const feedbackMessage = document.getElementById('feedback-message');

/**
 * Load and render active question & choices
 */
function loadQuestion() {
    selectedOptionIndex = null;
    hideValidationWarning();

    const currentQuiz = quizData[currentQuestionIndex];
    
    // Update Question & Category
    categoryTag.textContent = currentQuiz.category;
    questionText.textContent = `${currentQuestionIndex + 1}. ${currentQuiz.question}`;

    // Clear Options Container
    optionsContainer.innerHTML = '';

    // Render Options List
    currentQuiz.options.forEach((optionText, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.type = 'button';
        optionBtn.className = 'option-btn';
        
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
        
        optionBtn.innerHTML = `
            <div class="option-left">
                <span class="option-letter">${optionLetter}</span>
                <span>${escapeHTML(optionText)}</span>
            </div>
            <div class="radio-indicator"></div>
        `;

        optionBtn.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionBtn);
    });

    // Update Progress Bar
    const totalQuestions = quizData.length;
    const progressVal = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    
    questionTracker.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    progressPercent.textContent = `${progressVal}%`;
    progressBarFill.style.width = `${progressVal}%`;
    liveScore.textContent = `${score * 10} pts`;

    // Button Text
    const btnSpan = nextBtn.querySelector('span');
    if (currentQuestionIndex === totalQuestions - 1) {
        btnSpan.textContent = 'Finish Quiz';
    } else {
        btnSpan.textContent = 'Next Question';
    }
}

/**
 * Handle Option Selection
 */
function selectOption(index) {
    selectedOptionIndex = index;
    hideValidationWarning();

    const allOptions = optionsContainer.querySelectorAll('.option-btn');
    allOptions.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

/**
 * Transition to Next Question with Validation
 */
function handleNextQuestion() {
    // Validation Check: Ensure an answer was chosen
    if (selectedOptionIndex === null) {
        triggerValidationFailure();
        return;
    }

    // Check Correct Answer
    if (selectedOptionIndex === quizData[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showScore();
    }
}

/**
 * Trigger Validation Shake Animation & Warning Banner
 */
function triggerValidationFailure() {
    validationWarning.classList.remove('hidden');
    
    // Add Shake Animation to Card
    quizCard.classList.remove('shake');
    void quizCard.offsetWidth; // Force Reflow
    quizCard.classList.add('shake');

    setTimeout(() => {
        quizCard.classList.remove('shake');
    }, 500);
}

/**
 * Hide Warning Banner
 */
function hideValidationWarning() {
    validationWarning.classList.add('hidden');
}

/**
 * Display Final Score Screen
 */
function showScore() {
    quizBody.classList.add('hidden');
    scoreContainer.classList.remove('hidden');

    const totalQuestions = quizData.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    liveScore.textContent = `${score * 10} pts`;
    scorePercentage.textContent = `${percentage}%`;
    scoreText.textContent = `${score} / ${totalQuestions}`;

    if (percentage === 100) {
        feedbackMessage.textContent = "🏆 Perfect Score! You're a Web Development Prodigy!";
    } else if (percentage >= 75) {
        feedbackMessage.textContent = "🌟 Excellent Work! High proficiency in JavaScript & Web concepts.";
    } else if (percentage >= 50) {
        feedbackMessage.textContent = "👍 Good Job! Solid foundation with room to grow.";
    } else {
        feedbackMessage.textContent = "📚 Keep Learning! Practice makes perfect.";
    }
}

/**
 * Restart Quiz
 */
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOptionIndex = null;

    scoreContainer.classList.add('hidden');
    quizBody.classList.remove('hidden');
    loadQuestion();
}

/**
 * Escape HTML Helper
 */
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Event Listeners
nextBtn.addEventListener('click', handleNextQuestion);
restartBtn.addEventListener('click', restartQuiz);

// Initialize Quiz
document.addEventListener('DOMContentLoaded', loadQuestion);
