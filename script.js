const messages = document.getElementById('messages');
const input = document.getElementById('input');

/* 🧠 Session memory (not saved) */
let memory = [];

/* 🔤 Normalize */
function normalize(text) {
  return text.toLowerCase().trim();
}

/* 🎲 Random helper */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* 💬 Response sets */
const comfortingReplies = [
  'I am here with you. You do not have to organize everything perfectly before you say it.',
  'You can let it out here. I will stay with your words for this moment.',
  'That sounds heavy. Thank you for trusting me with it.',
  'You do not need to hide your feelings here. You can be honest.',
  'Take your time. There is no rush to make your feelings neat or simple.'
];

const reflectionPrompts = [
  'Do you want to tell me what happened first, or how it made you feel?',
  'What part of this feels the heaviest right now?',
  'If your mind is crowded, start with just one sentence. I am listening.',
  'What do you wish someone understood about this?',
  'Would it help to vent freely, or would you rather sort things out step by step?'
];

const groundingTips = [
  'Try this: unclench your jaw, drop your shoulders, and take one slow breath in and out.',
  'Name 3 things you can see, 2 things you can feel, and 1 thing you can hear.',
  'Put both feet on the floor for a moment. You are here right now, not inside every thought at once.',
  'Drink a little water and give yourself one quiet minute before deciding what to do next.'
];

const encouragement = [
  'You are carrying a lot, and you are still here. That matters.',
  'Your feelings are real, even if they are hard to explain.',
  'You do not have to solve everything tonight. It is enough to be honest about what hurts.',
  'Being overwhelmed does not mean you are weak. It means something important feels heavy.'
];

/* 🌍 Translation dictionary */
const dictionary = {
  spanish: {
    hello: 'hola',
    goodbye: 'adios',
    thankyou: 'gracias',
    please: 'por favor',
    yes: 'si',
    no: 'no',
    friend: 'amigo/amiga'
  },
  french: {
    hello: 'bonjour',
    goodbye: 'au revoir',
    thankyou: 'merci',
    please: 's\'il vous plait',
    yes: 'oui',
    no: 'non',
    friend: 'ami/amie'
  },
  german: {
    hello: 'hallo',
    goodbye: 'auf wiedersehen',
    thankyou: 'danke',
    please: 'bitte',
    yes: 'ja',
    no: 'nein',
    friend: 'freund/freundin'
  }
};

/* 🔍 Emotion detection */
function detectEmotion(text) {
  if (/sad|cry|hurt|lonely|depressed/.test(text)) return "sad";
  if (/anxious|stress|overwhelmed|panic/.test(text)) return "anxious";
  if (/angry|mad|frustrated|annoyed/.test(text)) return "angry";
  if (/tired|exhausted|burnt/.test(text)) return "tired";
  return "default";
}

/* 🌍 Translation handler */
function handleTranslation(text) {
  const match = text.match(/translate (.+?) to (spanish|french|german)/i);
  if (!match) return null;

  const word = match[1].toLowerCase().replace(/\s/g, '');
  const lang = match[2].toLowerCase();

  const result = dictionary[lang][word];

  if (result) {
    return `In ${lang}, "${match[1]}" is "${result}".`;
  }

  return `I only know a few words. Try: hello, goodbye, thank you, please.`;
}

/* 🤖 Reply generator */
function getReply(userText) {
  const text = normalize(userText);

  /* Translation first */
  const translation = handleTranslation(userText);
  if (translation) return translation;

  const emotion = detectEmotion(text);

  let reply = randomItem(comfortingReplies);

  if (emotion === "anxious") {
    reply += " " + randomItem(groundingTips);
  }

  if (emotion === "sad") {
    reply += " " + randomItem(encouragement);
  }

  if (emotion === "angry") {
    return "That frustration deserves space. You can say the uncensored version here. What happened?";
  }

  if (emotion === "tired") {
    reply += " You sound tired. It might be okay to rest a little.";
  }

  /* Reflection prompt */
  if (Math.random() > 0.5) {
    reply += " " + randomItem(reflectionPrompts);
  }

  /* Memory reference */
  if (memory.length > 1 && Math.random() > 0.6) {
    reply += " Earlier, you mentioned something similar. Do you think they are connected?";
  }

  return reply;
}

/* 💬 Typing animation */
function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'message bot';
  typing.id = 'typing-indicator';

  typing.innerHTML = `
    <div class="bubble">
      <span class="typing">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
    </div>
  `;

  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

/* 📤 Send message */
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage('user', text);
  memory.push(text);
  input.value = '';

  showTyping();

  setTimeout(() => {
    hideTyping();
    const reply = getReply(text);
    addMessage('bot', reply);
  }, 800);
}

/* 🧱 Render message */
function addMessage(sender, text) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  div.appendChild(bubble);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

/* ⌨️ Enter key support */
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* 🌟 Initial message */
addMessage('bot',
  "Welcome to Alice’s Wonderland. This is your space to think, feel, and let things out. I’m here with you."
);
