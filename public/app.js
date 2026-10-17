/**
 * ZaloChat Frontend Application
 * Real-time messaging, Real WebRTC Audio & Video Calling, Pin Messages, Group Management, and Unfriend
 */

(() => {
  // DOM Elements
  const appEl = document.getElementById('app');
  const userSelectModal = document.getElementById('user-select-modal');
  const authTabs = document.querySelectorAll('.auth-tab-btn');
  const authLoginForm = document.getElementById('auth-login-form');
  const authRegisterForm = document.getElementById('auth-register-form');
  const authErrorAlert = document.getElementById('auth-error-alert');

  // Login & Register inputs
  const loginAccountInput = document.getElementById('login-account');
  const loginPasswordInput = document.getElementById('login-password');
  const regNameInput = document.getElementById('reg-name');
  const regPhoneInput = document.getElementById('reg-phone');
  const regUsernameInput = document.getElementById('reg-username');
  const regPasswordInput = document.getElementById('reg-password');

  // Sidebar elements
  const myAvatar = document.getElementById('my-avatar');
  const myName = document.getElementById('my-name');
  const myPhoneTag = document.getElementById('my-phone-tag');
  const btnOpenCreateGroup = document.getElementById('btn-open-create-group');
  const btnOpenAddFriend = document.getElementById('btn-open-add-friend');
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const btnLogout = document.getElementById('btn-logout');
  const convSearchInput = document.getElementById('conversation-search');
  const sidebarNavTabs = document.querySelectorAll('.nav-tab');
  const convListContainer = document.getElementById('conversations-list');
  const sidebarLeft = document.querySelector('.sidebar-left');

  // Modals
  const addFriendModal = document.getElementById('add-friend-modal');
  const btnCloseAddFriend = document.getElementById('btn-close-add-friend');
  const searchFriendForm = document.getElementById('search-friend-form');
  const searchFriendQuery = document.getElementById('search-friend-query');
  const searchResultsArea = document.getElementById('search-results-area');

  const createGroupModal = document.getElementById('create-group-modal');
  const btnCloseCreateGroup = document.getElementById('btn-close-create-group');
  const createGroupForm = document.getElementById('create-group-form');
  const groupNameInput = document.getElementById('group-name-input');
  const friendsSelectionList = document.getElementById('friends-selection-list');

  // Chat main elements
  const btnMobileBack = document.getElementById('btn-mobile-back');
  const chatTargetAvatar = document.getElementById('chat-target-avatar');
  const chatTargetIndicator = document.getElementById('chat-target-indicator');
  const chatTargetName = document.getElementById('chat-target-name');
  const chatTargetSubtext = document.getElementById('chat-target-subtext');
  const btnAudioCall = document.getElementById('btn-audio-call');
  const btnVideoCall = document.getElementById('btn-video-call');
  const btnToggleInfo = document.getElementById('btn-toggle-info');

  // Pinned Message Banner
  const pinnedBanner = document.getElementById('pinned-banner');
  const pinnedSnippet = document.getElementById('pinned-snippet');
  const btnUnpinMsg = document.getElementById('btn-unpin-msg');

  const messagesContainer = document.getElementById('messages-container');
  const messagesStream = document.getElementById('messages-stream');
  const typingBubble = document.getElementById('typing-bubble');
  const typingName = document.getElementById('typing-name');

  // Reply & Image preview
  const replyPreviewBar = document.getElementById('reply-preview-bar');
  const replyToUser = document.getElementById('reply-to-user');
  const replySnippet = document.getElementById('reply-snippet');
  const btnCancelReply = document.getElementById('btn-cancel-reply');

  const imageUploadPreview = document.getElementById('image-upload-preview');
  const previewThumbImg = document.getElementById('preview-thumb-img');
  const previewFilename = document.getElementById('preview-filename');
  const btnRemovePreviewImage = document.getElementById('btn-remove-preview-image');

  // Chat input
  const fileInput = document.getElementById('file-input');
  const btnAttachImage = document.getElementById('btn-attach-image');
  const messageInput = document.getElementById('message-input');
  const btnEmojiTrigger = document.getElementById('btn-emoji-trigger');
  const btnSendMessage = document.getElementById('btn-send-message');
  const emojiPicker = document.getElementById('emoji-picker');
  const btnCloseEmoji = document.getElementById('btn-close-emoji');
  const emojiGrid = document.getElementById('emoji-grid');
  const emojiTabs = document.querySelectorAll('.emoji-tab');

  // Right sidebar & Danger actions
  const sidebarRight = document.getElementById('sidebar-right');
  const btnCloseRightSidebar = document.getElementById('btn-close-right-sidebar');
  const infoAvatar = document.getElementById('info-avatar');
  const infoName = document.getElementById('info-name');
  const infoPhone = document.getElementById('info-phone');
  const infoBio = document.getElementById('info-bio');
  const infoChatType = document.getElementById('info-chat-type');
  const infoOnlineStatus = document.getElementById('info-online-status');
  const sharedMediaGrid = document.getElementById('shared-media-grid');
  const btnUnfriend = document.getElementById('btn-unfriend');
  const btnDeleteGroup = document.getElementById('btn-delete-group');

  // Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  // Real WebRTC Calling Modals & Elements
  const callModal = document.getElementById('call-modal');
  const videoGrid = document.getElementById('video-grid');
  const remoteVideo = document.getElementById('remote-video');
  const localVideo = document.getElementById('local-video');
  const callAvatarContainer = document.getElementById('call-avatar-container');
  const callAvatar = document.getElementById('call-avatar');
  const callUserName = document.getElementById('call-user-name');
  const callStatusLabel = document.getElementById('call-status-label');
  const callTimerLabel = document.getElementById('call-timer-label');
  const btnToggleMic = document.getElementById('btn-toggle-mic');
  const btnToggleCam = document.getElementById('btn-toggle-cam');
  const btnHangupCall = document.getElementById('btn-hangup-call');

  const incomingCallModal = document.getElementById('incoming-call-modal');
  const incomingCallAvatar = document.getElementById('incoming-call-avatar');
  const incomingCallName = document.getElementById('incoming-call-name');
  const incomingCallType = document.getElementById('incoming-call-type');
  const btnAnswerCall = document.getElementById('btn-answer-call');
  const btnRejectCall = document.getElementById('btn-reject-call');

  // Application State
  let socket = null;
  let currentUser = null;
  let allUsers = [];
  let allRooms = [];
  let currentTarget = null;
  let activeMessages = [];
  let currentPinnedMessage = null;
  let unreadCounts = {};
  let lastMessageMap = {};
  let replyingTo = null;
  let pendingImageFile = null;
  let typingTimer = null;
  let isTyping = false;
  let currentSidebarTab = 'messages'; // 'messages' | 'friends'
  let isSoundEnabled = localStorage.getItem('zalochat_sound') !== 'false';

  // WebRTC Call State
  let peerConnection = null;
  let localStream = null;
  let remoteStream = null;
  let activeCallPartner = null;
  let isCallVideo = false;
  let callTimerInterval = null;
  let callSeconds = 0;
  let incomingCallData = null;
  let ringtoneInterval = null;

  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Web Audio Context for notification sounds
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

      gain.gain.setValueAtTime(0.25, now);
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
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
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
    if (!timestamp) return '';
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
    } catch (err) {
      console.error('Failed to bootstrap app:', err);
    }

    const cachedUser = localStorage.getItem('zalochat_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        hideAuthModal();
        connectSocket(parsed);
      } catch (e) {
        localStorage.removeItem('zalochat_user');
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
  }

  function loginUserDirect(user) {
    localStorage.setItem('zalochat_user', JSON.stringify(user));
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
        localStorage.removeItem('zalochat_user');
        currentUser = null;
        currentTarget = null;
        activeMessages = [];
        messagesStream.innerHTML = '';
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

    // Create Group Modal
    btnOpenCreateGroup.addEventListener('click', () => {
      openCreateGroupModal();
    });
    btnCloseCreateGroup.addEventListener('click', () => {
      createGroupModal.style.display = 'none';
    });
    createGroupModal.addEventListener('click', (e) => {
      if (e.target === createGroupModal) createGroupModal.style.display = 'none';
    });

    createGroupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = groupNameInput.value.trim();
      if (!name) return;

      const checkedBoxes = friendsSelectionList.querySelectorAll('input[type="checkbox"]:checked');
      const memberIds = Array.from(checkedBoxes).map(cb => cb.value);

      socket.emit('room:create', { name, memberIds });
      createGroupModal.style.display = 'none';
      groupNameInput.value = '';
    });

    // Open & Close Add Friend Modal
    btnOpenAddFriend.addEventListener('click', () => {
      addFriendModal.style.display = 'flex';
      searchResultsArea.innerHTML = '';
      searchFriendQuery.value = '';
      searchFriendQuery.focus();
    });
    btnCloseAddFriend.addEventListener('click', () => {
      addFriendModal.style.display = 'none';
    });
    addFriendModal.addEventListener('click', (e) => {
      if (e.target === addFriendModal) addFriendModal.style.display = 'none';
    });

    // Search Friend Form Submit (By Phone Number or Username)
    searchFriendForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = searchFriendQuery.value.trim();
      if (!query || !currentUser) return;

      searchResultsArea.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 14px;">Đang tìm kiếm...</p>';

      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&currentUserId=${currentUser.id}`);
        const data = await res.json();
        renderSearchResults(data.results || []);
      } catch (err) {
        searchResultsArea.innerHTML = '<p style="color: var(--danger); text-align: center; padding: 14px;">Lỗi tìm kiếm, vui lòng thử lại!</p>';
      }
    });

    // Unfriend & Delete Group
    btnUnfriend.addEventListener('click', () => {
      if (!currentTarget || currentTarget.isGroup) return;
      if (confirm(`Bạn có chắc muốn hủy kết bạn và xóa ${currentTarget.name} khỏi danh bạ?`)) {
        socket.emit('friend:remove', { targetUserId: currentTarget.id });
        currentTarget = null;
        activeMessages = [];
        messagesStream.innerHTML = '';
        renderSidebarContent();
      }
    });

    btnDeleteGroup.addEventListener('click', () => {
      if (!currentTarget || !currentTarget.isGroup) return;
      if (confirm(`Bạn có chắc muốn xóa nhóm trò chuyện "${currentTarget.name}"?`)) {
        socket.emit('room:delete', { roomId: currentTarget.id });
        currentTarget = null;
        activeMessages = [];
        messagesStream.innerHTML = '';
        renderSidebarContent();
      }
    });

    // Unpin Message
    btnUnpinMsg.addEventListener('click', () => {
      if (!currentPinnedMessage || !currentTarget) return;
      socket.emit('message:unpin', {
        messageId: currentPinnedMessage.id,
        targetId: currentTarget.id,
        isGroup: currentTarget.isGroup
      });
      pinnedBanner.style.display = 'none';
      currentPinnedMessage = null;
    });

    // Click pinned banner to jump to message
    pinnedBanner.addEventListener('click', (e) => {
      if (e.target === btnUnpinMsg) return;
      if (!currentPinnedMessage) return;
      const el = document.querySelector(`[data-msg-id="${currentPinnedMessage.id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pulse-highlight');
        setTimeout(() => el.classList.remove('pulse-highlight'), 1500);
      }
    });

    // Sidebar navigation tabs (Tin nhắn | Bạn bè)
    sidebarNavTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sidebarNavTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSidebarTab = tab.dataset.tab;
        renderSidebarContent();
      });
    });

    convSearchInput.addEventListener('input', () => {
      renderSidebarContent();
    });

    // Message Input & Send
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

    // REAL WEBRTC CALL INITIATION (Voice & Video)
    btnAudioCall.addEventListener('click', () => initiateWebRTCCall(false));
    btnVideoCall.addEventListener('click', () => initiateWebRTCCall(true));

    btnHangupCall.addEventListener('click', () => {
      hangupWebRTCCall(true);
    });

    btnAnswerCall.addEventListener('click', answerIncomingCall);
    btnRejectCall.addEventListener('click', rejectIncomingCall);

    btnToggleMic.addEventListener('click', () => {
      if (!localStream) return;
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        btnToggleMic.classList.toggle('off', !audioTrack.enabled);
      }
    });

    btnToggleCam.addEventListener('click', () => {
      if (!localStream) return;
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        btnToggleCam.classList.toggle('off', !videoTrack.enabled);
      }
    });
  }

  // Open Create Group Modal
  function openCreateGroupModal() {
    createGroupModal.style.display = 'flex';
    friendsSelectionList.innerHTML = '';

    const friendIds = currentUser.friends || [];
    const friends = allUsers.filter(u => friendIds.includes(u.id) && u.id !== currentUser.id);

    if (friends.length === 0) {
      friendsSelectionList.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 10px;">Bạn chưa có bạn bè để thêm vào nhóm. Hãy kết bạn trước nhé!</p>';
      return;
    }

    friends.forEach(f => {
      const label = document.createElement('label');
      label.className = 'friend-checkbox-item';
      label.innerHTML = `
        <input type="checkbox" value="${f.id}">
        <img src="${f.avatar}" alt="${f.name}">
        <span class="friend-checkbox-name">${escapeHTML(f.name)} (${escapeHTML(f.phone || f.tag)})</span>
      `;
      friendsSelectionList.appendChild(label);
    });
  }

  // Render Search Results in Add Friend Modal
  function renderSearchResults(results) {
    searchResultsArea.innerHTML = '';
    if (results.length === 0) {
      searchResultsArea.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 20px;">Không tìm thấy người dùng nào với số điện thoại hoặc tên này.</p>';
      return;
    }

    results.forEach(u => {
      const card = document.createElement('div');
      card.className = 'search-user-card';

      let actionBtnHtml = '';
      if (u.isFriend) {
        actionBtnHtml = `<button class="btn-card-action chat-btn" data-action="chat">💬 Nhắn tin</button>`;
      } else {
        actionBtnHtml = `<button class="btn-card-action add-btn" data-action="add">+ Kết bạn</button>`;
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
            socket.emit('friend:add_direct', { targetUserId: u.id });
            btnAction.textContent = '✓ Đang kết nối...';
            btnAction.className = 'btn-card-action disabled-btn';
            btnAction.disabled = true;

            setTimeout(() => {
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
            }, 300);
          }
        });
      }

      searchResultsArea.appendChild(card);
    });
  }

  // Socket Connection & Real-time Handlers
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
      hideAuthModal();
      currentUser = data.user;
      localStorage.setItem('zalochat_user', JSON.stringify(data.user));
      allUsers = data.users;
      allRooms = data.rooms;
      renderSidebarContent();
    });

    socket.on('login:failed', (data) => {
      localStorage.removeItem('zalochat_user');
      currentUser = null;
      showAuthModal('login');
      showAuthError(data?.error || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
    });

    socket.on('users:list_updated', (updatedUsers) => {
      allUsers = updatedUsers;
      const me = allUsers.find(u => u.id === currentUser.id);
      if (me) currentUser = me;
      renderSidebarContent();
    });

    socket.on('friend:added', ({ friend, message }) => {
      if (!Array.isArray(currentUser.friends)) currentUser.friends = [];
      if (!currentUser.friends.includes(friend.id)) {
        currentUser.friends.push(friend.id);
      }
      playNotificationDing();
      renderSidebarContent();
    });

    socket.on('friend:removed', ({ removedFriendId }) => {
      currentUser.friends = (currentUser.friends || []).filter(id => id !== removedFriendId);
      if (currentTarget && currentTarget.id === removedFriendId) {
        currentTarget = null;
        activeMessages = [];
        messagesStream.innerHTML = '';
      }
      renderSidebarContent();
    });

    socket.on('room:created', ({ room }) => {
      if (!allRooms.find(r => r.id === room.id)) {
        allRooms.push(room);
      }
      playNotificationDing();
      renderSidebarContent();
      selectTarget({
        id: room.id,
        name: room.name,
        avatar: room.avatar,
        isGroup: true,
        status: 'Nhóm trò chuyện',
        bio: room.description
      });
    });

    socket.on('room:deleted', ({ roomId }) => {
      allRooms = allRooms.filter(r => r.id !== roomId);
      if (currentTarget && currentTarget.id === roomId) {
        currentTarget = null;
        activeMessages = [];
        messagesStream.innerHTML = '';
      }
      renderSidebarContent();
    });

    // Pinned Message Real-time Events
    socket.on('message:pinned', ({ message, targetId, isGroup }) => {
      const isRelevant = currentTarget && (
        (isGroup && currentTarget.id === targetId) ||
        (!isGroup && (
          (message.senderId === currentTarget.id && message.targetId === currentUser.id) ||
          (message.senderId === currentUser.id && message.targetId === currentTarget.id)
        ))
      );

      if (isRelevant) {
        currentPinnedMessage = message;
        pinnedSnippet.textContent = message.text || (message.imageUrl ? '[Hình ảnh]' : 'Tin nhắn');
        pinnedBanner.style.display = 'flex';
      }
    });

    socket.on('message:unpinned', ({ messageId, targetId, isGroup }) => {
      const isRelevant = currentTarget && (
        (isGroup && currentTarget.id === targetId) ||
        (!isGroup && (currentTarget.id === targetId || currentUser.id === targetId))
      );

      if (isRelevant && currentPinnedMessage && currentPinnedMessage.id === messageId) {
        currentPinnedMessage = null;
        pinnedBanner.style.display = 'none';
      }
    });

    // Realtime user status
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

    // Chat history received
    socket.on('chat:history', ({ targetId, isGroup, messages, pinnedMessage }) => {
      if (currentTarget && currentTarget.id === targetId) {
        activeMessages = messages || [];
        renderMessages();
        renderSharedMedia();

        if (pinnedMessage) {
          currentPinnedMessage = pinnedMessage;
          pinnedSnippet.textContent = pinnedMessage.text || (pinnedMessage.imageUrl ? '[Hình ảnh]' : 'Tin nhắn');
          pinnedBanner.style.display = 'flex';
        } else {
          currentPinnedMessage = null;
          pinnedBanner.style.display = 'none';
        }
      }
    });

    // REAL-TIME MESSAGE ARRIVAL (NO F5 NEEDED!)
    socket.on('message:new', (msg) => {
      const partnerId = msg.isGroup ? msg.targetId : (msg.senderId === currentUser.id ? msg.targetId : msg.senderId);

      lastMessageMap[partnerId] = {
        text: msg.recalled ? 'Tin nhắn đã được thu hồi' : (msg.text || (msg.imageUrl ? '[Hình ảnh]' : 'Tin nhắn mới')),
        timestamp: msg.timestamp
      };

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
      } else {
        unreadCounts[partnerId] = (unreadCounts[partnerId] || 0) + 1;
      }

      if (msg.senderId !== currentUser.id) {
        playNotificationDing();
      }

      renderSidebarContent();
    });

    // Real-time typing indicators
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

    // Message reaction updated
    socket.on('message:reaction_updated', ({ messageId, reactions }) => {
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

    // ===================================================================
    // WEBRTC SIGNALING LISTENERS (REAL CALL)
    // ===================================================================
    socket.on('call:incoming', ({ caller, isVideo, offer }) => {
      incomingCallData = { caller, isVideo, offer };
      incomingCallAvatar.src = caller.avatar;
      incomingCallName.textContent = caller.name;
      incomingCallType.textContent = isVideo ? '📹 Cuộc gọi video đến...' : '📞 Cuộc gọi thoại đến...';
      incomingCallModal.style.display = 'flex';

      playRingTone();
      ringtoneInterval = setInterval(playRingTone, 2500);
    });

    socket.on('call:answered', async ({ responder, answer }) => {
      callStatusLabel.textContent = 'Đã kết nối';
      startCallTimer();
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('call:candidate', async ({ candidate }) => {
      if (peerConnection && candidate) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {}
      }
    });

    socket.on('call:ended', () => {
      hangupWebRTCCall(false);
    });

    socket.on('call:rejected', () => {
      callStatusLabel.textContent = 'Cuộc gọi bị từ chối';
      setTimeout(() => hangupWebRTCCall(false), 1200);
    });
  }

  // ===================================================================
  // WEBRTC CALLING IMPLEMENTATION
  // ===================================================================
  async function initiateWebRTCCall(isVideo = false) {
    if (!currentTarget || currentTarget.isGroup) {
      alert('Chức năng gọi hiện chỉ áp dụng cho trò chuyện 1-1!');
      return;
    }

    activeCallPartner = currentTarget;
    isCallVideo = isVideo;

    callAvatar.src = currentTarget.avatar;
    callUserName.textContent = currentTarget.name;
    callStatusLabel.textContent = 'Đang gọi...';
    callTimerLabel.style.display = 'none';
    callModal.style.display = 'flex';

    if (isVideo) {
      videoGrid.style.display = 'block';
      callAvatarContainer.style.display = 'none';
    } else {
      videoGrid.style.display = 'none';
      callAvatarContainer.style.display = 'flex';
    }

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo ? { width: { ideal: 640 }, height: { ideal: 480 } } : false
      });
      if (isVideo && localVideo) {
        localVideo.srcObject = localStream;
      }
    } catch (err) {
      console.warn('Microphone/Camera permission error:', err);
    }

    peerConnection = new RTCPeerConnection(rtcConfig);

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
      remoteStream = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket && activeCallPartner) {
        socket.emit('call:candidate', {
          targetUserId: activeCallPartner.id,
          candidate: event.candidate
        });
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('call:initiate', {
      targetUserId: activeCallPartner.id,
      isVideo,
      offer
    });

    playRingTone();
    ringtoneInterval = setInterval(playRingTone, 3000);
  }

  async function answerIncomingCall() {
    if (!incomingCallData) return;
    clearInterval(ringtoneInterval);
    incomingCallModal.style.display = 'none';

    const { caller, isVideo, offer } = incomingCallData;
    activeCallPartner = caller;
    isCallVideo = isVideo;

    callAvatar.src = caller.avatar;
    callUserName.textContent = caller.name;
    callStatusLabel.textContent = 'Đang kết nối...';
    callModal.style.display = 'flex';

    if (isVideo) {
      videoGrid.style.display = 'block';
      callAvatarContainer.style.display = 'none';
    } else {
      videoGrid.style.display = 'none';
      callAvatarContainer.style.display = 'flex';
    }

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideo ? { width: { ideal: 640 }, height: { ideal: 480 } } : false
      });
      if (isVideo && localVideo) {
        localVideo.srcObject = localStream;
      }
    } catch (err) {
      console.warn('Microphone/Camera error:', err);
    }

    peerConnection = new RTCPeerConnection(rtcConfig);

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
      remoteStream = event.streams[0];
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket && activeCallPartner) {
        socket.emit('call:candidate', {
          targetUserId: activeCallPartner.id,
          candidate: event.candidate
        });
      }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('call:answer', {
      targetUserId: caller.id,
      answer
    });

    callStatusLabel.textContent = 'Đã kết nối';
    startCallTimer();
  }

  function rejectIncomingCall() {
    clearInterval(ringtoneInterval);
    incomingCallModal.style.display = 'none';
    if (incomingCallData && socket) {
      socket.emit('call:reject', { targetUserId: incomingCallData.caller.id });
    }
    incomingCallData = null;
  }

  function hangupWebRTCCall(notifyPeer = true) {
    clearInterval(ringtoneInterval);
    stopCallTimer();

    if (notifyPeer && socket && activeCallPartner) {
      socket.emit('call:hangup', { targetUserId: activeCallPartner.id });
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream = null;
    }
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    callModal.style.display = 'none';
    incomingCallModal.style.display = 'none';
    activeCallPartner = null;
    incomingCallData = null;
  }

  function startCallTimer() {
    callSeconds = 0;
    callTimerLabel.style.display = 'block';
    callTimerLabel.textContent = '00:00';
    clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
      callSeconds++;
      const mins = Math.floor(callSeconds / 60).toString().padStart(2, '0');
      const secs = (callSeconds % 60).toString().padStart(2, '0');
      callTimerLabel.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopCallTimer() {
    clearInterval(callTimerInterval);
    callTimerLabel.style.display = 'none';
  }

  // Render Sidebar Content
  function renderSidebarContent() {
    convListContainer.innerHTML = '';
    const query = convSearchInput.value.toLowerCase().trim();

    // 1. MESSAGES TAB: Conversations + Groups
    if (currentSidebarTab === 'messages') {
      allRooms.forEach(room => {
        if (query && !room.name.toLowerCase().includes(query)) return;
        const last = lastMessageMap[room.id];
        renderConversationItem(
          room.id,
          room.name,
          room.avatar,
          true,
          last ? last.text : 'Nhóm trò chuyện',
          last ? formatTimestamp(last.timestamp) : 'Nhóm',
          true,
          null,
          unreadCounts[room.id] || 0
        );
      });

      const friendIds = currentUser.friends || [];
      const relevantUserIds = new Set([
        ...friendIds,
        ...Object.keys(lastMessageMap)
      ]);

      const directUsers = allUsers.filter(u => relevantUserIds.has(u.id) && u.id !== currentUser.id);

      directUsers.sort((a, b) => {
        const timeA = lastMessageMap[a.id] ? lastMessageMap[a.id].timestamp : 0;
        const timeB = lastMessageMap[b.id] ? lastMessageMap[b.id].timestamp : 0;
        return timeB - timeA;
      });

      if (directUsers.length === 0 && allRooms.length === 0) {
        convListContainer.innerHTML = `
          <div class="empty-contacts-state">
            <p>Chưa có cuộc trò chuyện nào.</p>
            <button class="primary-btn" id="btn-add-friend-empty">+ Tìm Bạn Bằng Số Điện Thoại</button>
          </div>
        `;
        const btnEmpty = document.getElementById('btn-add-friend-empty');
        if (btnEmpty) {
          btnEmpty.addEventListener('click', () => {
            btnOpenAddFriend.click();
          });
        }
        return;
      }

      directUsers.forEach(u => {
        if (query && !u.name.toLowerCase().includes(query) && !(u.phone && u.phone.includes(query))) return;
        const isOnline = u.status === 'online';
        const last = lastMessageMap[u.id];
        const unread = unreadCounts[u.id] || 0;

        renderConversationItem(
          u.id,
          u.name,
          u.avatar,
          false,
          last ? last.text : `📞 ${u.phone || ''}`,
          last ? formatTimestamp(last.timestamp) : (isOnline ? 'Online' : 'Vừa xong'),
          isOnline,
          u.phone,
          unread
        );
      });
    }

    // 2. FRIENDS (DANH BẠ) TAB: Connected friends
    else if (currentSidebarTab === 'friends') {
      const friendIds = currentUser.friends || [];
      const friends = allUsers.filter(u => friendIds.includes(u.id) && u.id !== currentUser.id);

      if (friends.length === 0) {
        convListContainer.innerHTML = `
          <div class="empty-contacts-state">
            <p>Bạn chưa có bạn bè nào trong danh bạ.</p>
            <button class="primary-btn" id="btn-add-friend-empty">+ Tìm Bạn Bằng Số Điện Thoại</button>
          </div>
        `;
        const btnEmpty = document.getElementById('btn-add-friend-empty');
        if (btnEmpty) {
          btnEmpty.addEventListener('click', () => {
            btnOpenAddFriend.click();
          });
        }
        return;
      }

      convListContainer.innerHTML = `<div class="contacts-section-title">Bạn bè (${friends.length})</div>`;

      friends.forEach(u => {
        if (query && !u.name.toLowerCase().includes(query) && !(u.phone && u.phone.includes(query))) return;
        const isOnline = u.status === 'online';
        renderConversationItem(
          u.id,
          u.name,
          u.avatar,
          false,
          `📞 ${u.phone || ''} • ${u.tag || ''}`,
          isOnline ? 'Online' : 'Vừa xong',
          isOnline,
          u.phone,
          0
        );
      });
    }
  }

  function renderConversationItem(id, name, avatar, isGroup, subtext, statusText, isOnline = false, phone = null, unread = 0) {
    const item = document.createElement('div');
    const isActive = currentTarget && currentTarget.id === id;
    item.className = `conversation-item ${isActive ? 'active' : ''} ${unread > 0 ? 'has-unread' : ''}`;
    
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
          ${unread > 0 ? `<span class="unread-badge">${unread}</span>` : ''}
        </div>
      </div>
    `;

    item.addEventListener('click', () => {
      unreadCounts[id] = 0;
      selectTarget({
        id,
        name,
        avatar,
        phone,
        isGroup,
        status: isGroup ? 'Nhóm trò chuyện' : (isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'),
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

    unreadCounts[target.id] = 0;

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

    // Danger Actions Toggle
    if (target.isGroup) {
      btnDeleteGroup.style.display = 'block';
      btnUnfriend.style.display = 'none';
    } else {
      btnDeleteGroup.style.display = 'none';
      btnUnfriend.style.display = 'block';
    }

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
      <button class="action-bar-btn btn-pin-msg" title="Ghim tin nhắn">📌</button>
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

    // Pin button click
    const pinBtn = row.querySelector('.btn-pin-msg');
    if (pinBtn) {
      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        socket.emit('message:pin', {
          messageId: msg.id,
          targetId: currentTarget.id,
          isGroup: currentTarget.isGroup
        });
      });
    }

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

  window.addEventListener('DOMContentLoaded', initApp);
})();
