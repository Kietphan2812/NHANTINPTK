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

  // Chat input & Voice recording
  const fileInput = document.getElementById('file-input');
  const btnAttachImage = document.getElementById('btn-attach-image');
  const btnRecordVoice = document.getElementById('btn-record-voice');
  const voiceRecordingBar = document.getElementById('voice-recording-bar');
  const recordingTime = document.getElementById('recording-time');
  const btnCancelVoice = document.getElementById('btn-cancel-voice');
  const btnSendVoice = document.getElementById('btn-send-voice');
  const chatInputToolbar = document.getElementById('chat-input-toolbar');
  const messageInput = document.getElementById('message-input');
  const btnEmojiTrigger = document.getElementById('btn-emoji-trigger');
  const btnSendMessage = document.getElementById('btn-send-message');
  const emojiPicker = document.getElementById('emoji-picker');
  const btnCloseEmoji = document.getElementById('btn-close-emoji');
  const emojiGrid = document.getElementById('emoji-grid');
  const emojiTabs = document.querySelectorAll('.emoji-tab');

  // User Profile Modal Elements
  const btnMyProfile = document.getElementById('btn-my-profile');
  const btnMobileProfile = document.getElementById('btn-mobile-profile');
  const profileModal = document.getElementById('profile-modal');
  const btnCloseProfileModal = document.getElementById('btn-close-profile-modal');
  const profileModalAvatar = document.getElementById('profile-modal-avatar');
  const btnChangeAvatar = document.getElementById('btn-change-avatar');
  const profileInputName = document.getElementById('profile-input-name');
  const profileInputPhone = document.getElementById('profile-input-phone');
  const profileInputUsername = document.getElementById('profile-input-username');
  const profileInputBio = document.getElementById('profile-input-bio');
  const profileEditForm = document.getElementById('profile-edit-form');
  const btnProfileLogout = document.getElementById('btn-profile-logout');
  const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');

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
  const btnLeaveGroup = document.getElementById('btn-leave-group');
  const btnClearHistory = document.getElementById('btn-clear-history');
  const btnEditContactName = document.getElementById('btn-edit-contact-name');
  const btnPinConv = document.getElementById('btn-pin-conv');
  const btnMuteNotif = document.getElementById('btn-mute-notif');
  const rowReminderList = document.getElementById('row-reminder-list');
  const btnViewAllMedia = document.getElementById('btn-view-all-media');
  const btnNamecard = document.getElementById('btn-namecard');
  const btnQuickReply = document.getElementById('btn-quick-reply');
  const btnReminder = document.getElementById('btn-reminder');
  const btnZcloud = document.getElementById('rail-btn-zcloud');

  // New Modals & Elements
  const reminderModal = document.getElementById('reminder-modal');
  const btnCloseReminder = document.getElementById('btn-close-reminder');
  const reminderForm = document.getElementById('reminder-form');
  const reminderTitleInput = document.getElementById('reminder-title-input');
  const reminderTimeInput = document.getElementById('reminder-time-input');
  const reminderRepeatInput = document.getElementById('reminder-repeat-input');

  const reminderListModal = document.getElementById('reminder-list-modal');
  const btnCloseReminderList = document.getElementById('btn-close-reminder-list');
  const reminderItemsContainer = document.getElementById('reminder-items-container');
  const btnOpenCreateReminderFromList = document.getElementById('btn-open-create-reminder-from-list');

  const quickReplyPopup = document.getElementById('quick-reply-popup');
  const btnCloseQuickReply = document.getElementById('btn-close-quick-reply');
  const quickReplyList = document.getElementById('quick-reply-list');
  const addQuickReplyForm = document.getElementById('add-quick-reply-form');
  const addQuickReplyInput = document.getElementById('add-quick-reply-input');

  const shareContactModal = document.getElementById('share-contact-modal');
  const btnCloseShareContact = document.getElementById('btn-close-share-contact');
  const shareContactList = document.getElementById('share-contact-list');

  const editNicknameModal = document.getElementById('edit-nickname-modal');
  const btnCloseNickname = document.getElementById('btn-close-nickname');
  const editNicknameForm = document.getElementById('edit-nickname-form');
  const inputNickname = document.getElementById('input-nickname');
  const btnResetNickname = document.getElementById('btn-reset-nickname');

  const mediaGalleryModal = document.getElementById('media-gallery-modal');
  const btnCloseGallery = document.getElementById('btn-close-gallery');
  const galleryTabs = document.querySelectorAll('.gallery-tab-btn');
  const galleryContentArea = document.getElementById('gallery-content-area');
  const galleryPhotoCount = document.getElementById('gallery-photo-count');
  const galleryFileCount = document.getElementById('gallery-file-count');
  const galleryLinkCount = document.getElementById('gallery-link-count');

  const addMemberModal = document.getElementById('add-member-modal');
  const btnCloseAddMember = document.getElementById('btn-close-add-member');
  const addMemberList = document.getElementById('add-member-list');
  const btnConfirmAddMembers = document.getElementById('btn-confirm-add-members');
  const btnOpenAddMember = document.getElementById('btn-open-add-member');
  const groupMembersSection = document.getElementById('group-members-section');
  const groupMemberCount = document.getElementById('group-member-count');
  const groupMembersList = document.getElementById('group-members-list');

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

  // Voice Recording State (Zalo / Messenger Style)
  let voiceMediaRecorder = null;
  let voiceAudioChunks = [];
  let voiceRecordTimer = null;
  let voiceRecordSeconds = 0;
  let voiceMediaStream = null;

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

  const CLOUD_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230068ff"/><stop offset="100%" stop-color="%2300a8ff"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(%23cg)"/><path d="M68 53h-2.5A16 16 0 1 0 34 68h34a10 10 0 0 0 0-15z" fill="white"/></svg>';

  function getUserSettings() {
    if (!currentUser) return { pinnedConversations: [], mutedConversations: [], aliases: {}, quickReplies: [] };
    if (!currentUser.settings || typeof currentUser.settings !== 'object') {
      currentUser.settings = { pinnedConversations: [], mutedConversations: [], aliases: {}, quickReplies: [] };
    }
    if (!Array.isArray(currentUser.settings.pinnedConversations)) currentUser.settings.pinnedConversations = [];
    if (!Array.isArray(currentUser.settings.mutedConversations)) currentUser.settings.mutedConversations = [];
    if (!currentUser.settings.aliases || typeof currentUser.settings.aliases !== 'object') currentUser.settings.aliases = {};
    if (!Array.isArray(currentUser.settings.quickReplies)) currentUser.settings.quickReplies = [];
    return currentUser.settings;
  }

  function saveUserSettings() {
    if (!currentUser) return;
    const settings = getUserSettings();
    localStorage.setItem('zalochat_user', JSON.stringify(currentUser));
    if (socket) {
      socket.emit('user:update_settings', { settings });
    }
  }

  function getDisplayName(userId, originalName) {
    if (!userId || !originalName) return originalName || '';
    const settings = getUserSettings();
    if (settings.aliases && settings.aliases[userId]) {
      return settings.aliases[userId];
    }
    return originalName;
  }

  function playNotificationDing(partnerId = null) {
    if (!isSoundEnabled) return;
    if (partnerId) {
      const settings = getUserSettings();
      if (settings.mutedConversations.includes(partnerId)) return;
    }
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
      currentTarget = null;
    });

    // Password Visibility Eye Toggle
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.target;
        const targetInput = document.getElementById(targetId);
        if (targetInput) {
          const isPwd = targetInput.type === 'password';
          targetInput.type = isPwd ? 'text' : 'password';
          btn.innerHTML = isPwd
            ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
            : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        }
      });
    });

    // Mobile Bottom Navigation Tabs (Tin nhắn | Danh bạ | Cá nhân)
    mobileNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.id === 'btn-mobile-profile') {
          openProfileModal();
          return;
        }
        const tab = btn.dataset.tab;
        if (tab) {
          mobileNavBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
          sidebarNavTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
          currentSidebarTab = tab;
          renderSidebarContent();
        }
      });
    });

    // Zalo Rail Navigation (Messages / Friends)
    const railBtnMessages = document.getElementById('rail-btn-messages');
    const railBtnFriends = document.getElementById('rail-btn-friends');
    const subTabPriority = document.getElementById('sub-tab-priority');
    const subTabOther = document.getElementById('sub-tab-other');

    if (railBtnMessages && railBtnFriends) {
      railBtnMessages.addEventListener('click', () => {
        railBtnMessages.classList.add('active');
        railBtnFriends.classList.remove('active');
        if (subTabPriority) subTabPriority.classList.add('active');
        if (subTabOther) subTabOther.classList.remove('active');
        currentSidebarTab = 'messages';
        renderSidebarContent();
      });
      railBtnFriends.addEventListener('click', () => {
        railBtnFriends.classList.add('active');
        railBtnMessages.classList.remove('active');
        if (subTabOther) subTabOther.classList.add('active');
        if (subTabPriority) subTabPriority.classList.remove('active');
        currentSidebarTab = 'friends';
        renderSidebarContent();
      });
    }

    if (subTabPriority && subTabOther) {
      subTabPriority.addEventListener('click', () => {
        subTabPriority.classList.add('active');
        subTabOther.classList.remove('active');
        if (railBtnMessages) railBtnMessages.classList.add('active');
        if (railBtnFriends) railBtnFriends.classList.remove('active');
        currentSidebarTab = 'messages';
        renderSidebarContent();
      });
      subTabOther.addEventListener('click', () => {
        subTabOther.classList.add('active');
        subTabPriority.classList.remove('active');
        if (railBtnFriends) railBtnFriends.classList.add('active');
        if (railBtnMessages) railBtnMessages.classList.remove('active');
        currentSidebarTab = 'friends';
        renderSidebarContent();
      });
    }

    // Rail Feature Shortcuts (Cloud của tôi, Settings, Todo, etc.)
    if (btnZcloud) {
      btnZcloud.addEventListener('click', openCloudChat);
    }
    const btnRailSettings = document.getElementById('btn-rail-settings');
    if (btnRailSettings) {
      btnRailSettings.addEventListener('click', openProfileModal);
    }
    const railBtnCapture = document.getElementById('rail-btn-capture');
    if (railBtnCapture) {
      railBtnCapture.addEventListener('click', () => {
        alert('Phím tắt chụp màn hình Zalo: Nhấn phím PrintScreen hoặc Windows + Shift + S');
      });
    }

    // Zalo Input Toolbar Buttons
    const btnSticker = document.getElementById('btn-sticker');
    if (btnSticker) {
      btnSticker.addEventListener('click', () => {
        btnEmojiTrigger.click();
      });
    }
    const btnAttachFile = document.getElementById('btn-attach-file');
    if (btnAttachFile) {
      btnAttachFile.addEventListener('click', () => {
        fileInput.click();
      });
    }
    const btnQuickLike = document.getElementById('btn-quick-like');
    if (btnQuickLike) {
      btnQuickLike.addEventListener('click', () => {
        if (!currentTarget || !socket) return;
        socket.emit('message:send', {
          targetId: currentTarget.id,
          isGroup: currentTarget.isGroup,
          text: '👍',
          imageUrl: null,
          replyTo: null
        });
      });
    }

    // New Toolbar Actions (Namecard, Quick Reply, Reminder)
    if (btnNamecard) {
      btnNamecard.addEventListener('click', openShareContactModal);
    }
    if (btnQuickReply) {
      btnQuickReply.addEventListener('click', toggleQuickReplyPopup);
    }
    if (btnReminder) {
      btnReminder.addEventListener('click', openReminderModal);
    }

    // Floating Scroll to Bottom
    const btnScrollBottom = document.getElementById('btn-scroll-bottom');
    if (btnScrollBottom && messagesContainer) {
      messagesContainer.addEventListener('scroll', () => {
        const distFromBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight;
        btnScrollBottom.style.display = distFromBottom > 160 ? 'flex' : 'none';
      });
      btnScrollBottom.addEventListener('click', () => {
        messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
      });
    }

    // Search inside chat
    const btnSearchChat = document.getElementById('btn-search-chat');
    if (btnSearchChat) {
      btnSearchChat.addEventListener('click', () => {
        const q = prompt('Tìm kiếm tin nhắn trong cuộc trò chuyện:');
        if (q) {
          const bubbles = Array.from(messagesStream.querySelectorAll('.message-bubble'));
          const match = bubbles.reverse().find(b => b.textContent.toLowerCase().includes(q.toLowerCase()));
          if (match) {
            match.scrollIntoView({ behavior: 'smooth', block: 'center' });
            match.style.boxShadow = '0 0 0 3px #0068ff';
            setTimeout(() => { match.style.boxShadow = ''; }, 2500);
          } else {
            alert('Không tìm thấy tin nhắn nào!');
          }
        }
      });
    }

    // Right Sidebar Quick Actions (Mute, Pin, Create Group, Nickname, Reminders, Gallery, Danger)
    if (btnMuteNotif) {
      btnMuteNotif.addEventListener('click', toggleMuteCurrentConversation);
    }
    if (btnPinConv) {
      btnPinConv.addEventListener('click', togglePinCurrentConversation);
    }
    const btnCreateGroupWith = document.getElementById('btn-create-group-with');
    if (btnCreateGroupWith) {
      btnCreateGroupWith.addEventListener('click', () => {
        btnOpenCreateGroup.click();
      });
    }
    if (btnEditContactName) {
      btnEditContactName.addEventListener('click', openEditNicknameModal);
    }
    if (rowReminderList) {
      rowReminderList.addEventListener('click', openReminderListModal);
    }
    if (btnViewAllMedia) {
      btnViewAllMedia.addEventListener('click', openMediaGalleryModal);
    }
    if (btnClearHistory) {
      btnClearHistory.addEventListener('click', clearCurrentHistory);
    }
    if (btnLeaveGroup) {
      btnLeaveGroup.addEventListener('click', leaveCurrentGroup);
    }
    if (btnOpenAddMember) {
      btnOpenAddMember.addEventListener('click', openAddMemberModal);
    }

    // Reminder Modals Listeners
    if (btnCloseReminder) btnCloseReminder.addEventListener('click', () => { reminderModal.style.display = 'none'; });
    if (reminderModal) reminderModal.addEventListener('click', (e) => { if (e.target === reminderModal) reminderModal.style.display = 'none'; });
    if (reminderForm) {
      reminderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentTarget || !socket) return;
        const title = reminderTitleInput.value.trim();
        const time = reminderTimeInput.value;
        const repeat = reminderRepeatInput.value;
        if (!title || !time) return;

        socket.emit('message:send', {
          targetId: currentTarget.id,
          isGroup: currentTarget.isGroup,
          text: `[Nhắc hẹn] ${title}`,
          messageType: 'reminder',
          extraData: {
            title,
            time,
            repeat,
            creatorName: currentUser.name
          }
        });

        reminderModal.style.display = 'none';
        reminderTitleInput.value = '';
      });
    }

    if (btnCloseReminderList) btnCloseReminderList.addEventListener('click', () => { reminderListModal.style.display = 'none'; });
    if (reminderListModal) reminderListModal.addEventListener('click', (e) => { if (e.target === reminderListModal) reminderListModal.style.display = 'none'; });
    if (btnOpenCreateReminderFromList) {
      btnOpenCreateReminderFromList.addEventListener('click', () => {
        reminderListModal.style.display = 'none';
        openReminderModal();
      });
    }

    // Quick Reply Popup Listeners
    if (btnCloseQuickReply) btnCloseQuickReply.addEventListener('click', () => { quickReplyPopup.style.display = 'none'; });
    if (addQuickReplyForm) {
      addQuickReplyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = addQuickReplyInput.value.trim();
        if (!val) return;
        const settings = getUserSettings();
        if (!settings.quickReplies || settings.quickReplies.length === 0) {
          settings.quickReplies = [...getQuickReplies()];
        }
        if (!settings.quickReplies.includes(val)) {
          settings.quickReplies.push(val);
        }
        saveUserSettings();
        addQuickReplyInput.value = '';
        renderQuickReplyList();
      });
    }
    document.addEventListener('click', (e) => {
      if (quickReplyPopup && quickReplyPopup.style.display === 'flex') {
        if (!quickReplyPopup.contains(e.target) && e.target !== btnQuickReply && !btnQuickReply.contains(e.target)) {
          quickReplyPopup.style.display = 'none';
        }
      }
    });

    // Share Contact Modal Listeners
    if (btnCloseShareContact) btnCloseShareContact.addEventListener('click', () => { shareContactModal.style.display = 'none'; });
    if (shareContactModal) shareContactModal.addEventListener('click', (e) => { if (e.target === shareContactModal) shareContactModal.style.display = 'none'; });

    // Edit Nickname Modal Listeners
    if (btnCloseNickname) btnCloseNickname.addEventListener('click', () => { editNicknameModal.style.display = 'none'; });
    if (editNicknameModal) editNicknameModal.addEventListener('click', (e) => { if (e.target === editNicknameModal) editNicknameModal.style.display = 'none'; });
    if (editNicknameForm) {
      editNicknameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentTarget || currentTarget.isGroup || currentTarget.isCloud) return;
        const newNick = inputNickname.value.trim();
        const settings = getUserSettings();
        if (newNick) {
          settings.aliases[currentTarget.id] = newNick;
        } else {
          delete settings.aliases[currentTarget.id];
        }
        saveUserSettings();
        editNicknameModal.style.display = 'none';
        chatTargetName.textContent = getDisplayName(currentTarget.id, currentTarget.name);
        infoName.textContent = getDisplayName(currentTarget.id, currentTarget.name);
        renderSidebarContent();
      });
    }
    if (btnResetNickname) {
      btnResetNickname.addEventListener('click', () => {
        if (!currentTarget || currentTarget.isGroup || currentTarget.isCloud) return;
        const settings = getUserSettings();
        delete settings.aliases[currentTarget.id];
        saveUserSettings();
        editNicknameModal.style.display = 'none';
        chatTargetName.textContent = currentTarget.name;
        infoName.textContent = currentTarget.name;
        renderSidebarContent();
      });
    }

    // Media Gallery Modal Listeners
    if (btnCloseGallery) btnCloseGallery.addEventListener('click', () => { mediaGalleryModal.style.display = 'none'; });
    if (mediaGalleryModal) mediaGalleryModal.addEventListener('click', (e) => { if (e.target === mediaGalleryModal) mediaGalleryModal.style.display = 'none'; });
    if (galleryTabs) {
      galleryTabs.forEach(t => {
        t.addEventListener('click', () => {
          galleryTabs.forEach(x => x.classList.remove('active'));
          t.classList.add('active');
          activeGalleryTab = t.dataset.galleryTab;
          renderGalleryContent();
        });
      });
    }

    // Add Member Modal Listeners
    if (btnCloseAddMember) btnCloseAddMember.addEventListener('click', () => { addMemberModal.style.display = 'none'; });
    if (addMemberModal) addMemberModal.addEventListener('click', (e) => { if (e.target === addMemberModal) addMemberModal.style.display = 'none'; });
    if (btnConfirmAddMembers) {
      btnConfirmAddMembers.addEventListener('click', () => {
        if (!currentTarget || !currentTarget.isGroup) return;
        const checked = addMemberList.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(checked).map(c => c.value);
        if (selectedIds.length === 0) {
          alert('Vui lòng chọn ít nhất một người bạn để thêm vào nhóm!');
          return;
        }
        socket.emit('room:add_member', {
          roomId: currentTarget.id,
          memberIds: selectedIds
        });
        addMemberModal.style.display = 'none';
      });
    }

    // Profile Modal Listeners
    if (btnMyProfile) btnMyProfile.addEventListener('click', openProfileModal);
    if (btnMobileProfile) btnMobileProfile.addEventListener('click', openProfileModal);
    if (btnCloseProfileModal) btnCloseProfileModal.addEventListener('click', closeProfileModal);
    if (profileModal) {
      profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) closeProfileModal();
      });
    }
    if (btnChangeAvatar) {
      btnChangeAvatar.addEventListener('click', () => {
        const rand = Math.random().toString(36).substring(2, 9);
        profileModalAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${rand}`;
      });
    }
    if (profileEditForm) {
      profileEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const newName = profileInputName.value.trim();
        const newBio = profileInputBio.value.trim();
        const newAvatar = profileModalAvatar.src;

        try {
          const res = await fetch('/api/users/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: currentUser.id,
              name: newName,
              bio: newBio,
              avatar: newAvatar
            })
          });
          const data = await res.json();
          if (data.success && data.user) {
            currentUser = data.user;
            localStorage.setItem('zalochat_user', JSON.stringify(currentUser));
            myAvatar.src = currentUser.avatar;
            myName.textContent = currentUser.name;
            closeProfileModal();
            alert('Cập nhật hồ sơ thành công!');
          }
        } catch (err) {
          alert('Lỗi cập nhật hồ sơ, vui lòng thử lại!');
        }
      });
    }
    if (btnProfileLogout) {
      btnProfileLogout.addEventListener('click', () => {
        closeProfileModal();
        btnLogout.click();
      });
    }

    // Voice Recording Listeners (Zalo / Messenger Style)
    if (btnRecordVoice) btnRecordVoice.addEventListener('click', startVoiceRecording);
    if (btnCancelVoice) btnCancelVoice.addEventListener('click', cancelVoiceRecording);
    if (btnSendVoice) btnSendVoice.addEventListener('click', sendVoiceRecording);

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

  // ===================================================================
  // ZALO FEATURES IMPLEMENTATION (Cloud, Pin, Mute, Nickname, Reminders,
  // Quick Replies, Share Contact, Media Gallery, Group Management)
  // ===================================================================

  // 1. Cloud Chat (Cloud của tôi)
  function openCloudChat() {
    if (!currentUser) return;
    selectTarget({
      id: currentUser.id,
      name: 'Cloud của tôi',
      rawName: 'Cloud của tôi',
      avatar: CLOUD_AVATAR,
      isGroup: false,
      isCloud: true,
      status: 'Lưu trữ đám mây cá nhân',
      bio: 'Nơi lưu trữ ghi chú, hình ảnh, tập tin cá nhân an toàn giữa các thiết bị'
    });
  }

  // 2. Pin Conversation
  function togglePinCurrentConversation() {
    if (!currentTarget || currentTarget.isCloud) return;
    const settings = getUserSettings();
    const idx = settings.pinnedConversations.indexOf(currentTarget.id);
    if (idx > -1) {
      settings.pinnedConversations.splice(idx, 1);
    } else {
      settings.pinnedConversations.push(currentTarget.id);
    }
    saveUserSettings();
    updatePinMuteButtonUI();
    renderSidebarContent();
  }

  // 3. Mute Conversation
  function toggleMuteCurrentConversation() {
    if (!currentTarget || currentTarget.isCloud) return;
    const settings = getUserSettings();
    const idx = settings.mutedConversations.indexOf(currentTarget.id);
    if (idx > -1) {
      settings.mutedConversations.splice(idx, 1);
    } else {
      settings.mutedConversations.push(currentTarget.id);
    }
    saveUserSettings();
    updatePinMuteButtonUI();
    renderSidebarContent();
  }

  function updatePinMuteButtonUI() {
    if (!currentTarget) return;
    const settings = getUserSettings();
    const isPinned = settings.pinnedConversations.includes(currentTarget.id);
    const isMuted = settings.mutedConversations.includes(currentTarget.id);

    if (btnPinConv) {
      btnPinConv.classList.toggle('active', isPinned);
      const pinLabel = document.getElementById('btn-pin-label');
      if (pinLabel) pinLabel.textContent = isPinned ? 'Bỏ ghim' : 'Ghim hội thoại';
    }
    if (btnMuteNotif) {
      btnMuteNotif.classList.toggle('active', isMuted);
      const muteLabel = document.getElementById('btn-mute-label');
      if (muteLabel) muteLabel.textContent = isMuted ? 'Bật thông báo' : 'Tắt thông báo';
    }
  }

  // 4. Edit Nickname Modal
  function openEditNicknameModal() {
    if (!currentTarget || currentTarget.isGroup || currentTarget.isCloud) return;
    const settings = getUserSettings();
    const currentAlias = settings.aliases[currentTarget.id] || '';
    inputNickname.value = currentAlias || currentTarget.name;
    editNicknameModal.style.display = 'flex';
    inputNickname.focus();
  }

  // 5. Reminders
  function openReminderModal() {
    if (!currentTarget) return;
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
    reminderTimeInput.value = localISOTime;
    reminderTitleInput.value = '';
    reminderModal.style.display = 'flex';
    reminderTitleInput.focus();
  }

  function openReminderListModal() {
    if (!currentTarget) return;
    reminderItemsContainer.innerHTML = '';
    const reminders = activeMessages.filter(m => m.messageType === 'reminder' && !m.recalled);
    if (reminders.length === 0) {
      reminderItemsContainer.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 20px;">Chưa có nhắc hẹn nào trong cuộc trò chuyện này.</p>';
    } else {
      reminders.forEach(rm => {
        const ed = rm.extraData || {};
        const timeStr = ed.time ? new Date(ed.time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Không rõ';
        const item = document.createElement('div');
        item.className = 'reminder-list-item';
        item.innerHTML = `
          <div class="reminder-item-left">
            <h5>${escapeHTML(ed.title || rm.text || 'Nhắc hẹn')}</h5>
            <p>${timeStr} • Tạo bởi ${escapeHTML(ed.creatorName || rm.senderName || 'Bạn')}</p>
          </div>
          <button class="btn-done-reminder" title="Hoàn thành">Đã xong</button>
        `;
        const btnDone = item.querySelector('.btn-done-reminder');
        btnDone.addEventListener('click', () => {
          btnDone.textContent = 'Đã hoàn thành';
          btnDone.disabled = true;
          btnDone.style.background = 'var(--text-dim)';
        });
        reminderItemsContainer.appendChild(item);
      });
    }
    reminderListModal.style.display = 'flex';
  }

  // 6. Quick Replies
  function getQuickReplies() {
    const settings = getUserSettings();
    if (settings.quickReplies && settings.quickReplies.length > 0) {
      return settings.quickReplies;
    }
    return [
      'Dạ tôi đang bận xíu, sẽ trả lời bạn ngay!',
      'Ok bạn nha 👍',
      'Alo bạn ơi, có đó không?',
      'Đã nhận được thông tin, cảm ơn bạn nhiều!',
      'Gọi lại cho mình khi rảnh nhé!',
      'Mình đang trên đường đến rồi.'
    ];
  }

  function renderQuickReplyList() {
    quickReplyList.innerHTML = '';
    const list = getQuickReplies();
    list.forEach((txt, idx) => {
      const item = document.createElement('div');
      item.className = 'quick-reply-item';
      item.innerHTML = `
        <span class="quick-text">${escapeHTML(txt)}</span>
        <button type="button" class="btn-del-quick" title="Xóa">✕</button>
      `;
      item.querySelector('.quick-text').addEventListener('click', () => {
        messageInput.value = txt;
        adjustTextareaHeight(messageInput);
        quickReplyPopup.style.display = 'none';
        handleSendMessage();
      });
      item.querySelector('.btn-del-quick').addEventListener('click', (e) => {
        e.stopPropagation();
        const settings = getUserSettings();
        if (!settings.quickReplies || settings.quickReplies.length === 0) {
          settings.quickReplies = [...list];
        }
        settings.quickReplies.splice(idx, 1);
        saveUserSettings();
        renderQuickReplyList();
      });
      quickReplyList.appendChild(item);
    });
  }

  function toggleQuickReplyPopup() {
    if (quickReplyPopup.style.display === 'none' || !quickReplyPopup.style.display) {
      renderQuickReplyList();
      quickReplyPopup.style.display = 'flex';
    } else {
      quickReplyPopup.style.display = 'none';
    }
  }

  // 7. Share Contact Modal
  function openShareContactModal() {
    if (!currentUser || !currentTarget) return;
    shareContactList.innerHTML = '';
    const friendIds = currentUser.friends || [];
    const friends = allUsers.filter(u => friendIds.includes(u.id) && u.id !== currentUser.id);

    if (friends.length === 0) {
      shareContactList.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 16px;">Chưa có bạn bè trong danh bạ để gửi danh thiếp.</p>';
    } else {
      friends.forEach(f => {
        const row = document.createElement('div');
        row.className = 'search-user-card';
        row.innerHTML = `
          <div class="search-user-meta">
            <img src="${f.avatar}" alt="${escapeHTML(f.name)}">
            <div class="search-user-info">
              <span class="search-user-name">${escapeHTML(getDisplayName(f.id, f.name))}</span>
              <span class="search-user-phone">${escapeHTML(f.phone || '')}</span>
            </div>
          </div>
          <button class="btn-card-action chat-btn" data-friend-id="${f.id}">Gửi</button>
        `;
        row.querySelector('.chat-btn').addEventListener('click', () => {
          socket.emit('message:send', {
            targetId: currentTarget.id,
            isGroup: currentTarget.isGroup,
            text: `[Danh thiếp] ${f.name}`,
            messageType: 'contact_card',
            extraData: {
              id: f.id,
              name: f.name,
              avatar: f.avatar,
              phone: f.phone,
              tag: f.tag,
              bio: f.bio
            }
          });
          shareContactModal.style.display = 'none';
        });
        shareContactList.appendChild(row);
      });
    }
    shareContactModal.style.display = 'flex';
  }

  // 8. Media Gallery Modal
  let activeGalleryTab = 'photos';
  function openMediaGalleryModal() {
    if (!currentTarget) return;
    activeGalleryTab = 'photos';
    galleryTabs.forEach(t => t.classList.toggle('active', t.dataset.galleryTab === 'photos'));
    renderGalleryContent();
    mediaGalleryModal.style.display = 'flex';
  }

  function renderGalleryContent() {
    const photos = activeMessages.filter(m => m.imageUrl && !m.recalled);
    const files = activeMessages.filter(m => m.fileUrl && !m.recalled && !m.imageUrl);
    const links = [];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    activeMessages.forEach(m => {
      if (m.text && !m.recalled) {
        const matches = m.text.match(urlRegex);
        if (matches) {
          matches.forEach(url => links.push({ url, sender: m.senderName, time: m.timestamp }));
        }
      }
    });

    galleryPhotoCount.textContent = photos.length;
    galleryFileCount.textContent = files.length;
    galleryLinkCount.textContent = links.length;

    galleryContentArea.innerHTML = '';

    if (activeGalleryTab === 'photos') {
      if (photos.length === 0) {
        galleryContentArea.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 40px;">Chưa có hình ảnh nào được chia sẻ.</p>';
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'gallery-photo-grid';
      photos.forEach(p => {
        const item = document.createElement('div');
        item.className = 'gallery-photo-item';
        item.innerHTML = `<img src="${p.imageUrl}" alt="Media" loading="lazy">`;
        item.addEventListener('click', () => {
          lightboxImg.src = p.imageUrl;
          lightboxModal.style.display = 'flex';
        });
        grid.appendChild(item);
      });
      galleryContentArea.appendChild(grid);
    } else if (activeGalleryTab === 'files') {
      if (files.length === 0) {
        galleryContentArea.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 40px;">Chưa có tập tin nào được gửi.</p>';
        return;
      }
      const list = document.createElement('div');
      list.className = 'gallery-file-list';
      files.forEach(f => {
        const item = document.createElement('div');
        item.className = 'gallery-file-item';
        item.innerHTML = `
          <div class="gallery-file-left">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0068ff" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div>
              <div class="gallery-file-name">${escapeHTML(f.fileName || 'Tập tin')}</div>
              <div class="gallery-file-meta">${formatTimestamp(f.timestamp)} • ${escapeHTML(f.senderName)}</div>
            </div>
          </div>
          <a href="${f.fileUrl}" target="_blank" download class="gallery-file-download">Tải về</a>
        `;
        list.appendChild(item);
      });
      galleryContentArea.appendChild(list);
    } else if (activeGalleryTab === 'links') {
      if (links.length === 0) {
        galleryContentArea.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 40px;">Chưa có liên kết web nào được gửi.</p>';
        return;
      }
      const list = document.createElement('div');
      list.className = 'gallery-link-list';
      links.forEach(l => {
        const item = document.createElement('div');
        item.className = 'gallery-link-item';
        item.innerHTML = `
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="gallery-link-url">${escapeHTML(l.url)}</a>
          <div class="gallery-file-meta">${formatTimestamp(l.time)} • ${escapeHTML(l.sender)}</div>
        `;
        list.appendChild(item);
      });
      galleryContentArea.appendChild(list);
    }
  }

  // 9. Clear History
  function clearCurrentHistory() {
    if (!currentTarget) return;
    const name = currentTarget.name;
    if (confirm(`Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện với "${name}"? Thao tác này không thể hoàn tác.`)) {
      socket.emit('chat:clear_history', {
        targetId: currentTarget.id,
        isGroup: currentTarget.isGroup
      });
    }
  }

  // 10. Group Members & Add Member Modal
  function renderGroupMembers(room) {
    if (!groupMemberCount || !groupMembersList) return;
    const members = room.members || [];
    groupMemberCount.textContent = members.length;
    groupMembersList.innerHTML = '';

    members.forEach(mId => {
      const u = allUsers.find(x => x.id === mId) || (mId === currentUser.id ? currentUser : null);
      if (!u) return;
      const isCreator = room.creatorId === mId;
      const item = document.createElement('div');
      item.className = 'group-member-item';
      item.innerHTML = `
        <div class="group-member-left">
          <img src="${u.avatar}" alt="${escapeHTML(u.name)}" class="group-member-avatar">
          <span class="group-member-name">${escapeHTML(getDisplayName(u.id, u.name))}${u.id === currentUser.id ? ' (Bạn)' : ''}</span>
        </div>
        <span class="group-member-role">${isCreator ? 'Trưởng nhóm' : 'Thành viên'}</span>
      `;
      groupMembersList.appendChild(item);
    });
  }

  function openAddMemberModal() {
    if (!currentTarget || !currentTarget.isGroup) return;
    const room = allRooms.find(r => r.id === currentTarget.id);
    if (!room) return;
    addMemberList.innerHTML = '';
    const roomMembers = room.members || [];
    const friendIds = currentUser.friends || [];
    const nonMembers = allUsers.filter(u => friendIds.includes(u.id) && !roomMembers.includes(u.id));

    if (nonMembers.length === 0) {
      addMemberList.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 12px;">Tất cả bạn bè của bạn đã tham gia nhóm này rồi.</p>';
      btnConfirmAddMembers.style.display = 'none';
    } else {
      btnConfirmAddMembers.style.display = 'block';
      nonMembers.forEach(f => {
        const label = document.createElement('label');
        label.className = 'friend-checkbox-item';
        label.innerHTML = `
          <input type="checkbox" value="${f.id}">
          <img src="${f.avatar}" alt="${escapeHTML(f.name)}">
          <span class="friend-checkbox-name">${escapeHTML(getDisplayName(f.id, f.name))} (${escapeHTML(f.phone || f.tag)})</span>
        `;
        addMemberList.appendChild(label);
      });
    }
    addMemberModal.style.display = 'flex';
  }

  function leaveCurrentGroup() {
    if (!currentTarget || !currentTarget.isGroup) return;
    if (confirm(`Bạn có chắc chắn muốn rời nhóm trò chuyện "${currentTarget.name}"?`)) {
      socket.emit('room:leave', { roomId: currentTarget.id });
      currentTarget = null;
      activeMessages = [];
      messagesStream.innerHTML = '';
      renderSidebarContent();
    }
  }

  // Profile Modal Functions
  function openProfileModal() {
    if (!currentUser) return;
    profileModalAvatar.src = currentUser.avatar;
    profileInputName.value = currentUser.name || '';
    profileInputPhone.value = currentUser.phone || '';
    profileInputUsername.value = currentUser.username || '';
    profileInputBio.value = currentUser.bio || '';
    profileModal.style.display = 'flex';
  }

  function closeProfileModal() {
    profileModal.style.display = 'none';
  }

  // Voice Recording Functions (Zalo / Messenger Style)
  async function startVoiceRecording() {
    try {
      voiceMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceMediaRecorder = new MediaRecorder(voiceMediaStream);
      voiceAudioChunks = [];

      voiceMediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          voiceAudioChunks.push(e.data);
        }
      };

      voiceMediaRecorder.start();
      voiceRecordSeconds = 0;
      recordingTime.textContent = '00:00';
      voiceRecordingBar.style.display = 'flex';
      chatInputToolbar.style.display = 'none';

      clearInterval(voiceRecordTimer);
      voiceRecordTimer = setInterval(() => {
        voiceRecordSeconds++;
        const mins = Math.floor(voiceRecordSeconds / 60).toString().padStart(2, '0');
        const secs = (voiceRecordSeconds % 60).toString().padStart(2, '0');
        recordingTime.textContent = `${mins}:${secs}`;
      }, 1000);
    } catch (err) {
      alert('Không thể truy cập Microphone để ghi âm. Vui lòng cấp quyền Microphone trong trình duyệt!');
    }
  }

  function cancelVoiceRecording() {
    clearInterval(voiceRecordTimer);
    if (voiceMediaRecorder && voiceMediaRecorder.state !== 'inactive') {
      voiceMediaRecorder.stop();
    }
    if (voiceMediaStream) {
      voiceMediaStream.getTracks().forEach(t => t.stop());
      voiceMediaStream = null;
    }
    voiceAudioChunks = [];
    voiceRecordingBar.style.display = 'none';
    chatInputToolbar.style.display = 'flex';
  }

  async function sendVoiceRecording() {
    if (!voiceMediaRecorder || voiceMediaRecorder.state === 'inactive') return;
    clearInterval(voiceRecordTimer);

    voiceMediaRecorder.onstop = async () => {
      if (voiceMediaStream) {
        voiceMediaStream.getTracks().forEach(t => t.stop());
        voiceMediaStream = null;
      }

      if (voiceAudioChunks.length === 0) {
        cancelVoiceRecording();
        return;
      }

      const audioBlob = new Blob(voiceAudioChunks, { type: 'audio/webm' });
      voiceAudioChunks = [];
      voiceRecordingBar.style.display = 'none';
      chatInputToolbar.style.display = 'flex';

      const formData = new FormData();
      formData.append('file', audioBlob, `voice_${Date.now()}.webm`);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.url && socket && currentTarget) {
          socket.emit('message:send', {
            targetId: currentTarget.id,
            isGroup: currentTarget.isGroup,
            text: '',
            fileUrl: uploadData.url,
            fileName: 'audio_message.webm'
          });
        }
      } catch (err) {
        alert('Gửi tin nhắn thoại thất bại, vui lòng thử lại!');
      }
    };

    voiceMediaRecorder.stop();
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
        actionBtnHtml = `<button class="btn-card-action chat-btn" data-action="chat">Nhắn tin</button>`;
      } else {
        actionBtnHtml = `<button class="btn-card-action add-btn" data-action="add">Kết bạn</button>`;
      }

      card.innerHTML = `
        <div class="search-user-meta">
          <img src="${u.avatar}" alt="${u.name}">
          <div class="search-user-info">
            <span class="search-user-name">${escapeHTML(u.name)}</span>
            <span class="search-user-phone">${escapeHTML(u.phone || '')}</span>
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
            btnAction.textContent = 'Đang kết nối...';
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
    myPhoneTag.textContent = `${user.phone || ''} (${user.tag || ''})`;

    const windowTitleUser = document.getElementById('window-title-user');
    if (windowTitleUser) {
      windowTitleUser.textContent = user.name || user.username || 'Phantaanskieetj';
    }

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
        text: msg.recalled ? 'Tin nhắn đã được thu hồi' : (
          msg.messageType === 'reminder' ? `[Nhắc hẹn] ${msg.extraData?.title || msg.text || ''}` :
          msg.messageType === 'contact_card' ? `[Danh thiếp] ${msg.extraData?.name || ''}` :
          (msg.text || (msg.imageUrl ? '[Hình ảnh]' : (msg.fileUrl ? '[Tập tin]' : 'Tin nhắn mới')))
        ),
        timestamp: msg.timestamp
      };

      const isForCurrentChat = currentTarget && (
        (currentTarget.isGroup && msg.targetId === currentTarget.id) ||
        (!currentTarget.isGroup && (
          (currentTarget.isCloud && msg.senderId === currentUser.id && msg.targetId === currentUser.id) ||
          (!currentTarget.isCloud && (
            (msg.senderId === currentTarget.id && msg.targetId === currentUser.id) ||
            (msg.senderId === currentUser.id && msg.targetId === currentTarget.id)
          ))
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
        playNotificationDing(partnerId);
      }

      renderSidebarContent();
    });

    socket.on('user:settings_updated', ({ settings }) => {
      if (currentUser) currentUser.settings = settings;
      localStorage.setItem('zalochat_user', JSON.stringify(currentUser));
      renderSidebarContent();
      updatePinMuteButtonUI();
    });

    socket.on('chat:history_cleared', ({ targetId, isGroup }) => {
      const isCurrent = currentTarget && (
        (isGroup && currentTarget.id === targetId) ||
        (!isGroup && (currentTarget.id === targetId || (currentTarget.isCloud && targetId === currentUser.id)))
      );
      if (isCurrent) {
        activeMessages = [];
        renderMessages();
        renderSharedMedia();
      }
      delete lastMessageMap[targetId];
      renderSidebarContent();
    });

    socket.on('room:members_updated', ({ roomId, members }) => {
      const r = allRooms.find(x => x.id === roomId);
      if (r) {
        r.members = members;
        if (currentTarget && currentTarget.id === roomId) {
          renderGroupMembers(r);
        }
      }
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
      incomingCallType.textContent = isVideo ? 'Cuộc gọi video đến...' : 'Cuộc gọi thoại đến...';
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

  // Render Sidebar Content (Zalo Style with Cloud của tôi, Pinning, and Muting)
  function renderSidebarContent() {
    convListContainer.innerHTML = '';
    const query = convSearchInput.value.toLowerCase().trim();
    const settings = getUserSettings();

    // 1. MESSAGES TAB: Cloud của tôi + Pinned + Groups + Direct Chats
    if (currentSidebarTab === 'messages') {
      const convItems = [];

      // A. Cloud của tôi (Always available)
      const cloudQueryMatch = !query || 'cloud của tôi'.includes(query) || 'truyền file'.includes(query) || 'lưu trữ'.includes(query);
      if (cloudQueryMatch && currentUser) {
        const lastCloud = lastMessageMap[currentUser.id];
        convItems.push({
          id: currentUser.id,
          name: 'Cloud của tôi',
          rawName: 'Cloud của tôi',
          avatar: CLOUD_AVATAR,
          isGroup: false,
          isCloud: true,
          subtext: lastCloud ? lastCloud.text : 'Lưu trữ cá nhân an toàn',
          statusText: lastCloud ? formatTimestamp(lastCloud.timestamp) : '',
          timestamp: lastCloud ? lastCloud.timestamp : Date.now(),
          isOnline: true,
          phone: null,
          unread: unreadCounts[currentUser.id] || 0,
          isPinned: true, // Cloud is pinned by default
          isMuted: false
        });
      }

      // B. Rooms / Groups
      allRooms.forEach(room => {
        if (query && !room.name.toLowerCase().includes(query)) return;
        const last = lastMessageMap[room.id];
        const isPinned = settings.pinnedConversations.includes(room.id);
        const isMuted = settings.mutedConversations.includes(room.id);
        convItems.push({
          id: room.id,
          name: room.name,
          rawName: room.name,
          avatar: room.avatar,
          isGroup: true,
          isCloud: false,
          subtext: last ? last.text : 'Nhóm trò chuyện',
          statusText: last ? formatTimestamp(last.timestamp) : 'Nhóm',
          timestamp: last ? last.timestamp : (room.createdAt || 0),
          isOnline: true,
          phone: null,
          unread: unreadCounts[room.id] || 0,
          isPinned,
          isMuted,
          creatorId: room.creatorId,
          members: room.members,
          description: room.description
        });
      });

      // C. Direct Friends & Users with chats
      const friendIds = currentUser.friends || [];
      const relevantUserIds = new Set([
        ...friendIds,
        ...Object.keys(lastMessageMap)
      ]);

      const directUsers = allUsers.filter(u => relevantUserIds.has(u.id) && u.id !== currentUser.id);

      directUsers.forEach(u => {
        const dispName = getDisplayName(u.id, u.name);
        if (query && !dispName.toLowerCase().includes(query) && !u.name.toLowerCase().includes(query) && !(u.phone && u.phone.includes(query))) return;
        const isOnline = u.status === 'online';
        const last = lastMessageMap[u.id];
        const isPinned = settings.pinnedConversations.includes(u.id);
        const isMuted = settings.mutedConversations.includes(u.id);

        convItems.push({
          id: u.id,
          name: dispName,
          rawName: u.name,
          avatar: u.avatar,
          isGroup: false,
          isCloud: false,
          subtext: last ? last.text : (u.phone || 'Trò chuyện'),
          statusText: last ? formatTimestamp(last.timestamp) : (isOnline ? 'Online' : 'Vừa xong'),
          timestamp: last ? last.timestamp : 0,
          isOnline,
          phone: u.phone,
          unread: unreadCounts[u.id] || 0,
          isPinned,
          isMuted,
          bio: u.bio,
          tag: u.tag
        });
      });

      // Sort: Cloud first, then pinned items, then latest timestamp descending
      convItems.sort((a, b) => {
        if (a.isCloud) return -1;
        if (b.isCloud) return 1;
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.timestamp - a.timestamp;
      });

      if (convItems.length === 0) {
        convListContainer.innerHTML = `
          <div class="empty-contacts-state">
            <p>Không tìm thấy cuộc trò chuyện nào.</p>
            <button class="primary-btn" id="btn-add-friend-empty">Tìm bạn bằng số điện thoại</button>
          </div>
        `;
        const btnEmpty = document.getElementById('btn-add-friend-empty');
        if (btnEmpty) btnEmpty.addEventListener('click', () => btnOpenAddFriend.click());
        return;
      }

      convItems.forEach(item => {
        renderConversationItem(
          item.id,
          item.name,
          item.avatar,
          item.isGroup,
          item.subtext,
          item.statusText,
          item.isOnline,
          item.phone,
          item.unread,
          item.isPinned,
          item.isMuted,
          item.isCloud,
          item
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
            <button class="primary-btn" id="btn-add-friend-empty">Tìm bạn bằng số điện thoại</button>
          </div>
        `;
        const btnEmpty = document.getElementById('btn-add-friend-empty');
        if (btnEmpty) btnEmpty.addEventListener('click', () => btnOpenAddFriend.click());
        return;
      }

      convListContainer.innerHTML = `<div class="contacts-section-title">Bạn bè (${friends.length})</div>`;

      friends.forEach(u => {
        const dispName = getDisplayName(u.id, u.name);
        if (query && !dispName.toLowerCase().includes(query) && !u.name.toLowerCase().includes(query) && !(u.phone && u.phone.includes(query))) return;
        const isOnline = u.status === 'online';
        renderConversationItem(
          u.id,
          dispName,
          u.avatar,
          false,
          `${u.phone || ''}${u.tag ? ' • ' + u.tag : ''}`,
          isOnline ? 'Online' : 'Vừa xong',
          isOnline,
          u.phone,
          0,
          false,
          false,
          false,
          u
        );
      });
    }
  }

  function renderConversationItem(id, name, avatar, isGroup, subtext, statusText, isOnline = false, phone = null, unread = 0, isPinned = false, isMuted = false, isCloud = false, itemData = {}) {
    const item = document.createElement('div');
    const isActive = currentTarget && currentTarget.id === id;
    item.className = `conversation-item ${isActive ? 'active' : ''} ${unread > 0 ? 'has-unread' : ''} ${isPinned ? 'is-pinned' : ''}`;
    
    const pinBadgeHtml = isPinned ? `<span class="conv-pin-badge" title="Đã ghim">📌</span>` : '';
    const muteBadgeHtml = isMuted ? `<span class="conv-mute-badge" title="Đã tắt thông báo">🔕</span>` : '';

    item.innerHTML = `
      <div class="avatar-wrapper">
        <img src="${avatar}" alt="${escapeHTML(name)}" class="avatar">
        ${!isGroup && !isCloud ? `<span class="status-indicator ${isOnline ? 'online' : ''}"></span>` : ''}
      </div>
      <div class="conversation-meta">
        <div class="conv-top">
          <span class="conv-name">${escapeHTML(name)} ${muteBadgeHtml}</span>
          <span class="conv-time">${escapeHTML(statusText)} ${pinBadgeHtml}</span>
        </div>
        <div class="conv-bottom">
          <span class="conv-last-msg">${escapeHTML(subtext)}</span>
          ${unread > 0 ? `<span class="unread-badge">${unread}</span>` : ''}
        </div>
      </div>
    `;

    item.addEventListener('click', () => {
      unreadCounts[id] = 0;
      if (isCloud) {
        openCloudChat();
      } else {
        selectTarget({
          id,
          name,
          rawName: itemData.rawName || name,
          avatar,
          phone,
          isGroup,
          isCloud: false,
          creatorId: itemData.creatorId || null,
          status: isGroup ? 'Nhóm trò chuyện' : (isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'),
          bio: itemData.bio || itemData.description || subtext
        });
      }
      if (window.innerWidth <= 768) {
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

    if (window.innerWidth <= 768) {
      sidebarLeft.classList.add('hidden-mobile');
    }

    // Header
    chatTargetAvatar.src = target.avatar;
    chatTargetName.textContent = target.name;
    updateHeaderStatus(target.status === 'Đang hoạt động' || target.isGroup || target.isCloud);

    // Sidebar Right
    infoAvatar.src = target.avatar;
    infoName.textContent = target.name;
    infoPhone.textContent = target.phone ? `Số điện thoại: ${target.phone}` : '';
    infoBio.textContent = target.bio || '';
    infoChatType.textContent = target.isCloud ? 'Cloud cá nhân' : (target.isGroup ? 'Nhóm chung' : 'Trò chuyện 1-1');
    infoOnlineStatus.textContent = target.status;

    const infoSharedGroups = document.getElementById('info-shared-groups');
    if (infoSharedGroups) {
      infoSharedGroups.textContent = target.isGroup ? 'Thành viên nhóm' : (target.isCloud ? 'Lưu trữ cá nhân' : '41 nhóm chung');
    }

    // Controls visibility based on chat type (Cloud vs Group vs Direct)
    const zaloProfileActions = document.querySelector('.zalo-profile-actions');
    const rowSharedGroups = document.getElementById('row-shared-groups');

    if (target.isCloud) {
      btnAudioCall.style.display = 'none';
      btnVideoCall.style.display = 'none';
      btnEditContactName.style.display = 'none';
      if (zaloProfileActions) zaloProfileActions.style.display = 'none';
      if (groupMembersSection) groupMembersSection.style.display = 'none';
      if (rowSharedGroups) rowSharedGroups.style.display = 'none';

      btnDeleteGroup.style.display = 'none';
      btnLeaveGroup.style.display = 'none';
      btnUnfriend.style.display = 'none';
      btnClearHistory.style.display = 'block';

      messageInput.placeholder = 'Ghi chú, gửi file vào Cloud của tôi...';
    } else if (target.isGroup) {
      btnAudioCall.style.display = 'none';
      btnVideoCall.style.display = 'none';
      btnEditContactName.style.display = 'none';
      if (zaloProfileActions) zaloProfileActions.style.display = 'flex';
      if (rowSharedGroups) rowSharedGroups.style.display = 'flex';

      const btnCreateGroupWith = document.getElementById('btn-create-group-with');
      if (btnCreateGroupWith) btnCreateGroupWith.parentElement.style.display = 'none';

      // Group Members
      if (groupMembersSection) {
        groupMembersSection.style.display = 'block';
        const room = allRooms.find(r => r.id === target.id) || target;
        renderGroupMembers(room);
      }

      const isCreator = target.creatorId === currentUser.id;
      btnDeleteGroup.style.display = isCreator ? 'block' : 'none';
      btnLeaveGroup.style.display = 'block';
      btnUnfriend.style.display = 'none';
      btnClearHistory.style.display = 'block';

      messageInput.placeholder = `Nhập @, tin nhắn tới ${target.name}...`;
    } else {
      // 1-1 Direct Chat
      btnAudioCall.style.display = 'inline-flex';
      btnVideoCall.style.display = 'inline-flex';
      btnEditContactName.style.display = 'inline-flex';
      if (zaloProfileActions) zaloProfileActions.style.display = 'flex';
      if (rowSharedGroups) rowSharedGroups.style.display = 'flex';

      const btnCreateGroupWith = document.getElementById('btn-create-group-with');
      if (btnCreateGroupWith) btnCreateGroupWith.parentElement.style.display = 'flex';

      if (groupMembersSection) groupMembersSection.style.display = 'none';

      btnDeleteGroup.style.display = 'none';
      btnLeaveGroup.style.display = 'none';
      btnUnfriend.style.display = 'block';
      btnClearHistory.style.display = 'block';

      messageInput.placeholder = `Nhập @, tin nhắn tới ${target.name}...`;
    }

    updatePinMuteButtonUI();

    socket.emit('chat:get_history', {
      targetId: target.id,
      isGroup: target.isGroup
    });

    renderSidebarContent();
    messageInput.focus();
  }

  function updateHeaderStatus(isOnline) {
    if (currentTarget.isCloud) {
      chatTargetIndicator.className = 'status-indicator online';
      chatTargetSubtext.textContent = 'Lưu trữ đám mây cá nhân';
      chatTargetSubtext.className = 'target-status online';
    } else if (currentTarget.isGroup) {
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

    // If Cloud của tôi, show welcoming storage banner
    if (currentTarget && currentTarget.isCloud) {
      const banner = document.createElement('div');
      banner.className = 'cloud-welcome-banner';
      banner.innerHTML = `
        <div class="cloud-banner-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
        </div>
        <div class="cloud-banner-text">
          <h4>Cloud của tôi</h4>
          <p>Nơi lưu trữ an toàn văn bản, hình ảnh và tập tin cá nhân. Chỉ có bạn mới có thể truy cập nội dung này trên bất kỳ thiết bị nào.</p>
        </div>
      `;
      messagesStream.appendChild(banner);
    }

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

    // Rich Message Types (Reminder & Contact Card)
    let richContentHtml = '';
    if (!msg.recalled && msg.messageType === 'reminder' && msg.extraData) {
      const ed = msg.extraData;
      const timeStr = ed.time ? new Date(ed.time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Không rõ';
      richContentHtml = `
        <div class="reminder-card-bubble">
          <div class="reminder-card-header">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Nhắc Hẹn Zalo</span>
          </div>
          <div class="reminder-card-title">${escapeHTML(ed.title || msg.text || 'Nhắc hẹn')}</div>
          <div class="reminder-card-time">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${timeStr}</span>
          </div>
          <div class="reminder-card-footer">
            Tạo bởi ${escapeHTML(ed.creatorName || msg.senderName || 'Bạn')}
          </div>
        </div>
      `;
    } else if (!msg.recalled && msg.messageType === 'contact_card' && msg.extraData) {
      const cd = msg.extraData;
      richContentHtml = `
        <div class="contact-card-bubble">
          <div class="contact-card-top">
            <img src="${cd.avatar}" alt="${escapeHTML(cd.name)}" class="contact-card-avatar">
            <div class="contact-card-info">
              <span class="contact-card-name">${escapeHTML(cd.name)}</span>
              <span class="contact-card-phone">${escapeHTML(cd.phone || '')}</span>
              <span class="contact-card-tag">${escapeHTML(cd.tag || '')}</span>
            </div>
          </div>
          <button class="contact-card-btn" data-contact-id="${cd.id}">Nhắn tin</button>
        </div>
      `;
    }

    let mediaHtml = '';
    if (msg.imageUrl && !msg.recalled) {
      mediaHtml += `
        <img src="${msg.imageUrl}" alt="Đính kèm" class="message-image" loading="lazy">
      `;
    }
    if (msg.fileUrl && !msg.recalled) {
      const isAudio = msg.fileName === 'audio_message.webm' || /\.(webm|mp3|wav|ogg|m4a)$/i.test(msg.fileUrl);
      if (isAudio) {
        mediaHtml += `
          <div class="audio-message-bubble" data-audio-src="${msg.fileUrl}">
            <button type="button" class="audio-play-btn" title="Phát tin nhắn thoại">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            <div class="audio-meta">
              <div class="audio-progress-bar">
                <div class="audio-progress-fill"></div>
              </div>
              <span class="audio-duration">0:00</span>
            </div>
            <audio src="${msg.fileUrl}" preload="metadata" style="display: none;"></audio>
          </div>
        `;
      } else {
        mediaHtml += `
          <a href="${msg.fileUrl}" target="_blank" download class="file-attachment-bubble">
            <span class="file-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </span>
            <div class="file-info">
              <span class="file-name">${escapeHTML(msg.fileName || 'Tài liệu đính kèm')}</span>
              <span class="file-action">Nhấn để tải về</span>
            </div>
          </a>
        `;
      }
    }

    const timeFormatted = formatTimestamp(msg.timestamp);

    let actionButtonsHtml = `
      <button class="action-bar-btn" data-reaction="❤️" title="Yêu thích">❤️</button>
      <button class="action-bar-btn" data-reaction="👍" title="Thích">👍</button>
      <button class="action-bar-btn" data-reaction="😂" title="Haha">😂</button>
      <button class="action-bar-btn" data-reaction="😮" title="Wow">😮</button>
      <button class="action-bar-btn" data-reaction="😢" title="Buồn">😢</button>
      <button class="action-bar-btn" data-reaction="🔥" title="Tuyệt vời">🔥</button>
      <button class="action-bar-btn btn-pin-msg" title="Ghim tin nhắn">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17v5M9 2h6l-1 7h3l-5 8-5-8h3z"/></svg>
      </button>
      <button class="action-bar-btn btn-reply-msg" title="Trả lời">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
      </button>
    `;
    if (isOutgoing && !msg.recalled) {
      actionButtonsHtml += `
        <button class="action-bar-btn btn-recall-msg" title="Thu hồi tin nhắn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;
    }

    row.innerHTML = `
      ${!isOutgoing ? `<img src="${msg.senderAvatar}" alt="${escapeHTML(msg.senderName)}" class="msg-avatar" title="${escapeHTML(msg.senderName)}">` : ''}
      <div class="message-content-wrapper">
        ${!isOutgoing && msg.isGroup ? `<span class="sender-label">${escapeHTML(getDisplayName(msg.senderId, msg.senderName))}</span>` : ''}
        <div class="message-bubble ${msg.recalled ? 'recalled' : ''}">
          ${replyHtml}
          ${richContentHtml}
          ${msg.recalled ? '<i>Tin nhắn đã được thu hồi</i>' : (!richContentHtml && msg.text ? linkify(escapeHTML(msg.text)) : '')}
          ${mediaHtml}
        </div>
        <div class="message-meta">
          <span>${timeFormatted}</span>
          ${isOutgoing ? `<span class="check-icon" title="Đã gửi"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 6 9 17 4 12"/><polyline points="22 10 13 21 11 19"/></svg></span>` : ''}
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

    // Contact card click handler
    const contactBtn = row.querySelector('.contact-card-btn');
    if (contactBtn) {
      contactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const contactId = contactBtn.dataset.contactId;
        const targetUser = allUsers.find(u => u.id === contactId);
        if (targetUser) {
          selectTarget({
            id: targetUser.id,
            name: getDisplayName(targetUser.id, targetUser.name),
            rawName: targetUser.name,
            avatar: targetUser.avatar,
            phone: targetUser.phone,
            tag: targetUser.tag,
            isGroup: false,
            status: targetUser.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến',
            bio: targetUser.bio
          });
        }
      });
    }

    const imgEl = row.querySelector('.message-image');
    if (imgEl) {
      imgEl.addEventListener('click', () => {
        lightboxImg.src = msg.imageUrl;
        lightboxModal.style.display = 'flex';
      });
    }

    const audioContainer = row.querySelector('.audio-message-bubble');
    if (audioContainer) {
      const audioEl = audioContainer.querySelector('audio');
      const playBtn = audioContainer.querySelector('.audio-play-btn');
      const progressFill = audioContainer.querySelector('.audio-progress-fill');
      const durationSpan = audioContainer.querySelector('.audio-duration');
      const progressBar = audioContainer.querySelector('.audio-progress-bar');

      audioEl.addEventListener('loadedmetadata', () => {
        const d = Math.round(audioEl.duration);
        const mins = Math.floor(d / 60);
        const secs = (d % 60).toString().padStart(2, '0');
        durationSpan.textContent = `${mins}:${secs}`;
      });

      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const playSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        const pauseSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        if (audioEl.paused) {
          document.querySelectorAll('audio').forEach(a => {
            if (a !== audioEl) {
              a.pause();
              const p = a.parentElement.querySelector('.audio-play-btn');
              if (p) p.innerHTML = playSvg;
            }
          });
          audioEl.play();
          playBtn.innerHTML = pauseSvg;
        } else {
          audioEl.pause();
          playBtn.innerHTML = playSvg;
        }
      });

      audioEl.addEventListener('timeupdate', () => {
        if (!audioEl.duration) return;
        const pct = (audioEl.currentTime / audioEl.duration) * 100;
        progressFill.style.width = `${pct}%`;
        const curr = Math.round(audioEl.currentTime);
        const mins = Math.floor(curr / 60);
        const secs = (curr % 60).toString().padStart(2, '0');
        const total = Math.round(audioEl.duration);
        const tm = Math.floor(total / 60);
        const ts = (total % 60).toString().padStart(2, '0');
        durationSpan.textContent = `${mins}:${secs} / ${tm}:${ts}`;
      });

      audioEl.addEventListener('ended', () => {
        playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
        progressFill.style.width = '0%';
      });

      progressBar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressBar.getBoundingClientRect();
        const clickPos = (e.clientX - rect.left) / rect.width;
        if (audioEl.duration) {
          audioEl.currentTime = clickPos * audioEl.duration;
        }
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
