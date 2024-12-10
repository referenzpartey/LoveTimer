let countdown;
let messageCountdown;
let intervalMessageIndex = 0;
let intervalMessageInterval;
let hearts = [];
let messageIndex = 0;
let isMessageVisible = false;
let timerInterval = null;

const messages = [
    "Ich liebe dich bis zum Mond und zurück! 🌙❤️",
    "Du bist mein größter Schatz! 💎",
    "Ohne dich wäre mein Leben unvollständig. 🧩",
    "Du bist mein Ein und Alles! 🌹",
    "Jeden Tag mit dir ist ein Geschenk. 🎁❤️",
    "Mein Herz schlägt nur für dich! 💓",
    "Du machst mein Leben unendlich schöner. 🌸❤️",
    "Jeder Moment mit dir ist ein kleines Wunder. 🌟",
    "Ich liebe dich mehr, als Worte ausdrücken können. 📝❤️",
    "Du bist mein Kompass und mein Zuhause. 🧭🏠❤️",
    "Du bist die beste Entscheidung meines Lebens. 🌹❤️"
];

const intervalMessages = [
    "Lade Liebe...",
    "Kopiere Schmetterlinge in den Bauch...",
    "Lösche schlechte Erinnerungen...",
    "Lade Freude in dein Herz...",
    "Kopiere Lächeln auf dein Gesicht...",
    "Lösche Sorgen aus deinem Kopf...",
    "Lade Glück in dein Leben...",
    "Kopiere Sonnenstrahlen in deine Seele...",
    "Erstelle Schulter zum Anlehnen...",
    "Erstelle eine warme Umarmung...",
    "Kopiere Harmonie in deinen Alltag..."
];

const urgencyMapping = {
    "very-fast": { countdownRange: [8, 20], messageTime: 20 },
    "fast": { countdownRange: [20, 90], messageTime: 30 },
    "few-minutes": { countdownRange: [90, 600], messageTime: 120 },
    "not-now": { countdownRange: [900, 3600], messageTime: 180 },
    "much-later": { countdownRange: [3600, 10800], messageTime: 300 },
    "no-love": { countdownRange: [3600, 3600], messageTime: 0 },
    "pari-mode": { countdownRange: [2, 2], messageTime: 10 }
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createRandomHearts() {
    const container = document.getElementById('hearts-container');
    container.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const heart = document.createElement('div');
        heart.className = 'random-heart';
        const isRed = Math.random() < 0.75;
        if (isRed) {
            heart.classList.add('red');
        } else {
            heart.classList.add(Math.random() < 0.5 ? 'pink' : 'orange');
        }
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 2 + 1}rem`;
        heart.innerHTML = ["&#9829;", "&#10084;", "&#10085;"][Math.floor(Math.random() * 3)];
        container.appendChild(heart);
    }
}

function createMessageHearts() {
    const messageHeartsContainer = document.getElementById('message-hearts');
    messageHeartsContainer.innerHTML = '';
    for (let i = 0; i < messageCountdown/2; i++) {
        const heart = document.createElement('span');
        heart.className = 'message-heart';
        heart.textContent = '❤';
        messageHeartsContainer.appendChild(heart);
    }
}

function startIntervalMessages() {
    let currentIndex = 0;
    shuffleArray(intervalMessages);
    clearInterval(intervalMessageInterval);

    intervalMessageInterval = setInterval(() => {
        if (!isMessageVisible) {
            document.getElementById('interval-message').textContent = intervalMessages[currentIndex];
            currentIndex = (currentIndex + 1) % intervalMessages.length;
        } else {
            document.getElementById('interval-message').textContent = "";
        }
    }, 5000);
}

function startBasedOnUrgency() {
    if (timerInterval) clearInterval(timerInterval);
    if (intervalMessageInterval) clearInterval(intervalMessageInterval);

    const urgency = document.getElementById("urgency").value;
    const settings = urgencyMapping[urgency];

    if (urgency === "no-love") {
        showBlackScreen();
        return;
    }

    countdown = Math.floor(
        Math.random() * (settings.countdownRange[1] - settings.countdownRange[0]) + settings.countdownRange[0]
    );
    messageCountdown = settings.messageTime;

    startTimers();
}

function startTimers() {
    createRandomHearts();
    startIntervalMessages();

    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = formatTime(countdown);

    timerInterval = setInterval(() => {
        if (countdown > 0) {
            countdown--;
            timerDisplay.textContent = formatTime(countdown);
        } else {
            clearInterval(timerInterval);
            resetAndRestartTimer();
        }
    }, 1000);
}

function resetAndRestartTimer() {
    const urgency = document.getElementById("urgency").value;
    const settings = urgencyMapping[urgency];

    countdown = Math.floor(
        Math.random() * (settings.countdownRange[1] - settings.countdownRange[0]) + settings.countdownRange[0]
    );
    messageCountdown = settings.messageTime;

    showLoveMessage();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function showLoveMessage() {
    const message = document.getElementById('message');
    const loveMessage = document.getElementById('love-message');

    loveMessage.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;

    message.style.backgroundColor = getRandomPastelColor();
    message.style.opacity = '1';
    message.style.display = 'block';
    isMessageVisible = true;

    createMessageHearts();

    let remainingTime = messageCountdown;
    const heartInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            removeMessageHeart();
        } else {
            clearInterval(heartInterval);
            message.style.opacity = '0';
            setTimeout(() => {
                message.style.display = 'none';
                isMessageVisible = false;
                startBasedOnUrgency();
            }, 2000);
        }
    }, 1000);
}

function removeMessageHeart() {
    const messageHeartsContainer = document.getElementById('message-hearts');
    if (messageHeartsContainer.firstChild) {
        const heart = messageHeartsContainer.firstChild;
        heart.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => messageHeartsContainer.removeChild(heart), 1000);
    }
}

function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
}

function showBlackScreen() {
    document.body.style.background = "black";
    document.body.innerHTML = '<h1 style="color: white;">Nächste Chance auf Liebe in:</h1><div id="black-timer" style="color: white; font-size: 3rem;">60:00</div>';
    let blackCountdown = 3600;
    const interval = setInterval(() => {
        blackCountdown--;
        document.getElementById("black-timer").textContent = formatTime(blackCountdown);
        if (blackCountdown <= 0) {
            clearInterval(interval);
            location.reload();
        }
    }, 1000);
}