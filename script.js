const messagesEl = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const clearBtn = document.getElementById('clear-chat');
const chips = document.querySelectorAll('.chip');

// ---------- Response Banks ----------
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

const goodbyeAffirmations = [
  'I will leave this space gently for now. You will be alright.',
  'Take care of yourself. Small steps still count.',
  'You made it through this moment. That matters more than you think.',
  'Be kind to yourself tonight. You deserve that.',
  'Think gently, not harshly. Good things can still unfold.',
  'Even if today felt heavy, it does not define everything ahead.'
];

const virtualHugs = [
  'I am sending you a gentle hug. You do not have to hold everything alone.',
  'If I could, I would sit with you quietly and give you a big hug.',
  'Consider this a warm, steady hug. You deserve comfort too.',
  'I am right here with you — imagine a soft hug that asks nothing from you.',
  'Sending you a quiet hug. You can rest in this moment for a bit.'
];

// ---------- Emotion Logic ----------
function detectEmotion(text) {
  const t = text.toLowerCase();

  const emotions = {
    sadness: /\b(sad|down|empty|hurt|cry|lonely|depressed|heartbroken)\b/,
    anxiety: /\b(anxious|nervous|worried|panic|overthinking|stressed|overwhelmed)\b/,
    anger: /\b(angry|mad|furious|irritated|frustrated|annoyed)\b/,
    confusion: /\b(confused|lost|stuck|unsure|don't know|uncertain)\b/,
    guilt: /\b(guilty|regret|my fault|shouldn't have)\b/,
    exhaustion: /\b(tired|drained|burnt out|exhausted)\b/,
    positive: /\b(happy|relieved|better|good|proud|grateful)\b/
  };

  let detected = [];
  for (let emotion in emotions) {
    if (emotions[emotion].test(t)) detected.push(emotion);
  }

  return detected.length ? detected : ['neutral'];
}

function detectIntensity(text) {
  const t = text.toLowerCase();

  if (/\b(very|so much|extremely|really|too much|can't|unbearable)\b/.test(t)) {
    return 'high';
  }

  if (/\b(a bit|kind of|slightly|maybe)\b/.test(t)) {
    return 'low';
  }

  return 'medium';
}

function maybeAddHug(emotions) {
  const vulnerable = ['sadness', 'anxiety', 'exhaustion', 'guilt'];
  const hasVulnerable = emotions.some(e => vulnerable.includes(e));

  if (hasVulnerable && Math.random() < 0.4) {
    return ' ' + randomItem(virtualHugs);
  }

  return '';
}

function buildEmpatheticReply(emotions, intensity) {
  let response = '';

  if (intensity === 'high') {
    response += "That sounds really intense. I'm really glad you said it out loud here. ";
  }

  if (emotions.includes('sadness')) {
    response += randomItem(comfortingReplies) + ' ';
    response += randomItem(encouragement) + ' ';
  }

  if (emotions.includes('anxiety')) {
    response += randomItem(comfortingReplies) + ' ';
    response += randomItem(groundingTips) + ' ';
  }

  if (emotions.includes('anger')) {
    response += "That frustration makes sense. You can say the uncensored version here. ";
    response += randomItem(reflectionPrompts) + ' ';
  }

  if (emotions.includes('confusion')) {
    response += "We can slow this down together. ";
    response += randomItem(reflectionPrompts) + ' ';
  }

  if (emotions.includes('guilt')) {
    response += "It sounds like you're being really hard on yourself. ";
    response += "Do you want to walk through what happened gently? ";
  }

  if (emotions.includes('exhaustion')) {
    response += "That sounds draining. ";
    response += randomItem(groundingTips) + ' ';
  }

  if (emotions.includes('positive')) {
    response += "That’s really meaningful. Do you want to tell me more about it? ";
  }

  if (response === '') {
    response = `${randomItem(comfortingReplies)} ${randomItem(reflectionPrompts)}`;
  }

  response += maybeAddHug(emotions);

  return response.trim();
}

// ---------- Inactivity Timer ----------
let inactivityTimer = null;
let hasTimedOut = false;

function startInactivityTimer() {
  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    if (!hasTimedOut) {
      showTyping();
      setTimeout(() => {
        hideTyping();
        addMessage('bot', randomItem(goodbyeAffirmations));
        hasTimedOut = true;
      }, 500);
    }
  }, 30000);
}

function resetInactivityState() {
  hasTimedOut = false;
  startInactivityTimer();
}

// ---------- UI Functions ----------
function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function autoResize() {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 160) + 'px';
}

function addMessage(sender, text) {
  const message = document.createElement('div');
  message.className = `message ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  message.appendChild(bubble);
  messagesEl.appendChild(message);
  scrollToBottom();
}

function loadChat() {
  addMessage('bot', 'Welcome to Alice’s Wonderland: Your Private Diary. This is your personal diary bot. Feel free to explore your emotions and thoughts openly — you will not be judged. The chat is intentionally not saved.');
  startInactivityTimer();
}

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
  messagesEl.appendChild(typing);
  scrollToBottom();
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

// ---------- Bot Logic ----------
function getBotReply(userText) {
  const text = normalize(userText);

  if (/\b(hi|hello|hey)\b/.test(text)) {
    return 'Hi. I am here with you. You can say things exactly as they come.';
  }

  if (/\b(thank you|thanks)\b/.test(text)) {
    return 'You don’t have to thank me. I’m glad you shared that.';
  }

  if (/\b(bye|goodbye)\b/.test(text)) {
    return 'I will be here whenever you want to come back.';
  }

  const emotions = detectEmotion(text);
  const intensity = detectIntensity(text);

  return buildEmpatheticReply(emotions, intensity);
}

// ---------- Events ----------
function submitMessage(text) {
  if (!text.trim()) return;

  addMessage('user', text.trim());
  input.value = '';
  autoResize();

  resetInactivityState();

  showTyping();

  setTimeout(() => {
    hideTyping();
    const reply = getBotReply(text);
    addMessage('bot', reply);
  }, 550);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitMessage(input.value);
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitMessage(input.value);
  }
});

input.addEventListener('input', () => {
  autoResize();
  resetInactivityState();
});

clearBtn.addEventListener('click', () => {
  messagesEl.innerHTML = '';
  addMessage('bot', 'This space has been cleared. Nothing was kept. You can begin again whenever you want.');
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    input.value = chip.textContent;
    autoResize();
    submitMessage(input.value);
  });
});

loadChat();
autoResize();
