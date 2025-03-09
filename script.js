// Hent DOM-elementer
const timerInput = document.querySelector('input[type="text"]');
const setTimeButton = document.querySelector('button');

// Funksjon for å lagre tiden i localStorage
function saveTimer(duration) {
    localStorage.setItem('timerDuration', duration);
    // Lagre tidspunktet når timeren ble startet
    localStorage.setItem('timerStartTime', Date.now());
    // Redirect til hovedsiden
    window.location.href = 'index.html';
}

// Håndter klikk på "Set time"-knappen
setTimeButton.addEventListener('click', () => {
    const timeStr = timerInput.value;
    
    // Sjekk om input inneholder kolon
    if (timeStr.includes(':')) {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        
        if (isNaN(minutes) || isNaN(seconds)) {
            alert('Vennligst skriv inn tid i format mm:ss eller antall sekunder');
            return;
        }
        
        const totalSeconds = (minutes * 60) + seconds;
        saveTimer(totalSeconds);
    } else {
        // Håndter input som bare sekunder
        const seconds = parseInt(timeStr);
        
        if (isNaN(seconds)) {
            alert('Vennligst skriv inn tid i format mm:ss eller antall sekunder');
            return;
        }
        
        saveTimer(seconds);
    }
});

// Sjekk om vi er på hovedsiden og start timer hvis det finnes lagret tid
if (document.querySelector('.Tanker')) {
    const timerDisplay = document.querySelector('.Tanker');
    const savedDuration = localStorage.getItem('timerDuration');
    let countdown;
    
    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer(duration) {
        clearInterval(countdown);
        let timeLeft = duration;
        
        timerDisplay.textContent = formatTime(timeLeft);
        
        countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                resetTimer();
            }
        }, 1000);
        
        // Lagre referansen til intervallet i window-objektet
        window.timerInterval = countdown;
    }
    
    function resetTimer() {
        clearInterval(window.timerInterval);
        localStorage.removeItem('timerDuration');
        localStorage.removeItem('timerStartTime');
        timerDisplay.textContent = "00:00";
    }
    
    // Sjekk for page refresh ved å legge til en event listener
    window.addEventListener('beforeunload', () => {
        resetTimer();
    });
    
    // Alternativ måte å sjekke på - sammenligne PageLoad med localStorage
    const pageLoadTime = Date.now();
    const timerStartTime = localStorage.getItem('timerStartTime');
    
    if (savedDuration && timerStartTime) {
        // Hvis forskjellen mellom page load og timer start er for stor, reset timeren
        if (pageLoadTime - timerStartTime > 2000) { // 2 sekunder toleranse for normal side-lasting
            resetTimer();
        } else {
            startTimer(parseInt(savedDuration));
        }
    } else if (savedDuration) {
        // Bakoverkompatibilitet - hvis det ikke er noe startTidspunkt
        resetTimer();
    } else {
        // Ingen timer, vis 00:00
        timerDisplay.textContent = "00:00";
    }
}

const fullScreenButton = document.querySelector('button:has(svg)');
const controlElements = document.querySelector('.flex.items-center.justify-between');

// Lag meldings-elementet
const message = document.createElement('div');
message.textContent = 'Trykk ESC for å avslutte fullskjerm';
message.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'PPMori', sans-serif;
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
`;
document.body.appendChild(message);

function showAndFadeMessage() {
    message.style.opacity = '1';
    setTimeout(() => {
        message.style.opacity = '0';
    }, 5000);
}

fullScreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        controlElements.style.display = 'none';
        showAndFadeMessage();
    } else {
        document.exitFullscreen();
        controlElements.style.display = 'flex';
    }
});

// Lytt også på fullskjerm-endringer (hvis brukeren trykker Esc)
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        controlElements.style.display = 'flex';
    }
});