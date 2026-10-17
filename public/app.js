/**
 * ZaloChat Frontend Application
 * Real-time messaging with Socket.IO, audio notifications, reactions, typing indicator, image upload
 */

(() => {
  // DOM Elements
  const appEl = document.getElementById('app');
  const userSelectModal = document.getElementById('user-select-modal');
  const accountGrid = document.getElementById('account-selection-grid');
  const customUserForm = document.getElementById('custom-user-form');
  const customUserNameInput = document.getElementById('custom-user-name');

  // Sidebar elements
  const myAvatar = document.getElementById('my-avatar');
  const myName = document.getElementById('my-name');
  const myStatusText = document.getElementById('my-status-text');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const btnSwitchUser = document.getElementById('btn-switch-user');
  const convSearchInput = document.getElementById('conversation-search');
  const convFilterTabs = document.querySelectorAll('.filter-tab');
  const convListContainer = document.getElementById('conversations-list');
  const sidebarLeft = document.querySelector('.sidebar-left');

  // Chat main elements
  const btnMobileBack = document.getElementById('btn-mobile-back');
  const chatTargetAvatar = document.getElementById('chat-target-avatar');
  const chatTargetIndicator = document.getElementById('chat-target-indicator');
  const chatTargetName = document.getElementById('chat-target-name');
  const chatTargetSubtext = document.getElementById('chat-target-subtext');
  const btnAudioCall = document.getElementById('btn-audio-call');
  const btnVideoCall = document.getElementById('btn-video-call');
  const btnToggleInfo = document.getElementById('btn-toggle-info');

  const messagesContainer = document.getElementById('messages-container');
  const messagesStream = document.getElementById('messages-stream');
  const typingBubble = document.getElementById('typing-bubble');
  const typingName = document.getElementById('typing-name');

  // Reply & Image preview elements
  const replyPreviewBar = document.getElementById('reply-preview-bar');
  const replyToUser = document.getElementById('reply-to-user');
  const replySnippet = document.getElementById('reply-snippet');
  const btnCancelReply = document.getElementById('btn-cancel-reply');

  const imageUploadPreview = document.getElementById('image-upload-preview');
  const previewThumbImg = document.getElementById('preview-thumb-img');
  const previewFilename = document.getElementById('preview-filename');
  const btnRemovePreviewImage = document.getElementById('btn-remove-preview-image');

  // Chat input elements
  const fileInput = document.getElementById('file-input');
  const btnAttachImage = document.getElementById('btn-attach-image');
  const messageInput = document.getElementById('message-input');
  const btnEmojiTrigger = document.getElementById('btn-emoji-trigger');
  const btnSendMessage = document.getElementById('btn-send-message');
  const emojiPicker = document.getElementById('emoji-picker');
  const btnCloseEmoji = document.getElementById('btn-close-emoji');
  const emojiGrid = document.getElementById('emoji-grid');
  const emojiTabs = document.querySelectorAll('.emoji-tab');

  // Right sidebar
  const sidebarRight = document.getElementById('sidebar-right');
  const btnCloseRightSidebar = document.getElementById('btn-close-right-sidebar');
  const infoAvatar = document.getElementById('info-avatar');
  const infoName = document.getElementById('info-name');
  const infoBio = document.getElementById('info-bio');
  const infoChatType = document.getElementById('info-chat-type');
  const infoOnlineStatus = document.getElementById('info-online-status');
  const sharedMediaGrid = document.getElementById('shared-media-grid');

  // Lightbox & Call modals
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  const callModal = document.getElementById('call-modal');
  const callAvatar = document.getElementById('call-avatar');
  const callUserName = document.getElementById('call-user-name');
  const callStatusLabel = document.getElementById('call-status-label');
  const btnHangupCall = document.getElementById('btn-hangup-call');

  // Application State
  let socket = null;
  let currentUser = null;
  let allUsers = [];
  let allRooms = [];
  let currentTarget = null; // { id, name, avatar, isGroup, status, bio }
  let activeMessages = [];
  let replyingTo = null; // message object
  let pendingImageFile = null;
  let typingTimer = null;
  let isTyping = false;
  let currentFilter = 'all';
  let isSoundEnabled = localStorage.getItem('zalochat_sound') !== 'false';
  let callAudioInterval = null;

  // Web Audio Context for crisp notifications and ringtones
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playNotificationDing() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Bell sound: two harmonized gentle sine frequencies
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08); // E6

      osc2.frequency.setValueAtTime(1760, now + 0.05);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.05);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function playRingTone() {
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  }

  // Emoji dataset
  const emojiCategories = {
    faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😜', '🤪', '😎', '🥳', '😏', '😒', '😔', '🥺', '😢', '😭', '😤', '😡', '🤯', '😱', '🤫', '🤔', '😴'],
    gestures: ['👍', '👎', '👏', '🙌', '🤝', '👊', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '👈', '👉', '👆', '👇', '✋', '👋', '💪', '🙏'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '✨', '⭐', '🌟'],
    objects: ['🎉', '🎊', '🎁', '☕', '🍺', '🍕', '🍔', '🚀', '💯', '🌈', '⚡', '💡', '🎵', '⚽', '🎮', '📸', '🐱', '🐶', '🌸', '💼']
  };

  // Initialize Emojis in Picker
  function renderEmojiGrid(category = 'faces') {
    emojiGrid.innerHTML = '';
    const emojis = emojiCategories[category] || emojiCategories.faces;
    emojis.forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'emoji-item';
      btn.type = 'button';
      btn.textContent = emoji;
      btn.addEventListener('click', () => {
        insertTextAtCursor(messageInput, emoji);
        handleTypingInput();
      });
      emojiGrid.appendChild(btn);
    });
  }

  function insertTextAtCursor(input, text) {
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const val = input.value;
    input.value = val.substring(0, start) + text + val.substring(end);
    input.selectionStart = input.selectionEnd = start + text.length;
    input.focus();
    adjustTextareaHeight(input);
  }

  // Formatting helpers
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (isToday) return timeStr;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month} ${timeStr}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function linkify(text) {
    const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  // Theme Management
  function initTheme() {
    const savedTheme = localStorage.getItem('zalochat_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('zalochat_theme', next);
  }

  // Sound Management
  function initSound() {
    if (!isSoundEnabled) {
      document.body.classList.add('sound-muted');
    }
  }

  function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem('zalochat_sound', isSoundEnabled);
    if (isSoundEnabled) {
      document.body.classList.remove('sound-muted');
      playNotificationDing();
    } else {
      document.body.classList.add('sound-muted');
    }
  }

  // Auto-resize textarea
  function adjustTextareaHeight(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  // Bootstrap Application
  async function initApp() {
    initTheme();
    initSound();
    renderEmojiGrid('faces');

    // Fetch initial users & rooms
    try {
      const res = await fetch('/api/bootstrap');
      const data = await res.json();
      allUsers = data.users || [];
      allRooms = data.rooms || [];
      renderAccountSelectionModal();
    } catch (err) {
      console.error('Failed to bootstrap app:', err);
    }

    // Check if user is cached in sessionStorage (isolated per tab!)
    const cachedUser = sessionStorage.getItem('zalochat_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        connectSocket(parsed);
      } catch (e) {
        showUserModal();
      }
    } else {
      showUserModal();
    }

    setupEventListeners();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    btnThemeToggle.addEventListener('click', toggleTheme);
    btnSoundToggle.addEventListener('click', toggleSound);

    btnSwitchUser.addEventListener('click', () => {
      sessionStorage.removeItem('zalochat_user');
      showUserModal();
    });

    customUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = customUserNameInput.value.trim();
      if (!name) return;
      const newUser = {
        id: `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        bio: 'Chào bạn, tôi vừa tham gia!'
      };
      selectUser(newUser);
    });

    // Conversation Filter tabs
    convFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        convFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        renderConversations();
      });
    });

    // Conversation Search
    convSearchInput.addEventListener('input', () => {
      renderConversations();
    });

    // Send Message Trigger
    btnSendMessage.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    messageInput.addEventListener('input', () => {
      adjustTextareaHeight(messageInput);
      handleTypingInput();
    });

    // Emoji Picker Trigger
    btnEmojiTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    });
    btnCloseEmoji.addEventListener('click', () => {
      emojiPicker.style.display = 'none';
    });
    document.addEventListener('click', (e) => {
      if (!emojiPicker.contains(e.target) && e.target !== btnEmojiTrigger) {
        emojiPicker.style.display = 'none';
      }
    });

    emojiTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        emojiTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderEmojiGrid(tab.dataset.cat);
      });
    });

    // Image Attachment
    btnAttachImage.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn tệp hình ảnh!');
        return;
      }

      pendingImageFile = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        previewThumbImg.src = event.target.result;
        previewFilename.textContent = file.name;
        imageUploadPreview.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });

    btnRemovePreviewImage.addEventListener('click', () => {
      pendingImageFile = null;
      fileInput.value = '';
      imageUploadPreview.style.display = 'none';
    });

    // Cancel Reply
    btnCancelReply.addEventListener('click', () => {
      replyingTo = null;
      replyPreviewBar.style.display = 'none';
    });

    // Right Sidebar Toggle
    btnToggleInfo.addEventListener('click', () => {
      sidebarRight.classList.toggle('collapsed');
    });
    btnCloseRightSidebar.addEventListener('click', () => {
      sidebarRight.classList.add('collapsed');
    });

    // Mobile Back
    btnMobileBack.addEventListener('click', () => {
      sidebarLeft.classList.remove('hidden-mobile');
    });

    // Lightbox Close
    lightboxClose.addEventListener('click', () => {
      lightboxModal.style.display = 'none';
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.style.display = 'none';
      }
    });

    // Simulated Calls
    btnAudioCall.addEventListener('click', () => startSimulatedCall('audio'));
    btnVideoCall.addEventListener('click', () => startSimulatedCall('video'));
    btnHangupCall.addEventListener('click', stopSimulatedCall);
  }

  // Render Account Selection Grid
  function renderAccountSelectionModal() {
    accountGrid.innerHTML = '';
    allUsers.forEach(u => {
      const card = document.createElement('div');
      card.className = 'account-card-btn';
      card.innerHTML = `
        <img src="${u.avatar}" alt="${u.name}">
        <div class="acc-info">
          <span class="acc-name">${escapeHTML(u.name)}</span>
          <span class="acc-tag">${escapeHTML(u.tag || '')}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        selectUser(u);
      });
      accountGrid.appendChild(card);
    });
  }

  function showUserModal() {
    userSelectModal.style.display = 'flex';
  }

  function hideUserModal() {
    userSelectModal.style.display = 'none';
  }

  function selectUser(user) {
    sessionStorage.setItem('zalochat_user', JSON.stringify(user));
    hideUserModal();
    connectSocket(user);
  }

  // Socket Connection & Event Handling
  function connectSocket(user) {
    currentUser = user;
    myAvatar.src = user.avatar;
    myName.textContent = user.name;
    myStatusText.textContent = 'Trực tuyến';

    if (socket) {
      socket.disconnect();
    }

    socket = io();

    socket.on('connect', () => {
      socket.emit('user:login', currentUser);
    });

    socket.on('login:success', (data) => {
      currentUser = data.user;
      allUsers = data.users;
      allRooms = data.rooms;
      renderConversations();

      // Automatically select default conversation (group or first other user)
      if (!currentTarget) {
        if (allRooms.length > 0) {
          selectTarget({
            id: allRooms[0].id,
            name: allRooms[0].name,
            avatar: allRooms[0].avatar,
            isGroup: true,
            status: 'Nhóm công khai',
            bio: allRooms[0].description
          });
        }
      }
    });

    // User online status change
    socket.on('user:status_changed', ({ userId, status, lastSeen }) => {
      const u = allUsers.find(x => x.id === userId);
      if (u) {
        u.status = status;
        u.lastSeen = lastSeen;
        renderConversations();
        if (currentTarget && currentTarget.id === userId && !currentTarget.isGroup) {
          updateHeaderStatus(status === 'online');
        }
      }
    });

    // Chat History received
    socket.on('chat:history', ({ targetId, isGroup, messages }) => {
      if (currentTarget && currentTarget.id === targetId) {
        activeMessages = messages || [];
        renderMessages();
        renderSharedMedia();
      }
    });

    // Incoming New Message
    socket.on('message:new', (msg) => {
      // Check if message belongs to current open chat
      const isForCurrentChat = currentTarget && (
        (currentTarget.isGroup && msg.targetId === currentTarget.id) ||
        (!currentTarget.isGroup && (
          (msg.senderId === currentTarget.id && msg.targetId === currentUser.id) ||
          (msg.senderId === currentUser.id && msg.targetId === currentTarget.id)
        ))
      );

      if (isForCurrentChat) {
        activeMessages.push(msg);
        appendMessageElement(msg);
        scrollToBottom();
        renderSharedMedia();
      }

      // Play pleasant sound if incoming from someone else
      if (msg.senderId !== currentUser.id) {
        playNotificationDing();
      }

      // Update conversations preview
      renderConversations();
    });

    // Typing display
    socket.on('typing:display', ({ senderId, senderName, targetId, isGroup }) => {
      const isRelevant = currentTarget && (
        (isGroup && currentTarget.id === targetId) ||
        (!isGroup && currentTarget.id === senderId)
      );

      if (isRelevant) {
        typingName.textContent = senderName;
        typingBubble.style.display = 'flex';
        scrollToBottom();
      }
    });

    socket.on('typing:hide', ({ senderId, targetId, isGroup }) => {
      const isRelevant = currentTarget && (
        (isGroup && currentTarget.id === targetId) ||
        (!isGroup && currentTarget.id === senderId)
      );

      if (isRelevant) {
        typingBubble.style.display = 'none';
      }
    });

    // Reaction updated
    socket.on('message:reaction_updated', ({ messageId, reactions, targetId, isGroup }) => {
      const msg = activeMessages.find(m => m.id === messageId);
      if (msg) {
        msg.reactions = reactions;
        updateMessageReactions(messageId, reactions);
      }
    });

    // Message recalled
    socket.on('message:recalled', ({ messageId }) => {
      const msg = activeMessages.find(m => m.id === messageId);
      if (msg) {
        msg.recalled = true;
        msg.text = 'Tin nhắn đã được thu hồi';
        msg.imageUrl = null;
        msg.fileUrl = null;
        msg.reactions = {};
        renderMessages();
      }
    });
  }

  // Conversations List Rendering
  function renderConversations() {
    convListContainer.innerHTML = '';
    const query = convSearchInput.value.toLowerCase().trim();

    // 1. Group rooms
    if (currentFilter === 'all' || currentFilter === 'group') {
      allRooms.forEach(room => {
        if (query && !room.name.toLowerCase().includes(query)) return;

        const item = document.createElement('div');
        item.className = `conversation-item ${currentTarget && currentTarget.id === room.id ? 'active' : ''}`;
        item.innerHTML = `
          <div class="avatar-wrapper">
            <img src="${room.avatar}" alt="${room.name}" class="avatar">
          </div>
          <div class="conversation-meta">
            <div class="conv-top">
              <span class="conv-name">${escapeHTML(room.name)}</span>
            </div>
            <div class="conv-bottom">
              <span class="conv-last-msg">Phòng chung mọi người</span>
            </div>
          </div>
        `;
        item.addEventListener('click', () => {
          selectTarget({
            id: room.id,
            name: room.name,
            avatar: room.avatar,
            isGroup: true,
            status: 'Nhóm công khai',
            bio: room.description
          });
          if (window.innerWidth <= 680) {
            sidebarLeft.classList.add('hidden-mobile');
          }
        });
        convListContainer.appendChild(item);
      });
    }

    // 2. Direct users (exclude current user)
    if (currentFilter === 'all' || currentFilter === 'direct') {
      const otherUsers = allUsers.filter(u => u.id !== currentUser.id);

      otherUsers.forEach(u => {
        if (query && !u.name.toLowerCase().includes(query)) return;

        const isOnline = u.status === 'online';
        const item = document.createElement('div');
        item.className = `conversation-item ${currentTarget && currentTarget.id === u.id ? 'active' : ''}`;
        item.innerHTML = `
          <div class="avatar-wrapper">
            <img src="${u.avatar}" alt="${u.name}" class="avatar">
            <span class="status-indicator ${isOnline ? 'online' : ''}"></span>
          </div>
          <div class="conversation-meta">
            <div class="conv-top">
              <span class="conv-name">${escapeHTML(u.name)}</span>
              <span class="conv-time">${isOnline ? 'Online' : 'Vừa xong'}</span>
            </div>
            <div class="conv-bottom">
              <span class="conv-last-msg">${escapeHTML(u.bio || 'Chạm để nhắn tin...')}</span>
            </div>
          </div>
        `;
        item.addEventListener('click', () => {
          selectTarget({
            id: u.id,
            name: u.name,
            avatar: u.avatar,
            isGroup: false,
            status: isOnline ? 'Đang hoạt động' : 'Ngoại tuyến',
            bio: u.bio
          });
          if (window.innerWidth <= 680) {
            sidebarLeft.classList.add('hidden-mobile');
          }
        });
        convListContainer.appendChild(item);
      });
    }
  }

  // Select Active Target
  function selectTarget(target) {
    currentTarget = target;
    activeMessages = [];
    messagesStream.innerHTML = '';
    typingBubble.style.display = 'none';

    // Update Header
    chatTargetAvatar.src = target.avatar;
    chatTargetName.textContent = target.name;
    updateHeaderStatus(target.status === 'Đang hoạt động' || target.isGroup);

    // Update Right Sidebar
    infoAvatar.src = target.avatar;
    infoName.textContent = target.name;
    infoBio.textContent = target.bio || '';
    infoChatType.textContent = target.isGroup ? 'Nhóm chung' : 'Trò chuyện 1-1';
    infoOnlineStatus.textContent = target.status;

    // Request Chat History from Server
    socket.emit('chat:get_history', {
      targetId: target.id,
      isGroup: target.isGroup
    });

    renderConversations();
    messageInput.focus();
  }

  function updateHeaderStatus(isOnline) {
    if (currentTarget.isGroup) {
      chatTargetIndicator.className = 'status-indicator online';
      chatTargetSubtext.textContent = 'Trò chuyện cùng mọi người';
      chatTargetSubtext.className = 'target-status online';
    } else if (isOnline) {
      chatTargetIndicator.className = 'status-indicator online';
      chatTargetSubtext.textContent = 'Đang hoạt động';
      chatTargetSubtext.className = 'target-status online';
    } else {
      chatTargetIndicator.className = 'status-indicator';
      chatTargetSubtext.textContent = 'Vừa mới truy cập';
      chatTargetSubtext.className = 'target-status';
    }
  }

  // Render All Messages
  function renderMessages() {
    messagesStream.innerHTML = '';
    let lastDate = null;

    activeMessages.forEach(msg => {
      const msgDate = new Date(msg.timestamp).toLocaleDateString('vi-VN');
      if (msgDate !== lastDate) {
        lastDate = msgDate;
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date-divider';
        dateDiv.innerHTML = `<span>${msgDate}</span>`;
        messagesStream.appendChild(dateDiv);
      }
      appendMessageElement(msg);
    });

    scrollToBottom();
  }

  // Append a Single Message Element
  function appendMessageElement(msg) {
    const isOutgoing = msg.senderId === currentUser.id;
    const row = document.createElement('div');
    row.className = `message-row ${isOutgoing ? 'outgoing' : 'incoming'}`;
    row.dataset.msgId = msg.id;

    let replyHtml = '';
    if (msg.replyTo) {
      replyHtml = `
        <div class="message-reply-preview">
          <b>${escapeHTML(msg.replyTo.senderName)}:</b> ${escapeHTML(msg.replyTo.text || '[Hình ảnh]')}
        </div>
      `;
    }

    let imageHtml = '';
    if (msg.imageUrl && !msg.recalled) {
      imageHtml = `
        <img src="${msg.imageUrl}" alt="Đính kèm" class="message-image" loading="lazy">
      `;
    }

    const timeFormatted = formatTimestamp(msg.timestamp);

    // Build Action Bar (Reactions + Reply + Recall)
    let actionButtonsHtml = `
      <button class="action-bar-btn" data-reaction="❤️" title="Yêu thích">❤️</button>
      <button class="action-bar-btn" data-reaction="👍" title="Thích">👍</button>
      <button class="action-bar-btn" data-reaction="😂" title="Haha">😂</button>
      <button class="action-bar-btn" data-reaction="😮" title="Wow">😮</button>
      <button class="action-bar-btn" data-reaction="😢" title="Buồn">😢</button>
      <button class="action-bar-btn" data-reaction="🔥" title="Tuyệt vời">🔥</button>
      <button class="action-bar-btn btn-reply-msg" title="Trả lời">↩️</button>
    `;
    if (isOutgoing && !msg.recalled) {
      actionButtonsHtml += `<button class="action-bar-btn btn-recall-msg" title="Thu hồi tin nhắn">🗑️</button>`;
    }

    row.innerHTML = `
      ${!isOutgoing ? `<img src="${msg.senderAvatar}" alt="${msg.senderName}" class="msg-avatar" title="${msg.senderName}">` : ''}
      <div class="message-content-wrapper">
        ${!isOutgoing && msg.isGroup ? `<span class="sender-label">${escapeHTML(msg.senderName)}</span>` : ''}
        <div class="message-bubble ${msg.recalled ? 'recalled' : ''}">
          ${replyHtml}
          ${msg.recalled ? '<i>Tin nhắn đã được thu hồi</i>' : (msg.text ? linkify(escapeHTML(msg.text)) : '')}
          ${imageHtml}
        </div>
        <div class="message-meta">
          <span>${timeFormatted}</span>
          ${isOutgoing ? `<span class="check-icon" title="Đã gửi">✓✓</span>` : ''}
        </div>
        <div class="message-reactions" id="reactions-${msg.id}">
          <!-- Reaction pills injected here -->
        </div>
        ${!msg.recalled ? `
          <div class="message-action-bar">
            ${actionButtonsHtml}
          </div>
        ` : ''}
      </div>
    `;

    // Click on image to view in lightbox
    const imgEl = row.querySelector('.message-image');
    if (imgEl) {
      imgEl.addEventListener('click', () => {
        lightboxImg.src = msg.imageUrl;
        lightboxModal.style.display = 'flex';
      });
    }

    // Reaction buttons trigger
    const reactionBtns = row.querySelectorAll('[data-reaction]');
    reactionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emoji = btn.dataset.reaction;
        socket.emit('message:react', { messageId: msg.id, emoji });
      });
    });

    // Reply button trigger
    const replyBtn = row.querySelector('.btn-reply-msg');
    if (replyBtn) {
      replyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setReplyMessage(msg);
      });
    }

    // Recall button trigger
    const recallBtn = row.querySelector('.btn-recall-msg');
    if (recallBtn) {
      recallBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Bạn có chắc muốn thu hồi tin nhắn này đối với mọi người?')) {
          socket.emit('message:recall', { messageId: msg.id });
        }
      });
    }

    messagesStream.appendChild(row);
    updateMessageReactions(msg.id, msg.reactions);
  }

  // Update Reaction Pills on a message
  function updateMessageReactions(messageId, reactions) {
    const container = document.getElementById(`reactions-${messageId}`);
    if (!container) return;

    container.innerHTML = '';
    if (!reactions) return;

    Object.entries(reactions).forEach(([emoji, userIds]) => {
      if (!userIds || userIds.length === 0) return;
      const pill = document.createElement('div');
      const hasReacted = userIds.includes(currentUser.id);
      pill.className = `reaction-pill ${hasReacted ? 'user-reacted' : ''}`;
      pill.innerHTML = `<span>${emoji}</span> <span>${userIds.length}</span>`;
      pill.title = `${userIds.length} người đã thả cảm xúc`;
      pill.addEventListener('click', () => {
        socket.emit('message:react', { messageId, emoji });
      });
      container.appendChild(pill);
    });
  }

  // Set Reply Target
  function setReplyMessage(msg) {
    replyingTo = msg;
    replyToUser.textContent = msg.senderName;
    replySnippet.textContent = msg.text || (msg.imageUrl ? '[Hình ảnh]' : 'Tin nhắn');
    replyPreviewBar.style.display = 'flex';
    messageInput.focus();
  }

  // Render Shared Media in right sidebar
  function renderSharedMedia() {
    sharedMediaGrid.innerHTML = '';
    const images = activeMessages.filter(m => m.imageUrl && !m.recalled);

    if (images.length === 0) {
      sharedMediaGrid.innerHTML = '<p class="empty-media-text">Chưa có ảnh nào được gửi</p>';
      return;
    }

    images.forEach(imgMsg => {
      const img = document.createElement('img');
      img.src = imgMsg.imageUrl;
      img.alt = 'Shared media';
      img.className = 'shared-thumb';
      img.addEventListener('click', () => {
        lightboxImg.src = imgMsg.imageUrl;
        lightboxModal.style.display = 'flex';
      });
      sharedMediaGrid.appendChild(img);
    });
  }

  // Send Message Handler
  async function handleSendMessage() {
    if (!currentTarget || !socket) return;

    const text = messageInput.value.trim();
    if (!text && !pendingImageFile) return;

    let uploadedImageUrl = null;

    // If an image is pending, upload it to the server first
    if (pendingImageFile) {
      const formData = new FormData();
      formData.append('file', pendingImageFile);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.url;
      } catch (err) {
        console.error('Lỗi khi tải ảnh:', err);
        alert('Tải ảnh thất bại, vui lòng thử lại!');
        return;
      }
    }

    // Build payload
    const payload = {
      targetId: currentTarget.id,
      isGroup: currentTarget.isGroup,
      text: text,
      imageUrl: uploadedImageUrl,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        text: replyingTo.text
      } : null
    };

    socket.emit('message:send', payload);

    // Reset input fields
    messageInput.value = '';
    adjustTextareaHeight(messageInput);
    stopTyping();

    // Reset image preview
    pendingImageFile = null;
    fileInput.value = '';
    imageUploadPreview.style.display = 'none';

    // Reset reply preview
    replyingTo = null;
    replyPreviewBar.style.display = 'none';
  }

  // Typing Input Handling
  function handleTypingInput() {
    if (!currentTarget || !socket) return;

    if (!isTyping) {
      isTyping = true;
      socket.emit('typing:start', {
        targetId: currentTarget.id,
        isGroup: currentTarget.isGroup
      });
    }

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      stopTyping();
    }, 1500);
  }

  function stopTyping() {
    if (!isTyping) return;
    isTyping = false;
    clearTimeout(typingTimer);
    if (socket && currentTarget) {
      socket.emit('typing:stop', {
        targetId: currentTarget.id,
        isGroup: currentTarget.isGroup
      });
    }
  }

  // Scroll messages to bottom smoothly
  function scrollToBottom() {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
  }

  // Simulated Voice / Video Call
  function startSimulatedCall(type) {
    if (!currentTarget) return;
    callAvatar.src = currentTarget.avatar;
    callUserName.textContent = currentTarget.name;
    callStatusLabel.textContent = `Đang gọi ${type === 'video' ? 'video' : 'thoại'}...`;
    callModal.style.display = 'flex';

    // Ringtone loop
    playRingTone();
    callAudioInterval = setInterval(playRingTone, 3000);
  }

  function stopSimulatedCall() {
    callModal.style.display = 'none';
    if (callAudioInterval) {
      clearInterval(callAudioInterval);
      callAudioInterval = null;
    }
  }

  // Start app on load
  window.addEventListener('DOMContentLoaded', initApp);
})();
