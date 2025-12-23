// DOM Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const langBtns = document.querySelectorAll('.lang-btn');

// 🔥 BACKEND URL (IMPORTANT)
const BACKEND_URL = "https://flask-backend-an8b.onrender.com";

// State
let currentLang = 'en';
let isRecognizing = false;

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
} else {
    alert("Speech Recognition not supported. Use Chrome or Edge.");
}

// Speech Synthesis
const synth = window.speechSynthesis;

// Events
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});
micBtn.addEventListener('click', toggleSpeechRecognition);

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLang = btn.dataset.lang;
        if (recognition) {
            recognition.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';
        }
    });
});

function toggleSpeechRecognition() {
    if (!recognition) return;
    if (isRecognizing) {
        recognition.stop();
    } else {
        recognition.start();
    }
    isRecognizing = !isRecognizing;
}

if (recognition) {
    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    };
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                language: currentLang
            })
        });

        const data = await response.json();
        if (data.response) {
            addMessage(data.response, 'bot');
            speakText(data.response);
        } else {
            addMessage("Server error", 'bot');
        }
    } catch (err) {
        addMessage("Backend not reachable", 'bot');
    }
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.innerHTML = `<p>${text}</p>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function speakText(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';
    synth.speak(utter);
}

