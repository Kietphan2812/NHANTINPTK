/**
 * ZaloChat Frontend Application
 * Real-time messaging, Phone & Username Registration, Login, Add Friend, and Contacts
 */

(() => {
  // DOM Elements
  const appEl = document.getElementById('app');
  const userSelectModal = document.getElementById('user-select-modal');
  const authTabs = document.querySelectorAll('.auth-tab-btn');
  const authLoginForm = document.getElementById('auth-login-form');
  const authRegisterForm = document.getElementById('auth-register-form');
  const authDemoPanel = document.getElementById('auth-demo-panel');
  const authErrorAlert = document.getElementById('auth-error-alert');
  const accountGrid = document.getElementById('account-selection-grid');

  // Login inputs
  const loginAccountInput = document.getElementById('login-account');
  const loginPasswordInput = document.getElementById('login-password');

  // Register inputs
  const regNameInput = document.getElementById('reg-name');
  const regPhoneInput = document.getElementById('reg-phone');
  const regUsernameInput = document.getElementById('reg-username');
  const regPasswordInput = document.getElementById('reg-password');

  // Sidebar elements
  const myAvatar = document.getElementById('my-avatar');
  const myName = document.getElementById('my-name');
  const myPhoneTag = document.getElementById('my-phone-tag');
  const btnOpenAddFriend = document.getElementById('btn-open-add-friend');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const btnLogout = document.getElementById('btn-logout');
  const convSearchInput = document.getElementById('conversation-search');
  const sidebarNavTabs = document.querySelectorAll('.nav-tab');
  const requestsBadge = document.getElementById('requests-badge');
  const convListContainer = document.getElementById('conversations-list');
  const sidebarLeft = document.querySelector('.sidebar-left');

  // Add Friend Modal
  const addFriendModal = document.getElementById('add-friend-modal');
  const btnCloseAddFriend = document.getElementById('btn-close-add-friend');
  const searchFriendForm = document.getElementById('search-friend-form');
  const searchFriendQuery = document.getElementById('search-friend-query');
  const searchResultsArea = document.getElementById('search-results-area');

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
  const infoPhone = document.getElementById('info-phone');
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
  let currentTarget = null;
  let activeMessages = [];
  let replyingTo = null;
  let pendingImageFile = null;
  let typingTimer = null;
  let isTyping = false;
  let currentSidebarTab = 'messages'; // 'messages' | 'friends' | 'requests'
  let isSoundEnabled = localStorage.getItem('zalochat_sound') !== 'false';
  let callAudioInterval = null;

  // Web Audio Context for sounds
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
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

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
    } catch (e) {}
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

  // Emojis dataset
  const emojiCategories = {
    faces: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😋', '😜', '🤪', '😎', '🥳', '😏', '😒', '😔', '🥺', '😢', '😭', '😤', '😡', '🤯', '😱', '🤫', '🤔', '😴'],
    gestures: ['👍', '👎', '👏', '🙌', '🤝', '👊', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '👈', '👉', '👆', '👇', '✋', '👋', '💪', '🙏'],
    hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '✨', '⭐', '🌟'],
    objects: ['🎉', '🎊', '🎁', '☕', '🍺', '🍕', '🍔', '🚀', '💯', '🌈', '⚡', '💡', '🎵', '⚽', '🎮', '📸', '🐱', '🐶', '🌸', '💼']
  };

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

  function showAuthError(msg) {
    authErrorAlert.textContent = msg;
    authErrorAlert.style.display = 'block';
  }
  function clearAuthError() {
    authErrorAlert.style.display = 'none';
    authErrorAlert.textContent = '';
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

  function adjustTextareaHeight(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  // Bootstrap Application
  async function initApp() {
    initTheme();
    initSound();
    renderEmojiGrid('faces');

    try {
      const res = await fetch('/api/bootstrap');
      const data = await res.json();
      allUsers = data.users || [];
      allRooms = data.rooms || [];
      renderDemoAccounts();
    } catch (err) {
      console.error('Failed to bootstrap app:', err);
    }

    const cachedUser = sessionStorage.getItem('zalochat_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        connectSocket(parsed);
      } catch (e) {
        showAuthModal('login');
      }
    } else {
      showAuthModal('login');
    }

    setupEventListeners();
  }

  function showAuthModal(tab = 'login') {
    clearAuthError();
    userSelectModal.style.display = 'flex';
    switchAuthTab(tab);
  }

  function hideAuthModal() {
    userSelectModal.style.display = 'none';
  }

  function switchAuthTab(tabName) {
    clearAuthError();
    authTabs.forEach(t => t.classList.toggle('active', t.dataset.auth === tabName));
    authLoginForm.style.display = tabName === 'login' ? 'flex' : 'none';
    authRegisterForm.style.display = tabName === 'register' ? 'flex' : 'none';
    authDemoPanel.style.display = tabName === 'demo' ? 'block' : 'none';
  }

  function renderDemoAccounts() {
    accountGrid.innerHTML = '';
    allUsers.slice(0, 4).forEach(u => {
      const card = document.createElement('div');
      card.className = 'account-card-btn';
      card.innerHTML = `
        <img src="${u.avatar}" alt="${u.name}">
        <div class="acc-info">
          <span class="acc-name">${escapeHTML(u.name)}</span>
          <span class="acc-tag">📞 ${escapeHTML(u.phone || '')}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        loginUserDirect(u);
      });
      accountGrid.appendChild(card);
    });
  }

  function loginUserDirect(user) {
    sessionStorage.setItem('zalochat_user', JSON.stringify(user));
    hideAuthModal();
    connectSocket(user);
  }

  function setupEventListeners() {
    btnThemeToggle.addEventListener('click', toggleTheme);
    btnSoundToggle.addEventListener('click', toggleSound);

    // Logout
    btnLogout.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        if (socket) socket.disconnect();
        sessionStorage.removeItem('zalochat_user');
        currentUser = null;
        showAuthModal('login');
      }
    });

    // Auth Tabs
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchAuthTab(tab.dataset.auth);
      });
    });

    // Login Form Submit
    authLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthError();

      const account = loginAccountInput.value.trim();
      const password = loginPasswordInput.value.trim();
      if (!account || !password) return;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account, password })
        });
        const data = await res.json();
        if (!res.ok) {
          showAuthError(data.error || 'Đăng nhập không thành công');
          return;
        }

        loginUserDirect(data.user);
      } catch (err) {
        showAuthError('Lỗi kết nối máy chủ, vui lòng thử lại!');
      }
    });

    // Register Form Submit
    authRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthError();

      const name = regNameInput.value.trim();
      const phone = regPhoneInput.value.trim();
      const username = regUsernameInput.value.trim();
      const password = regPasswordInput.value.trim();

      if (!name || !phone || !password) return;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, username, password })
        });
        const data = await res.json();
        if (!res.ok) {
          showAuthError(data.error || 'Đăng ký không thành công');
          return;
        }

        alert('Đăng ký tài khoản thành công! Đang chuyển vào phòng chat...');
        loginUserDirect(data.user);
      } catch (err) {
        showAuthError('Lỗi kết nối máy chủ, vui lòng thử lại!');
      }
    });

    // Open & Close Add Friend Modal
    btnOpenAddFriend.addEventListener('click', () => {
      addFriendModal.style.display = 'flex';
      searchFriendQuery.focus();
    });
    btnCloseAddFriend.addEventListener('click', () => {
      addFriendModal.style.display = 'none';
    });
    addFriendModal.addEventListener('click', (e) => {
      if (e.target === addFriendModal) addFriendModal.style.display = 'none';
    });

    // Search Friend Form Submit
    searchFriendForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = searchFriendQuery.value.trim();
      if (!query || !currentUser) return;

      searchResultsArea.innerHTML = '<p class="text-center" style="color: var(--text-dim); padding: 12px;">Đang tìm kiếm...</p>';

      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&currentUserId=${currentUser.id}`);
        const data = await res.json();
        renderSearchResults(data.results || []);
      } catch (err) {
        searchResultsArea.innerHTML = '<p style="color: var(--danger); text-align: center; padding: 12px;">Lỗi tìm kiếm!</p>';
      }
    });

    // Sidebar navigation tabs (Tin nhắn | Danh bạ | Lời mời)
    sidebarNavTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sidebarNavTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSidebarTab = tab.dataset.tab;
        renderSidebarContent();
      });
    });

    // Search input filtering
    convSearchInput.addEventListener('input', () => {
      renderSidebarContent();
    });

    // Message Input
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

  // Render Search Results in Add Friend Modal
  function renderSearchResults(results) {
    searchResultsArea.innerHTML = '';
    if (results.length === 0) {
      searchResultsArea.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 20px;">Không tìm thấy người dùng nào phù hợp.</p>';
      return;
    }

    results.forEach(u => {
      const card = document.createElement('div');
      card.className = 'search-user-card';

      let actionBtnHtml = '';
      if (u.relation === 'friend') {
        actionBtnHtml = `<button class="btn-card-action chat-btn" data-action="chat" data-id="${u.id}">💬 Nhắn tin</button>`;
      } else if (u.relation === 'pending_sent') {
        actionBtnHtml = `<button class="btn-card-action disabled-btn">Đã gửi lời mời</button>`;
      } else if (u.relation === 'pending_received') {
        actionBtnHtml = `<button class="btn-card-action add-btn" data-action="accept" data-id="${u.id}">✓ Chấp nhận</button>`;
      } else {
        actionBtnHtml = `<button class="btn-card-action add-btn" data-action="add" data-id="${u.id}">+ Kết bạn</button>`;
      }

      card.innerHTML = `
        <div class="search-user-meta">
          <img src="${u.avatar}" alt="${u.name}">
          <div class="search-user-info">
            <span class="search-user-name">${escapeHTML(u.name)}</span>
            <span class="search-user-phone">📞 ${escapeHTML(u.phone || '')}</span>
            <span class="search-user-tag">${escapeHTML(u.tag || '')}</span>
          </div>
        </div>
        <div class="search-user-action">
          ${actionBtnHtml}
        </div>
      `;

      // Event handlers for action buttons
      const btnAction = card.querySelector('[data-action]');
      if (btnAction) {
        btnAction.addEventListener('click', () => {
          const action = btnAction.dataset.action;
          if (action === 'chat') {
            addFriendModal.style.display = 'none';
            selectTarget({
              id: u.id,
              name: u.name,
              avatar: u.avatar,
              phone: u.phone,
              tag: u.tag,
              isGroup: false,
              status: u.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến',
              bio: u.bio
            });
          } else if (action === 'add') {
            socket.emit('friend:send_request', { targetUserId: u.id });
            btnAction.textContent = 'Đã gửi lời mời';
            btnAction.className = 'btn-card-action disabled-btn';
            btnAction.disabled = true;
          } else if (action === 'accept') {
            socket.emit('friend:accept_request', { targetUserId: u.id });
            btnAction.textContent = '💬 Nhắn tin';
            btnAction.className = 'btn-card-action chat-btn';
            btnAction.dataset.action = 'chat';
          }
        });
      }

      searchResultsArea.appendChild(card);
    });
  }

  // Socket Connection & Events
  function connectSocket(user) {
    currentUser = user;
    myAvatar.src = user.avatar;
    myName.textContent = user.name;
    myPhoneTag.textContent = `📞 ${user.phone || ''} (${user.tag || ''})`;

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
      updateRequestsBadge();
      renderSidebarContent();

      if (!currentTarget && allRooms.length > 0) {
        selectTarget({
          id: allRooms[0].id,
          name: allRooms[0].name,
          avatar: allRooms[0].avatar,
          isGroup: true,
          status: 'Nhóm công khai',
          bio: allRooms[0].description
        });
      }
    });

    socket.on('users:list_updated', (updatedUsers) => {
      allUsers = updatedUsers;
      const me = allUsers.find(u => u.id === currentUser.id);
      if (me) currentUser = me;
      updateRequestsBadge();
      renderSidebarContent();
    });

    // Real-time friend request received
    socket.on('friend:request_received', ({ fromUser }) => {
      if (!currentUser.friendRequestsReceived) currentUser.friendRequestsReceived = [];
      if (!currentUser.friendRequestsReceived.includes(fromUser.id)) {
        currentUser.friendRequestsReceived.push(fromUser.id);
      }
      playNotificationDing();
      updateRequestsBadge();
      renderSidebarContent();
    });

    // Real-time friend request accepted
    socket.on('friend:request_accepted', ({ friendUser }) => {
      if (!currentUser.friends) currentUser.friends = [];
      if (!currentUser.friends.includes(friendUser.id)) {
        currentUser.friends.push(friendUser.id);
      }
      currentUser.friendRequestsReceived = (currentUser.friendRequestsReceived || []).filter(id => id !== friendUser.id);
      currentUser.friendRequestsSent = (currentUser.friendRequestsSent || []).filter(id => id !== friendUser.id);
      playNotificationDing();
      updateRequestsBadge();
      renderSidebarContent();
    });

    socket.on('friend:request_sent_success', ({ targetUserId }) => {
      if (!currentUser.friendRequestsSent) currentUser.friendRequestsSent = [];
      if (!currentUser.friendRequestsSent.includes(targetUserId)) {
        currentUser.friendRequestsSent.push(targetUserId);
      }
      renderSidebarContent();
    });

    socket.on('friend:request_declined', ({ targetUserId }) => {
      currentUser.friendRequestsReceived = (currentUser.friendRequestsReceived || []).filter(id => id !== targetUserId);
      updateRequestsBadge();
      renderSidebarContent();
    });

    // User online status change
    socket.on('user:status_changed', ({ userId, status, lastSeen }) => {
      const u = allUsers.find(x => x.id === userId);
      if (u) {
        u.status = status;
        u.lastSeen = lastSeen;
        renderSidebarContent();
        if (currentTarget && currentTarget.id === userId && !currentTarget.isGroup) {
          updateHeaderStatus(status === 'online');
        }
      }
    });

    socket.on('chat:history', ({ targetId, isGroup, messages }) => {
      if (currentTarget && currentTarget.id === targetId) {
        activeMessages = messages || [];
        renderMessages();
        renderSharedMedia();
      }
    });

    socket.on('message:new', (msg) => {
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

      if (msg.senderId !== currentUser.id) {
        playNotificationDing();
      }

      renderSidebarContent();
    });

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

    socket.on('message:reaction_updated', ({ messageId, reactions }) => {
      const msg = activeMessages.find(m => m.id === messageId);
      if (msg) {
        msg.reactions = reactions;
        updateMessageReactions(messageId, reactions);
      }
    });

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

  function updateRequestsBadge() {
    const count = (currentUser.friendRequestsReceived || []).length;
    if (count > 0) {
      requestsBadge.textContent = count;
      requestsBadge.style.display = 'inline-block';
    } else {
      requestsBadge.style.display = 'none';
    }
  }

  // Sidebar Content Rendering based on Active Nav Tab
  function renderSidebarContent() {
    convListContainer.innerHTML = '';
    const query = convSearchInput.value.toLowerCase().trim();

    // 1. MESSAGES TAB: All conversations + General room
    if (currentSidebarTab === 'messages') {
      // Group room first
      allRooms.forEach(room => {
        if (query && !room.name.toLowerCase().includes(query)) return;
        renderConversationItem(room.id, room.name, room.avatar, true, 'Phòng chung mọi người', 'Nhóm công khai');
      });

      // Direct chats with other users
      const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
      otherUsers.forEach(u => {
        if (query && !u.name.toLowerCase().includes(query) && !(u.phone && u.phone.includes(query))) return;
        const isOnline = u.status === 'online';
        renderConversationItem(u.id, u.name, u.avatar, false, u.bio || `📞 ${u.phone || ''}`, isOnline ? 'Online' : 'Vừa xong', isOnline, u.phone);
      });
    }

    // 2. CONTACTS (FRIENDS) TAB: Only connected friends
    else if (currentSidebarTab === 'friends') {
      const friendIds = currentUser.friends || [];
      const friends = allUsers.filter(u => friendIds.includes(u.id) && u.id !== currentUser.id);

      if (friends.length === 0) {
        convListContainer.innerHTML = `
          <div class="empty-contacts-state">
            <p>Bạn chưa có bạn bè nào.</p>
            <button class="primary-btn" id="btn-add-friend-empty">+ Tìm Bạn Bằng Số Điện Thoại</button>
          </div>
        `;
        const btnEmpty = document.getElementById('btn-add-friend-empty');
        if (btnEmpty) {
          btnEmpty.addEventListener('click', () => {
            addFriendModal.style.display = 'flex';
          });
        }
        return;
      }

      convListContainer.innerHTML = `<div class="contacts-section-title">Bạn bè (${friends.length})</div>`;

      friends.forEach(u => {
        if (query && !u.name.toLowerCase().includes(query) && !(u.phone && u.phone.includes(query))) return;
        const isOnline = u.status === 'online';
        renderConversationItem(u.id, u.name, u.avatar, false, `📞 ${u.phone || ''} • ${u.tag || ''}`, isOnline ? 'Online' : 'Vừa xong', isOnline, u.phone);
      });
    }

    // 3. REQUESTS TAB: Pending friend requests received
    else if (currentSidebarTab === 'requests') {
      const requestIds = currentUser.friendRequestsReceived || [];
      const requesters = allUsers.filter(u => requestIds.includes(u.id));

      if (requesters.length === 0) {
        convListContainer.innerHTML = `
          <div class="empty-contacts-state">
            <p>Không có lời mời kết bạn nào đang chờ.</p>
          </div>
        `;
        return;
      }

      convListContainer.innerHTML = `<div class="contacts-section-title">Lời mời kết bạn (${requesters.length})</div>`;

      requesters.forEach(u => {
        const item = document.createElement('div');
        item.className = 'friend-request-card';
        item.innerHTML = `
          <div class="req-user-meta">
            <img src="${u.avatar}" alt="${u.name}">
            <div class="req-info">
              <span class="req-name">${escapeHTML(u.name)}</span>
              <span class="req-phone">📞 ${escapeHTML(u.phone || '')}</span>
            </div>
          </div>
          <div class="req-actions">
            <button class="btn-accept-req" data-id="${u.id}">Đồng ý</button>
            <button class="btn-decline-req" data-id="${u.id}">Xóa</button>
          </div>
        `;

        item.querySelector('.btn-accept-req').addEventListener('click', () => {
          socket.emit('friend:accept_request', { targetUserId: u.id });
        });

        item.querySelector('.btn-decline-req').addEventListener('click', () => {
          socket.emit('friend:decline_request', { targetUserId: u.id });
        });

        convListContainer.appendChild(item);
      });
    }
  }

  function renderConversationItem(id, name, avatar, isGroup, subtext, statusText, isOnline = false, phone = null) {
    const item = document.createElement('div');
    item.className = `conversation-item ${currentTarget && currentTarget.id === id ? 'active' : ''}`;
    item.innerHTML = `
      <div class="avatar-wrapper">
        <img src="${avatar}" alt="${name}" class="avatar">
        ${!isGroup ? `<span class="status-indicator ${isOnline ? 'online' : ''}"></span>` : ''}
      </div>
      <div class="conversation-meta">
        <div class="conv-top">
          <span class="conv-name">${escapeHTML(name)}</span>
          <span class="conv-time">${escapeHTML(statusText)}</span>
        </div>
        <div class="conv-bottom">
          <span class="conv-last-msg">${escapeHTML(subtext)}</span>
        </div>
      </div>
    `;

    item.addEventListener('click', () => {
      selectTarget({
        id,
        name,
        avatar,
        phone,
        isGroup,
        status: isGroup ? 'Nhóm công khai' : (isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'),
        bio: subtext
      });
      if (window.innerWidth <= 680) {
        sidebarLeft.classList.add('hidden-mobile');
      }
    });

    convListContainer.appendChild(item);
  }

  function selectTarget(target) {
    currentTarget = target;
    activeMessages = [];
    messagesStream.innerHTML = '';
    typingBubble.style.display = 'none';

    // Header
    chatTargetAvatar.src = target.avatar;
    chatTargetName.textContent = target.name;
    updateHeaderStatus(target.status === 'Đang hoạt động' || target.isGroup);

    // Sidebar Right
    infoAvatar.src = target.avatar;
    infoName.textContent = target.name;
    infoPhone.textContent = target.phone ? `📞 ${target.phone}` : '';
    infoBio.textContent = target.bio || '';
    infoChatType.textContent = target.isGroup ? 'Nhóm chung' : 'Trò chuyện 1-1';
    infoOnlineStatus.textContent = target.status;

    socket.emit('chat:get_history', {
      targetId: target.id,
      isGroup: target.isGroup
    });

    renderSidebarContent();
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
        </div>
        ${!msg.recalled ? `
          <div class="message-action-bar">
            ${actionButtonsHtml}
          </div>
        ` : ''}
      </div>
    `;

    const imgEl = row.querySelector('.message-image');
    if (imgEl) {
      imgEl.addEventListener('click', () => {
        lightboxImg.src = msg.imageUrl;
        lightboxModal.style.display = 'flex';
      });
    }

    const reactionBtns = row.querySelectorAll('[data-reaction]');
    reactionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emoji = btn.dataset.reaction;
        socket.emit('message:react', { messageId: msg.id, emoji });
      });
    });

    const replyBtn = row.querySelector('.btn-reply-msg');
    if (replyBtn) {
      replyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setReplyMessage(msg);
      });
    }

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

  function setReplyMessage(msg) {
    replyingTo = msg;
    replyToUser.textContent = msg.senderName;
    replySnippet.textContent = msg.text || (msg.imageUrl ? '[Hình ảnh]' : 'Tin nhắn');
    replyPreviewBar.style.display = 'flex';
    messageInput.focus();
  }

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

  async function handleSendMessage() {
    if (!currentTarget || !socket) return;

    const text = messageInput.value.trim();
    if (!text && !pendingImageFile) return;

    let uploadedImageUrl = null;

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
        alert('Tải ảnh thất bại, vui lòng thử lại!');
        return;
      }
    }

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

    messageInput.value = '';
    adjustTextareaHeight(messageInput);
    stopTyping();

    pendingImageFile = null;
    fileInput.value = '';
    imageUploadPreview.style.display = 'none';

    replyingTo = null;
    replyPreviewBar.style.display = 'none';
  }

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

  function scrollToBottom() {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
  }

  function startSimulatedCall(type) {
    if (!currentTarget) return;
    callAvatar.src = currentTarget.avatar;
    callUserName.textContent = currentTarget.name;
    callStatusLabel.textContent = `Đang gọi ${type === 'video' ? 'video' : 'thoại'}...`;
    callModal.style.display = 'flex';

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

  window.addEventListener('DOMContentLoaded', initApp);
})();
