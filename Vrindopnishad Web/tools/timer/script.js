// Tool Selector
class ToolManager {
    constructor() {
        this.toolBtns = document.querySelectorAll('.tool-btn');
        this.sections = document.querySelectorAll('.tool-section');
        this.bindEvents();
    }

    bindEvents() {
        this.toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                this.switchTool(tool);
            });
        });

        // Keyboard shortcut for switching tools
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                const activeBtn = document.querySelector('.tool-btn.active');
                const nextBtn = activeBtn.nextElementSibling || this.toolBtns[0];
                nextBtn.click();
            }
        });
    }

    switchTool(tool) {
        this.toolBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
        this.sections.forEach(section => {
            section.classList.toggle('active', section.id === `${tool}-section`);
        });
    }
}

// Clock
class Clock {
    constructor() {
        this.clockTime = document.querySelector('.clock-time');
        this.clockDate = document.querySelector('.clock-date');
        this.worldClockList = document.querySelector('.world-clock-list');
        this.timeZones = [
            { city: 'New York', zone: 'America/New_York' },
            { city: 'London', zone: 'Europe/London' },
            { city: 'Tokyo', zone: 'Asia/Tokyo' },
            { city: 'Sydney', zone: 'Australia/Sydney' }
        ];
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        
        // Update local time
        this.clockTime.textContent = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Update date
        this.clockDate.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update world clock
        this.updateWorldClock(now);
    }

    updateWorldClock(now) {
        this.worldClockList.innerHTML = this.timeZones.map(({ city, zone }) => {
            const time = now.toLocaleTimeString('en-US', {
                timeZone: zone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            return `
                <div class="world-clock-item">
                    <span class="city">${city}</span>
                    <span class="time">${time}</span>
                </div>
            `;
        }).join('');
    }
}

// Timer Class (existing code with updated IDs)
class Timer {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.remainingTime = 0;
        this.timerId = null;
        this.originalTime = 0;

        // UI Elements
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.timerDisplay = document.getElementById('timer-time');
        this.progressRing = document.querySelector('.progress-ring-circle');
        this.startBtn = document.getElementById('timer-start-btn');
        this.pauseBtn = document.getElementById('timer-pause-btn');
        this.resetBtn = document.getElementById('timer-reset-btn');

        // Calculate progress ring circumference based on viewport
        this.updateCircumference();
        window.addEventListener('resize', () => this.updateCircumference());

        this.bindEvents();
        this.initializeTheme();
    }

    updateCircumference() {
        const progressContainer = document.querySelector('.timer-progress');
        const containerWidth = progressContainer.offsetWidth;
        const radius = containerWidth * 0.4375; // 140/320 = 0.4375 (original ratio)
        this.circumference = radius * 2 * Math.PI;
        
        // Update SVG circle radius and stroke-dasharray
        this.progressRing.setAttribute('r', radius);
        this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        
        // Also update the background circle
        const bgCircle = document.querySelector('.progress-ring-circle-bg');
        bgCircle.setAttribute('r', radius);
        
        // Center both circles
        const center = containerWidth / 2;
        this.progressRing.setAttribute('cx', center);
        this.progressRing.setAttribute('cy', center);
        bgCircle.setAttribute('cx', center);
        bgCircle.setAttribute('cy', center);
        
        // Update SVG viewBox
        const svg = document.querySelector('.progress-ring');
        svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerWidth}`);
    }

    bindEvents() {
        // Timer control buttons
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Preset time buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                this.setTime(0, minutes, 0);
                // Auto-start timer when preset is selected
                if (!this.isRunning) {
                    this.start();
                }
            });
        });

        // Input validation and real-time updates
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', () => {
                let value = parseInt(input.value) || 0;
                const max = parseInt(input.max);
                if (value > max) value = max;
                if (value < 0) value = 0;
                input.value = value;
                this.updateDisplay();
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            this.saveTheme();
        });
    }

    initializeTheme() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    saveTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    setTime(hours, minutes, seconds) {
        this.hoursInput.value = hours;
        this.minutesInput.value = minutes;
        this.secondsInput.value = seconds;
        this.remainingTime = hours * 3600 + minutes * 60 + seconds;
        this.originalTime = this.remainingTime;
        this.updateDisplay();
    }

    getTimeInSeconds() {
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        return hours * 3600 + minutes * 60 + seconds;
    }

    updateDisplay() {
        const hours = Math.floor(this.remainingTime / 3600);
        const minutes = Math.floor((this.remainingTime % 3600) / 60);
        const seconds = this.remainingTime % 60;

        this.timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Update progress ring
        if (this.originalTime > 0) {
            const progress = this.remainingTime / this.originalTime;
            const offset = this.circumference - (progress * this.circumference);
            this.progressRing.style.strokeDashoffset = offset;
        }
    }

    start() {
        if (this.isRunning) return;

        const totalTime = this.getTimeInSeconds();
        if (totalTime <= 0) return;

        if (!this.remainingTime || this.remainingTime <= 0) {
            this.remainingTime = totalTime;
            this.originalTime = totalTime;
        }

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.disableInputs(true);

        this.timerId = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();

            if (this.remainingTime <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;

        clearInterval(this.timerId);
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    reset() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.startTime = 0;
        this.remainingTime = 0;
        this.originalTime = 0;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.disableInputs(false);
        this.hoursInput.value = '0';
        this.minutesInput.value = '0';
        this.secondsInput.value = '0';
        this.updateDisplay();
        this.progressRing.style.strokeDashoffset = this.circumference;
    }

    disableInputs(disabled) {
        this.hoursInput.disabled = disabled;
        this.minutesInput.disabled = disabled;
        this.secondsInput.disabled = disabled;
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.disabled = disabled;
        });
    }

    complete() {
        this.pause();
        this.playAlarm();
        this.showNotification();
        this.disableInputs(false);
    }

    playAlarm() {
        // Create and play a more pleasant alarm sound
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator for the beep
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Configure sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        
        // Create a pleasant fade in/out effect
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
        
        // Play the sound
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 1);
        
        // Vibrate device if supported
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    showNotification() {
        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: 'Your focus time has ended.',
                icon: '../../image/icon_main_02.png',
                badge: '../../image/icon_main_02.png',
                vibrate: [200, 100, 200]
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
        }
    }
}

// Stopwatch
class Stopwatch {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.intervalId = null;
        this.laps = [];

        // UI Elements
        this.display = document.querySelector('.stopwatch-time');
        this.lapIndicator = document.querySelector('.lap-indicator');
        this.lapList = document.querySelector('.lap-list');
        this.startBtn = document.getElementById('stopwatch-start-btn');
        this.lapBtn = document.getElementById('stopwatch-lap-btn');
        this.resetBtn = document.getElementById('stopwatch-reset-btn');

        this.bindEvents();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.toggle());
        this.lapBtn.addEventListener('click', () => this.lap());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.stopwatch-section').classList.contains('active')) {
                if (e.code === 'Space') {
                    e.preventDefault();
                    this.toggle();
                } else if (e.code === 'KeyL') {
                    this.lap();
                } else if (e.code === 'KeyR') {
                    this.reset();
                }
            }
        });
    }

    toggle() {
        if (!this.isRunning) {
            this.start();
        } else {
            this.pause();
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.intervalId = setInterval(() => this.updateDisplay(), 10);

        this.startBtn.innerHTML = '<i class="fas fa-pause"></i>Pause';
        this.lapBtn.disabled = false;
        this.resetBtn.disabled = false;
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.intervalId);
        this.elapsedTime = Date.now() - this.startTime;

        this.startBtn.innerHTML = '<i class="fas fa-play"></i>Start';
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapList();
        this.lapIndicator.textContent = 'Lap 0';
        this.lapBtn.disabled = true;
        this.resetBtn.disabled = true;
    }

    lap() {
        const lapTime = this.formatTime(this.elapsedTime);
        this.laps.unshift({
            number: this.laps.length + 1,
            time: lapTime
        });
        this.updateLapList();
        this.lapIndicator.textContent = `Lap ${this.laps.length}`;
    }

    updateDisplay() {
        const currentTime = this.isRunning ? Date.now() - this.startTime : this.elapsedTime;
        this.display.textContent = this.formatTime(currentTime);
    }

    formatTime(ms) {
        const date = new Date(ms);
        return date.toISOString().substr(11, 12);
    }

    updateLapList() {
        this.lapList.innerHTML = this.laps.map(lap => `
            <div class="lap-item">
                <span class="lap-number">Lap ${lap.number}</span>
                <span class="lap-time">${lap.time}</span>
            </div>
        `).join('');
    }
}

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.follower = document.createElement('div');
        this.follower.className = 'custom-cursor-follower';
        this.focusMode = document.createElement('div');
        this.focusMode.className = 'focus-mode';
        this.meditationMode = document.createElement('div');
        this.meditationMode.className = 'meditation-mode';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.follower);
        document.body.appendChild(this.focusMode);
        document.body.appendChild(this.meditationMode);
        
        this.isFocusMode = false;
        this.isMeditationMode = false;
        this.cursorX = 0;
        this.cursorY = 0;
        
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => this.setPosition(e));
        
        // Focus mode toggle
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f') {
                this.toggleFocusMode();
            } else if (e.key === 'm') {
                this.toggleMeditationMode();
            }
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('button, input, a, .tool-btn, .preset-btn');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.follower.classList.add('hover');
            });
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.follower.classList.remove('hover');
            });
        });
    }

    setPosition(e) {
        this.cursorX = e.clientX;
        this.cursorY = e.clientY;
        
        // Update cursor position with smooth animation
        this.cursor.style.transform = `translate(${this.cursorX - 10}px, ${this.cursorY - 10}px)`;
        this.follower.style.transform = `translate(${this.cursorX - 25}px, ${this.cursorY - 25}px)`;
        
        // Update focus mode gradient position
        if (this.isFocusMode) {
            this.focusMode.style.setProperty('--cursor-x', `${this.cursorX}px`);
            this.focusMode.style.setProperty('--cursor-y', `${this.cursorY}px`);
        }
    }

    toggleFocusMode() {
        this.isFocusMode = !this.isFocusMode;
        this.focusMode.classList.toggle('active', this.isFocusMode);
        
        // Disable/enable scrolling
        document.body.style.overflow = this.isFocusMode ? 'hidden' : '';
        
        // Show/hide cursor based on focus mode
        this.cursor.style.opacity = this.isFocusMode ? '0' : '1';
        this.follower.style.opacity = this.isFocusMode ? '0' : '1';
    }

    toggleMeditationMode() {
        this.isMeditationMode = !this.isMeditationMode;
        this.meditationMode.classList.toggle('active', this.isMeditationMode);
        
        if (this.isMeditationMode) {
            // Create breathing circle
            const breathingCircle = document.createElement('div');
            breathingCircle.className = 'breathing-circle';
            this.meditationMode.appendChild(breathingCircle);
            
            // Add meditation instructions
            const instructions = document.createElement('div');
            instructions.className = 'meditation-instructions';
            instructions.innerHTML = `
                <h2>Meditation Mode</h2>
                <p>Follow the breathing circle</p>
                <p>Press 'M' to exit</p>
            `;
            this.meditationMode.appendChild(instructions);
            
            // Disable scrolling and hide cursor
            document.body.style.overflow = 'hidden';
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
        } else {
            // Clean up meditation mode
            this.meditationMode.innerHTML = '';
            document.body.style.overflow = '';
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
        }
    }
}

// Back Button Enhancement
class BackButton {
    constructor() {
        this.backBtn = document.querySelector('.back-btn');
        this.bindEvents();
    }

    bindEvents() {
        // Show back button text on hover for mobile
        if (window.innerWidth <= 768) {
            this.backBtn.addEventListener('mouseenter', () => {
                this.backBtn.style.width = 'auto';
            });

            this.backBtn.addEventListener('mouseleave', () => {
                this.backBtn.style.width = 'initial';
            });
        }

        // Keyboard shortcut for back (Esc key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                window.location.href = '../../index.html';
            }
        });

        // Confirm before leaving if timer is running
        window.addEventListener('beforeunload', (e) => {
            const timer = document.querySelector('.timer-section');
            if (timer && timer.classList.contains('active')) {
                const timerInstance = document.querySelector('.timer-container').__timer;
                if (timerInstance && timerInstance.isRunning) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            }
        });

        // Add touch swipe for back gesture
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            const touchX = e.touches[0].clientX;
            const diff = touchX - touchStartX;

            if (diff > 100) { // Right swipe
                window.location.href = '../../index.html';
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const backButton = new BackButton();
    const toolManager = new ToolManager();
    const clock = new Clock();
    const timer = new Timer();
    const stopwatch = new Stopwatch();
    const cursor = new CustomCursor();
    
    // Store timer instance for beforeunload check
    document.querySelector('.timer-container').__timer = timer;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (timer.isRunning) {
                timer.pause();
            } else {
                timer.start();
            }
        } else if (e.code === 'KeyR') {
            timer.reset();
        } else if (e.code === 'Digit1') {
            timer.setTime(0, 5, 0);
        } else if (e.code === 'Digit2') {
            timer.setTime(0, 10, 0);
        } else if (e.code === 'Digit3') {
            timer.setTime(0, 15, 0);
        } else if (e.code === 'Digit4') {
            timer.setTime(0, 25, 0);
        } else if (e.code === 'Digit5') {
            timer.setTime(0, 30, 0);
        } else if (e.code === 'Digit6') {
            timer.setTime(1, 0, 0);
        }
    });
    
    // Add touch support for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                // Swipe up - start timer
                timer.start();
            } else {
                // Swipe down - reset timer
                timer.reset();
            }
            touchStartY = touchY;
        }
    });
}); 