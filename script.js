    const messagesEl = document.getElementById('messages');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const clearBtn = document.getElementById('clear-chat');
    const chips = document.querySelectorAll('.chip');

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
      scrollToBottom();
    }

    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'message bot';
      typing.id = 'typing-indicator';
      typing.innerHTML = `
        <div class="bubble">
          <span class="typing" aria-label="Bot is typing">
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

    function handleTranslation(text) {
      const match = text.match(/translate\s+(.+?)\s+to\s+(spanish|french|german)/i);
      if (!match) return null;
      const phrase = match[1].toLowerCase().trim().replace(/\s+/g, '');
      const language = match[2].toLowerCase();
      const translated = dictionary[language][phrase];
      if (translated) {
        return `In ${language}, "${match[1].trim()}" is "${translated}."`;
      }
      return `I know a small built-in dictionary. Try translating one of these words to ${language}: hello, goodbye, thank you, please, yes, no, friend.`;
    }

    function getBotReply(userText) {
      const text = normalize(userText);
      const translated = handleTranslation(userText);
      if (translated) return translated;

      if (/\b(hi|hello|hey)\b/.test(text)) {
        return 'Hi. I am here with you. You can vent, ramble, reflect, or sit quietly and type whatever is on your mind.';
      }

      if (/\b(can you just listen|just listen|listen to me)\b/.test(text)) {
        return 'Yes. I am listening. You do not need to make it polished — just say it as it comes.';
      }

      if (/\b(i need to vent|let me vent|i want to vent)\b/.test(text)) {
        return randomItem(reflectionPrompts);
      }

      if (/\b(overwhelmed|stressed|anxious|panic|too much)\b/.test(text)) {
        return `${randomItem(comfortingReplies)} ${randomItem(groundingTips)}`;
      }

      if (/\b(sad|upset|hurt|crying|lonely|empty|depressed)\b/.test(text)) {
        return `${randomItem(comfortingReplies)} ${randomItem(encouragement)}`;
      }

      if (/\b(angry|mad|frustrated|annoyed)\b/.test(text)) {
        return 'That frustration deserves space too. You can say the uncensored version here. What happened?';
      }

      if (/\b(confused|lost|stuck|unsure)\b/.test(text)) {
        return 'We can slow it down together. What feels most unclear right now — the situation, your feelings, or what to do next?';
      }

      if (/help me sort out my thoughts|sort out my thoughts|process this/.test(text)) {
        return 'Okay. Start with these three pieces: what happened, what you felt, and what you needed but did not get.';
      }

      if (/say something comforting|comfort me|reassure me/.test(text)) {
        return `${randomItem(comfortingReplies)} ${randomItem(encouragement)}`;
      }

      if (/\b(thank you|thanks)\b/.test(text)) {
        return 'You do not have to thank me. I am glad you let some of it out.';
      }

      if (/\b(bye|goodbye|see you)\b/.test(text)) {
        return 'I will be here whenever you need a place to let things out.';
      }

      if (/\b(help|what can you do)\b/.test(text)) {
        return 'You can vent, reflect, ask for comfort, sort through feelings, or use me like a private diary space. I also support a small built-in translation feature.';
      }

      return `${randomItem(comfortingReplies)} ${randomItem(reflectionPrompts)}`;
    }

    function submitMessage(text) {
      if (!text.trim()) return;
      addMessage('user', text.trim());
      input.value = '';
      autoResize();
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

    input.addEventListener('input', autoResize);

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
