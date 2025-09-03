// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.burgerMenu = document.getElementById('burgerMenu');
        this.mobileNav = document.getElementById('mobileNav');
        this.init();
    }

    init() {
        if (this.burgerMenu && this.mobileNav) {
            this.burgerMenu.addEventListener('click', () => this.toggleMenu());
            
            // Закрытие меню при клике на overlay
            this.mobileNav.addEventListener('click', (e) => {
                if (e.target === this.mobileNav) {
                    this.closeMenu();
                }
            });

            // Закрытие меню при нажатии Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.mobileNav.classList.contains('active')) {
                    this.closeMenu();
                }
            });

            // Закрытие меню при клике на ссылку
            const navLinks = this.mobileNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }
    }

    toggleMenu() {
        this.burgerMenu.classList.toggle('active');
        this.mobileNav.classList.toggle('active');
        
        // Блокировка скролла при открытом меню
        if (this.mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.burgerMenu.classList.remove('active');
        this.mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
});

// Exercise System
class ExerciseSystem {
    constructor() {
        this.exercises = new Map();
        this.currentExercise = null;
        this.init();
    }

    init() {
        this.loadExercises();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle select exercises
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('exercise-select')) {
                this.handleSelectExercise(e.target);
            }
        });

        // Handle button exercises
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('exercise-option')) {
                this.handleButtonExercise(e.target);
            }
        });

        // Handle text input exercises
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('exercise-input')) {
                this.handleInputExercise(e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('exercise-input')) {
                this.handleInputExercise(e.target, true);
            }
        });

        // Handle next exercise buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-exercise-btn')) {
                this.nextExercise();
            }
        });

        // Handle reset exercise buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('reset-exercise-btn')) {
                this.resetExercise(e.target);
            }
        });
    }

    handleSelectExercise(select) {
        const correctAnswer = select.dataset.answer;
        const selectedValue = select.value;
        const exerciseDiv = select.closest('.exercise');
        const feedback = exerciseDiv.querySelector('.exercise-feedback');
        const explanation = select.dataset.explanation || '';
        
        if (!selectedValue) {
            feedback.textContent = '';
            feedback.className = 'exercise-feedback';
            return;
        }

        if (selectedValue === correctAnswer) {
            feedback.innerHTML = '✅ <strong>Правильно!</strong>';
            feedback.className = 'exercise-feedback correct';
            this.updateExerciseProgress(exerciseDiv, true);
        } else {
            const correctExplanation = this.getCorrectAnswerExplanation(correctAnswer, select);
            feedback.innerHTML = `❌ <strong>Неправильно.</strong><br>
                <div class="explanation-details">
                    <strong>Правильный ответ:</strong> ${correctAnswer}<br>
                    ${correctExplanation}
                </div>`;
            feedback.className = 'exercise-feedback incorrect';
        }
    }

    handleButtonExercise(button) {
        const exerciseDiv = button.closest('.exercise');
        const feedback = exerciseDiv.querySelector('.exercise-feedback');
        const allButtons = exerciseDiv.querySelectorAll('.exercise-option');
        const isCorrect = button.dataset.answer === 'correct';
        const explanation = button.dataset.explanation || '';
        
        // Reset all buttons
        allButtons.forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect');
        });

        // Mark selected button
        button.classList.add('selected');
        
        if (isCorrect) {
            button.classList.add('correct');
            feedback.innerHTML = '✅ <strong>Правильно!</strong>';
            feedback.className = 'exercise-feedback correct';
            this.updateExerciseProgress(exerciseDiv, true);
        } else {
            button.classList.add('incorrect');
            const correctButton = exerciseDiv.querySelector('[data-answer="correct"]');
            const correctAnswer = correctButton ? correctButton.textContent : 'не найден';
            const correctExplanation = correctButton ? correctButton.dataset.explanation || '' : '';
            
            feedback.innerHTML = `❌ <strong>Неправильно.</strong><br>
                <div class="explanation-details">
                    <strong>Правильный ответ:</strong> ${correctAnswer}<br>
                    ${correctExplanation}
                </div>`;
            feedback.className = 'exercise-feedback incorrect';
        }
    }

    handleInputExercise(input, checkAnswer = false) {
        if (!checkAnswer && input.value.length < 2) return;
        
        const correctAnswers = input.dataset.answer.toLowerCase().split('|').map(a => a.trim());
        const userAnswer = input.value.toLowerCase().trim();
        const exerciseDiv = input.closest('.exercise');
        const feedback = exerciseDiv.querySelector('.exercise-feedback');
        const explanation = input.dataset.explanation || '';
        
        if (!userAnswer) {
            feedback.textContent = '';
            feedback.className = 'exercise-feedback';
            return;
        }

        const isCorrect = correctAnswers.some(answer => answer === userAnswer);

        if (isCorrect) {
            feedback.innerHTML = '✅ <strong>Правильно!</strong>';
            feedback.className = 'exercise-feedback correct';
            input.classList.add('correct');
            this.updateExerciseProgress(exerciseDiv, true);
        } else if (checkAnswer) {
            const correctAnswer = input.dataset.answer.split('|')[0];
            feedback.innerHTML = `❌ <strong>Неправильно.</strong><br>
                <div class="explanation-details">
                    <strong>Правильный ответ:</strong> ${correctAnswer}<br>
                    ${explanation}
                </div>`;
            feedback.className = 'exercise-feedback incorrect';
            input.classList.add('incorrect');
        }
    }

    getCorrectAnswerExplanation(correctAnswer, element) {
        const explanations = {
            'der': 'Мужской род в именительном падеже',
            'die': 'Женский род или множественное число',
            'das': 'Средний род в именительном падеже',
            'den': 'Мужской род в винительном падеже (Akkusativ)',
            'dem': 'Мужской/средний род в дательном падеже (Dativ)',
            'des': 'Мужской/средний род в родительном падеже',
            'einen': 'Неопределенный артикль мужского рода в Akkusativ',
            'eine': 'Неопределенный артикль женского рода или множественного числа',
            'einem': 'Неопределенный артикль мужского/среднего рода в Dativ',
            'einer': 'Неопределенный артикль женского рода в Dativ'
        };
        
        return explanations[correctAnswer] || element.dataset.explanation || 'Подробное объяснение в теории.';
    }

    updateExerciseProgress(exerciseDiv, isCorrect) {
        if (!isCorrect) return;
        
        // Mark exercise as completed
        exerciseDiv.dataset.completed = 'true';
        
        // Update progress for the topic
        const progressSection = exerciseDiv.closest('.exercise-container') || document;
        const allExercises = progressSection.querySelectorAll('.exercise');
        const completedExercises = progressSection.querySelectorAll('.exercise[data-completed="true"]');
        const progressBar = progressSection.querySelector('.progress-fill');
        const progressText = progressSection.querySelector('.completed-count');
        
        if (progressBar && progressText) {
            const percentage = (completedExercises.length / allExercises.length) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = completedExercises.length;
        }

        // Show next exercise button if available
        const nextBtn = exerciseDiv.querySelector('.next-exercise-btn');
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    }

    nextExercise() {
        const currentExercise = document.querySelector('.exercise.active');
        if (currentExercise) {
            const nextExercise = currentExercise.nextElementSibling;
            if (nextExercise && nextExercise.classList.contains('exercise')) {
                currentExercise.classList.remove('active');
                nextExercise.classList.add('active');
                nextExercise.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    resetExercise(button) {
        const exerciseDiv = button.closest('.exercise');
        
        // Reset all form elements
        const selects = exerciseDiv.querySelectorAll('select');
        selects.forEach(select => select.selectedIndex = 0);
        
        const inputs = exerciseDiv.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        });
        
        const buttons = exerciseDiv.querySelectorAll('.exercise-option');
        buttons.forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Clear feedback
        const feedback = exerciseDiv.querySelector('.exercise-feedback');
        if (feedback) {
            feedback.textContent = '';
            feedback.className = 'exercise-feedback';
        }
        
        // Mark as not completed
        exerciseDiv.dataset.completed = 'false';
        
        // Update progress
        this.updateProgress();
    }

    updateProgress() {
        const allExercises = document.querySelectorAll('.exercise');
        const completedExercises = document.querySelectorAll('.exercise[data-completed="true"]');
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.completed-count');
        
        if (progressBar && progressText) {
            const percentage = (completedExercises.length / allExercises.length) * 100;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = completedExercises.length;
        }
    }

    loadExercises() {
        // This will be expanded when we create exercise pages
        console.log('Exercise system initialized');
    }
}

// Pronunciation System
class PronunciationSystem {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.germanVoice = null;
        this.init();
    }

    init() {
        this.loadVoices();
        this.setupEventListeners();
        
        // Load voices when they change
        this.synthesis.addEventListener('voiceschanged', () => {
            this.loadVoices();
        });
    }

    loadVoices() {
        const voices = this.synthesis.getVoices();
        this.germanVoice = voices.find(voice => 
            voice.lang.startsWith('de') || 
            voice.lang.includes('DE')
        );
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pronunciation-btn') || 
                e.target.closest('.pronunciation-btn')) {
                const btn = e.target.classList.contains('pronunciation-btn') ? 
                    e.target : e.target.closest('.pronunciation-btn');
                const word = btn.dataset.word || btn.textContent;
                this.pronounceWord(word);
            }
        });
    }

    pronounceWord(word) {
        if (!this.synthesis) {
            console.log('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        // Clean the word
        const cleanWord = word.replace(/[^\w\säöüÄÖÜß]/g, '').trim();
        
        if (!cleanWord) return;

        const utterance = new SpeechSynthesisUtterance(cleanWord);
        utterance.lang = 'de-DE';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        if (this.germanVoice) {
            utterance.voice = this.germanVoice;
        }
        
        this.synthesis.speak(utterance);
    }
}

// Progress Tracking System
class ProgressTracker {
    constructor() {
        this.storageKey = 'deutsch-progress';
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Track completed exercises
        document.addEventListener('exerciseCompleted', (e) => {
            const { topic, exerciseId } = e.detail;
            this.markExerciseCompleted(topic, exerciseId);
        });
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {
                topics: {},
                exercises: {},
                vocabulary: {},
                lastActivity: null
            };
        } catch (error) {
            console.log('Error loading progress:', error);
            return {
                topics: {},
                exercises: {},
                vocabulary: {},
                lastActivity: null
            };
        }
    }

    saveProgress() {
        try {
            this.progress.lastActivity = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        } catch (error) {
            console.log('Error saving progress:', error);
        }
    }

    markExerciseCompleted(topic, exerciseId) {
        if (!this.progress.exercises[topic]) {
            this.progress.exercises[topic] = {};
        }
        
        this.progress.exercises[topic][exerciseId] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        
        this.saveProgress();
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        // Update progress bars and statistics
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const topic = bar.dataset.topic;
            if (topic && this.progress.exercises[topic]) {
                const completed = Object.keys(this.progress.exercises[topic]).length;
                const total = bar.dataset.total || 10;
                const percentage = (completed / total) * 100;
                bar.style.width = `${Math.min(percentage, 100)}%`;
            }
        });
    }

    getTopicProgress(topic) {
        return this.progress.exercises[topic] || {};
    }

    getTotalProgress() {
        const topics = Object.keys(this.progress.exercises);
        if (topics.length === 0) return 0;
        
        const totalCompleted = topics.reduce((sum, topic) => {
            return sum + Object.keys(this.progress.exercises[topic]).length;
        }, 0);
        
        return totalCompleted;
    }
}

// Initialize all systems
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core systems
    new MobileNavigation();
    new ExerciseSystem();
    new PronunciationSystem();
    new ProgressTracker();
    
    console.log('🇩🇪 Deutsch A1.2 - Все системы инициализированы!');
});