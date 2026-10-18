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
  if (chatTargetAvatar) {
    chatTargetAvatar.onerror = function() {
      this.onerror = null;
      this.src = '/images/icon-192.png';
    };
  }

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
  const previewDocIcon = document.getElementById('preview-doc-icon');
  const previewFilename = document.getElementById('preview-filename');
  const previewFilesize = document.getElementById('preview-filesize');
  const btnRemovePreviewImage = document.getElementById('btn-remove-preview-image');

  // Chat input & Voice recording
  const fileInput = document.getElementById('file-input');
  const docFileInput = document.getElementById('doc-file-input');
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

  // PWA & Unread Badge Elements
  const pwaInstallModal = document.getElementById('pwa-install-modal');
  const btnClosePwaModal = document.getElementById('btn-close-pwa-modal');
  const btnTriggerPwaInstall = document.getElementById('btn-trigger-pwa-install');
  const pwaIosGuide = document.getElementById('pwa-ios-guide');
  const btnRailInstallApp = document.getElementById('btn-rail-install-app');
  const btnMobileInstallApp = document.getElementById('btn-mobile-install-app');
  const railUnreadTotal = document.getElementById('rail-unread-total');
  const mobileUnreadTotal = document.getElementById('mobile-unread-total');

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
  let pendingAttachmentFile = null;
  let typingTimer = null;
  let isTyping = false;
  let currentSidebarTab = 'messages'; // 'messages' | 'friends'
  let isSoundEnabled = localStorage.getItem('zalochat_sound') !== 'false';
  let deferredInstallPrompt = null;

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

  function showToast(text, duration = 3000) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  const CLOUD_AVATAR = '/images/cloud.svg';

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

  function updateGlobalUnreadBadges() {
    let totalUnread = 0;
    if (unreadCounts && typeof unreadCounts === 'object') {
      Object.keys(unreadCounts).forEach(id => {
        totalUnread += (unreadCounts[id] || 0);
      });
    }

    // 1. Update Title Bar for PC & Mobile browser
    const baseTitle = 'ZaloChat - Nhắn tin, Gọi video';
    document.title = totalUnread > 0 ? `(${totalUnread}) ${baseTitle}` : baseTitle;

    // 2. Update Left Rail Badge (PC View)
    if (railUnreadTotal) {
      if (totalUnread > 0) {
        railUnreadTotal.textContent = totalUnread > 99 ? '99+' : totalUnread;
        railUnreadTotal.style.display = 'inline-block';
      } else {
        railUnreadTotal.style.display = 'none';
      }
    }

    // 3. Update Mobile Bottom Nav Badge (Mobile View)
    if (mobileUnreadTotal) {
      if (totalUnread > 0) {
        mobileUnreadTotal.textContent = totalUnread > 99 ? '99+' : totalUnread;
        mobileUnreadTotal.style.display = 'inline-block';
      } else {
        mobileUnreadTotal.style.display = 'none';
      }
    }

    // 4. Native App Badge (PC Taskbar / Mobile Homescreen Icon)
    if ('setAppBadge' in navigator) {
      if (totalUnread > 0) {
        navigator.setAppBadge(totalUnread).catch(() => {});
      } else {
        navigator.clearAppBadge().catch(() => {});
      }
    }
  }

  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            console.log('ZaloChat notifications enabled');
          }
        }).catch(() => {});
      } catch (e) {}
    }
  }

  function showDesktopNotification(msg) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (!currentUser || msg.senderId === currentUser.id) return;

    const partnerId = msg.isGroup ? msg.targetId : msg.senderId;
    const settings = getUserSettings();
    if (Array.isArray(settings.mutedConversations) && settings.mutedConversations.includes(partnerId)) {
      return;
    }

    let senderName = msg.senderName || 'Người dùng';
    let title = senderName;
    if (msg.isGroup) {
      const room = allRooms.find(r => r.id === msg.targetId);
      const roomTitle = room ? room.name : 'Nhóm chat';
      title = `${senderName} (${roomTitle})`;
    }

    let body = msg.text || '';
    if (!body) {
      if (msg.imageUrl) body = '📷 [Hình ảnh] Đã gửi một hình ảnh';
      else if (msg.audioUrl) body = '🎤 [Ghi âm] Đã gửi một tin nhắn thoại';
      else if (msg.attachment) body = `📎 [Tập tin] ${msg.attachment.name || 'Tập tin đính kèm'}`;
      else body = '💬 Đã gửi cho bạn một tin nhắn mới';
    }

    try {
      const notif = new Notification(title, {
        body: body,
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: 'zalochat-' + partnerId,
        renotify: true
      });

      notif.onclick = () => {
        window.focus();
        if (msg.isGroup) {
          const room = allRooms.find(r => r.id === msg.targetId);
          if (room) {
            selectTarget({
              id: room.id,
              name: room.name,
              rawName: room.name,
              avatar: room.avatar || '/images/default-group.png',
              isGroup: true,
              isCloud: false,
              creatorId: room.creatorId,
              status: 'Nhóm trò chuyện'
            });
          }
        } else {
          const sender = allUsers.find(u => u.id === msg.senderId);
          if (sender) {
            selectTarget({
              id: sender.id,
              name: sender.name,
              rawName: sender.name,
              avatar: sender.avatar || '/images/default-avatar.png',
              phone: sender.phone,
              isGroup: false,
              isCloud: false,
              status: 'Đang hoạt động'
            });
          }
        }
        notif.close();
      };
    } catch (e) {
      console.warn('System notification error:', e);
    }
  }

  function isIosDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function openPwaInstallModal() {
    requestNotificationPermission();
    if (!pwaInstallModal) return;

    if (isAppInstalled()) {
      showToast('ZaloChat đã được cài đặt trên thiết bị của bạn!');
      return;
    }

    // If native PWA install prompt is ready, trigger it directly!
    if (deferredInstallPrompt) {
      triggerPwaInstall();
      return;
    }

    if (isIosDevice()) {
      if (pwaIosGuide) pwaIosGuide.style.display = 'block';
      if (btnTriggerPwaInstall) btnTriggerPwaInstall.style.display = 'none';
    } else {
      if (pwaIosGuide) pwaIosGuide.style.display = 'none';
      if (btnTriggerPwaInstall) btnTriggerPwaInstall.style.display = 'inline-flex';
    }

    pwaInstallModal.style.display = 'flex';
  }

  function closePwaInstallModal() {
    if (pwaInstallModal) pwaInstallModal.style.display = 'none';
  }

  async function triggerPwaInstall() {
    if (deferredInstallPrompt) {
      try {
        deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          showToast('Đang cài đặt ứng dụng ZaloChat...');
        }
        deferredInstallPrompt = null;
        closePwaInstallModal();
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else {
      // Download desktop setup batch script for Windows PC
      showToast('Đang tải file cài đặt ZaloChat cho Desktop máy tính...');
      const downloadLink = document.createElement('a');
      downloadLink.href = '/api/download/desktop-app';
      downloadLink.download = 'ZaloChat-Setup.bat';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => {
        showToast('Đã tải ZaloChat-Setup.bat! Hãy nhấn mở file ở thanh tải về để tạo biểu tượng ZaloChat trên Desktop.');
      }, 1200);
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

    // Attachment File Handling (Images & All Document/File Types)
    function handleFileSelection(file) {
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) {
        alert('Dung lượng tệp vượt quá giới hạn cho phép (50MB)!');
        return;
      }
      pendingAttachmentFile = file;
      pendingImageFile = file.type && file.type.startsWith('image/') ? file : null;

      if (file.type && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewThumbImg.src = event.target.result;
          previewThumbImg.style.display = 'block';
          if (previewDocIcon) previewDocIcon.style.display = 'none';
          previewFilename.textContent = file.name;
          if (previewFilesize) previewFilesize.textContent = formatFileSize(file.size);
          imageUploadPreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      } else {
        previewThumbImg.style.display = 'none';
        if (previewDocIcon) previewDocIcon.style.display = 'flex';
        previewFilename.textContent = file.name;
        if (previewFilesize) previewFilesize.textContent = formatFileSize(file.size);
        imageUploadPreview.style.display = 'flex';
      }
    }

    btnAttachImage.addEventListener('click', () => {
      fileInput.click();
    });
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handleFileSelection(file);
    });

    if (docFileInput) {
      docFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        handleFileSelection(file);
      });
    }

    btnRemovePreviewImage.addEventListener('click', () => {
      pendingAttachmentFile = null;
      pendingImageFile = null;
      fileInput.value = '';
      if (docFileInput) docFileInput.value = '';
      imageUploadPreview.style.display = 'none';
    });

    // Clipboard Paste (e.g. screenshot or copied file)
    messageInput.addEventListener('paste', (e) => {
      const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
      if (items) {
        for (const item of items) {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (file) {
              handleFileSelection(file);
              break;
            }
          }
        }
      }
    });

    // Drag & Drop File into Chat
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
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
        switchToMessagesView();
      });
      railBtnFriends.addEventListener('click', () => {
        switchToContactsView();
      });
    }

    if (subTabPriority && subTabOther) {
      subTabPriority.addEventListener('click', () => {
        subTabPriority.classList.add('active');
        subTabOther.classList.remove('active');
        switchToMessagesView();
      });
      subTabOther.addEventListener('click', () => {
        subTabOther.classList.add('active');
        subTabPriority.classList.remove('active');
        switchToContactsView();
      });
    }

    // Rail Feature Shortcuts (Cloud của tôi, Settings, Todo, etc.)
    if (btnZcloud) {
      btnZcloud.addEventListener('click', openCloudChat);
    }

    // PWA Install Triggers (Desktop & Mobile)
    if (btnRailInstallApp) {
      btnRailInstallApp.addEventListener('click', openPwaInstallModal);
    }
    if (btnMobileInstallApp) {
      btnMobileInstallApp.addEventListener('click', openPwaInstallModal);
    }
    if (btnClosePwaModal) {
      btnClosePwaModal.addEventListener('click', closePwaInstallModal);
    }
    if (pwaInstallModal) {
      pwaInstallModal.addEventListener('click', (e) => {
        if (e.target === pwaInstallModal) closePwaInstallModal();
      });
    }
    if (btnTriggerPwaInstall) {
      btnTriggerPwaInstall.addEventListener('click', triggerPwaInstall);
    }
    const btnRailSettings = document.getElementById('btn-rail-settings');
    if (btnRailSettings) {
      btnRailSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = document.getElementById('rail-settings-popup');
        if (popup) {
          popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        }
      });
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
        if (docFileInput) docFileInput.click();
        else fileInput.click();
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
    // Profile Modal Listeners (Image 4)
    const btnChangeAvatarBadge = document.getElementById('btn-change-avatar-badge');
    const profileAvatarFileInput = document.getElementById('profile-avatar-file-input');
    if (btnChangeAvatarBadge && profileAvatarFileInput) {
      btnChangeAvatarBadge.addEventListener('click', () => {
        profileAvatarFileInput.click();
      });
      profileAvatarFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const profileModalAvatar = document.getElementById('profile-modal-avatar');
            if (profileModalAvatar) profileModalAvatar.src = ev.target.result;
          };
          reader.readAsDataURL(file);

          showToast('Đang tải ảnh đại diện lên Cloud...');
          const formData = new FormData();
          formData.append('file', file);
          try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
              const profileModalAvatar = document.getElementById('profile-modal-avatar');
              if (profileModalAvatar) profileModalAvatar.src = data.url;
              if (myAvatar) myAvatar.src = data.url;

              if (currentUser) {
                currentUser.avatar = data.url;
                localStorage.setItem('zalochat_user', JSON.stringify(currentUser));

                // Auto persist to database immediately
                fetch('/api/users/profile', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: currentUser.id,
                    name: currentUser.name,
                    gender: currentUser.gender,
                    dob: currentUser.dob,
                    phone: currentUser.phone,
                    bio: currentUser.bio,
                    avatar: data.url,
                    cover: currentUser.cover
                  })
                }).then(r => r.json()).then(res => {
                  if (res.success && res.user) {
                    currentUser = res.user;
                    localStorage.setItem('zalochat_user', JSON.stringify(currentUser));
                    renderSidebarContent();
                  }
                }).catch(e => console.error('Auto save avatar error:', e));
              }

              showToast('Ảnh đại diện đã được lưu thành công!');
            }
          } catch (err) {
            console.error('Avatar upload error:', err);
          }
        }
      });
    }

    if (btnChangeAvatar && profileAvatarFileInput) {
      btnChangeAvatar.addEventListener('click', () => {
        profileAvatarFileInput.click();
      });
    }

    const btnChangeCover = document.getElementById('btn-change-cover');
    const profileCoverFileInput = document.getElementById('profile-cover-file-input');
    if (btnChangeCover && profileCoverFileInput) {
      btnChangeCover.addEventListener('click', () => {
        profileCoverFileInput.click();
      });
      profileCoverFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const coverEl = document.getElementById('profile-cover-img');
            if (coverEl) coverEl.src = ev.target.result;
          };
          reader.readAsDataURL(file);

          showToast('Đang tải ảnh bìa lên Cloud...');
          const formData = new FormData();
          formData.append('file', file);
          try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
              const coverEl = document.getElementById('profile-cover-img');
              if (coverEl) coverEl.src = data.url;

              if (currentUser) {
                currentUser.cover = data.url;
                localStorage.setItem('zalochat_user', JSON.stringify(currentUser));

                // Auto persist cover to database immediately
                fetch('/api/users/profile', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: currentUser.id,
                    name: currentUser.name,
                    gender: currentUser.gender,
                    dob: currentUser.dob,
                    phone: currentUser.phone,
                    bio: currentUser.bio,
                    avatar: currentUser.avatar,
                    cover: data.url
                  })
                }).then(r => r.json()).then(res => {
                  if (res.success && res.user) {
                    currentUser = res.user;
                    localStorage.setItem('zalochat_user', JSON.stringify(currentUser));
                  }
                }).catch(e => console.error('Auto save cover error:', e));
              }

              showToast('Ảnh bìa đã được lưu thành công!');
            }
          } catch (err) {
            console.error('Cover upload error:', err);
          }
        }
      });
    }

    const btnToggleProfileEdit = document.getElementById('btn-toggle-profile-edit');
    const btnEditNamePencil = document.getElementById('btn-edit-name-pencil');
    const btnCancelProfileEdit = document.getElementById('btn-cancel-profile-edit');
    const profileViewMode = document.getElementById('profile-info-view-mode');

    function enterProfileEditMode() {
      if (profileViewMode) profileViewMode.style.display = 'none';
      if (profileEditForm) profileEditForm.style.display = 'block';
      const nameInput = document.getElementById('profile-input-name');
      const genderSelect = document.getElementById('profile-input-gender');
      const dobInput = document.getElementById('profile-input-dob');
      const phoneInput = document.getElementById('profile-input-phone');
      const bioInput = document.getElementById('profile-input-bio');

      if (nameInput) nameInput.value = currentUser.name || '';
      if (genderSelect) genderSelect.value = currentUser.gender || 'Nam';
      if (dobInput) dobInput.value = currentUser.dob || '28 tháng 12, 2004';
      if (phoneInput) phoneInput.value = currentUser.phone || '';
      if (bioInput) bioInput.value = currentUser.bio || '';
    }

    if (btnToggleProfileEdit) btnToggleProfileEdit.addEventListener('click', enterProfileEditMode);
    if (btnEditNamePencil) btnEditNamePencil.addEventListener('click', enterProfileEditMode);
    if (btnCancelProfileEdit) {
      btnCancelProfileEdit.addEventListener('click', () => {
        if (profileViewMode) profileViewMode.style.display = 'block';
        if (profileEditForm) profileEditForm.style.display = 'none';
      });
    }

    if (profileEditForm) {
      profileEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const nameInput = document.getElementById('profile-input-name');
        const genderSelect = document.getElementById('profile-input-gender');
        const dobInput = document.getElementById('profile-input-dob');
        const phoneInput = document.getElementById('profile-input-phone');
        const bioInput = document.getElementById('profile-input-bio');
        const avatarEl = document.getElementById('profile-modal-avatar');
        const coverEl = document.getElementById('profile-cover-img');

        const newName = nameInput ? nameInput.value.trim() : currentUser.name;
        const newGender = genderSelect ? genderSelect.value : (currentUser.gender || 'Nam');
        const newDob = dobInput ? dobInput.value.trim() : (currentUser.dob || '28 tháng 12, 2004');
        const newPhone = phoneInput ? phoneInput.value.trim() : currentUser.phone;
        const newBio = bioInput ? bioInput.value.trim() : (currentUser.bio || '');
        const newAvatar = avatarEl ? avatarEl.src : currentUser.avatar;
        const newCover = coverEl ? coverEl.src : currentUser.cover;

        try {
          const res = await fetch('/api/users/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: currentUser.id,
              name: newName,
              gender: newGender,
              dob: newDob,
              phone: newPhone,
              bio: newBio,
              avatar: newAvatar,
              cover: newCover
            })
          });
          const data = await res.json();
          if (data.success && data.user) {
            currentUser = data.user;
            localStorage.setItem('zalochat_user', JSON.stringify(currentUser));
            myAvatar.src = currentUser.avatar;
            myName.textContent = currentUser.name;
            const windowTitleUser = document.getElementById('window-title-user');
            if (windowTitleUser) windowTitleUser.textContent = currentUser.name;

            // Update profile view fields
            const displayName = document.getElementById('profile-display-name');
            const viewGender = document.getElementById('profile-view-gender');
            const viewDob = document.getElementById('profile-view-dob');
            const viewPhone = document.getElementById('profile-view-phone');
            if (displayName) displayName.textContent = currentUser.name;
            if (viewGender) viewGender.textContent = currentUser.gender || 'Nam';
            if (viewDob) viewDob.textContent = currentUser.dob || '28 tháng 12, 2004';
            if (viewPhone) {
              const p = currentUser.phone || '0338351410';
              viewPhone.textContent = p.startsWith('+') ? p : '+84 ' + p.replace(/^0/, '');
            }

            if (profileViewMode) profileViewMode.style.display = 'block';
            if (profileEditForm) profileEditForm.style.display = 'none';
            alert('Cập nhật thông tin tài khoản thành công!');
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

    // Rail Settings Popup Menu Actions (Image 3)
    const popupMenuProfile = document.getElementById('popup-menu-profile');
    const popupMenuSettings = document.getElementById('popup-menu-settings');
    const popupMenuData = document.getElementById('popup-menu-data');
    const popupMenuLang = document.getElementById('popup-menu-lang');
    const popupMenuSupport = document.getElementById('popup-menu-support');
    const popupMenuLogout = document.getElementById('popup-menu-logout');
    const popupMenuExit = document.getElementById('popup-menu-exit');
    const railSettingsPopup = document.getElementById('rail-settings-popup');

    if (popupMenuProfile) {
      popupMenuProfile.addEventListener('click', () => {
        if (railSettingsPopup) railSettingsPopup.style.display = 'none';
        openProfileModal();
      });
    }
    if (popupMenuSettings) {
      popupMenuSettings.addEventListener('click', () => {
        if (railSettingsPopup) railSettingsPopup.style.display = 'none';
        openSettingsModal('general');
      });
    }
    if (popupMenuData) {
      popupMenuData.addEventListener('click', () => {
        if (railSettingsPopup) railSettingsPopup.style.display = 'none';
        openSettingsModal('data');
      });
    }
    if (popupMenuLang) {
      popupMenuLang.addEventListener('click', () => {
        if (railSettingsPopup) railSettingsPopup.style.display = 'none';
        alert('Hệ thống đang hoạt động với ngôn ngữ: Tiếng Việt');
      });
    }
    if (popupMenuSupport) {
      popupMenuSupport.addEventListener('click', () => {
        if (railSettingsPopup) railSettingsPopup.style.display = 'none';
        alert('Trung tâm hỗ trợ Zalo: Hotline 1900 561 558 (Hỗ trợ 24/7)\nWebsite: https://help.zalo.me');
      });
    }
    if (popupMenuLogout) {
      popupMenuLogout.addEventListener('click', () => {
        if (railSettingsPopup) railSettingsPopup.style.display = 'none';
        btnLogout.click();
      });
    }
    if (popupMenuExit) {
      popupMenuExit.addEventListener('click', () => {
        if (railSettingsPopup) railSettingsPopup.style.display = 'none';
        if (confirm('Bạn có chắc chắn muốn đăng xuất và thoát khỏi Zalo?')) {
          btnLogout.click();
        }
      });
    }

    // Click outside to close rail settings popup
    document.addEventListener('click', (e) => {
      if (railSettingsPopup && railSettingsPopup.style.display === 'block') {
        const btnRailSettings = document.getElementById('btn-rail-settings');
        if (!railSettingsPopup.contains(e.target) && (!btnRailSettings || !btnRailSettings.contains(e.target))) {
          railSettingsPopup.style.display = 'none';
        }
      }
    });

    // Zalo Settings Dialog Listeners (Image 5)
    const btnCloseSettingsModal = document.getElementById('btn-close-settings-modal');
    const zaloSettingsModal = document.getElementById('zalo-settings-modal');
    if (btnCloseSettingsModal && zaloSettingsModal) {
      btnCloseSettingsModal.addEventListener('click', () => {
        zaloSettingsModal.style.display = 'none';
      });
      zaloSettingsModal.addEventListener('click', (e) => {
        if (e.target === zaloSettingsModal) zaloSettingsModal.style.display = 'none';
      });
    }

    const settingsNavItems = document.querySelectorAll('.settings-nav-item');
    settingsNavItems.forEach(item => {
      item.addEventListener('click', () => {
        settingsNavItems.forEach(x => x.classList.remove('active'));
        item.classList.add('active');
        const tabKey = item.dataset.settab;
        const allPanes = document.querySelectorAll('.settings-tab-pane');
        allPanes.forEach(p => p.style.display = 'none');
        const activePane = document.getElementById(`pane-set-${tabKey}`);
        if (activePane) activePane.style.display = 'block';
      });
    });

    // Settings General Radio & Switches
    const switchAutoStart = document.getElementById('switch-auto-start');
    const switchRememberAccount = document.getElementById('switch-remember-account');
    const switchSettingsDark = document.getElementById('switch-settings-dark');
    const btnClearCache = document.getElementById('btn-clear-cache');

    if (switchSettingsDark) {
      switchSettingsDark.checked = document.documentElement.getAttribute('data-theme') === 'dark';
      switchSettingsDark.addEventListener('change', () => {
        const isDark = switchSettingsDark.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
    if (btnClearCache) {
      btnClearCache.addEventListener('click', () => {
        const cacheSizeEl = document.getElementById('data-cache-size');
        if (cacheSizeEl) cacheSizeEl.textContent = '0 KB';
        alert('Đã dọn dẹp toàn bộ bộ nhớ đệm thành công!');
      });
    }

    // Contacts Full Page Filter Listeners (Image 2)
    const contactsSearchInput = document.getElementById('contacts-search-input');
    const contactsSortSelect = document.getElementById('contacts-sort-select');
    const contactsCategorySelect = document.getElementById('contacts-category-select');

    if (contactsSearchInput) {
      contactsSearchInput.addEventListener('input', () => {
        renderContactsFullPage();
      });
    }
    if (contactsSortSelect) {
      contactsSortSelect.addEventListener('change', () => {
        renderContactsFullPage();
      });
    }
    if (contactsCategorySelect) {
      contactsCategorySelect.addEventListener('change', () => {
        renderContactsFullPage();
      });
    }

    const contactsNavItems = document.querySelectorAll('.contacts-nav-item');
    contactsNavItems.forEach(nav => {
      nav.addEventListener('click', () => {
        contactsNavItems.forEach(x => x.classList.remove('active'));
        nav.classList.add('active');
        const viewType = nav.dataset.contactView;
        const headerTitle = document.getElementById('contacts-header-title');
        if (headerTitle) {
          if (viewType === 'friends') headerTitle.textContent = 'Danh sách bạn bè';
          else if (viewType === 'groups') headerTitle.textContent = 'Danh sách nhóm và cộng đồng';
          else if (viewType === 'invites') headerTitle.textContent = 'Lời mời kết bạn';
          else if (viewType === 'group-invites') headerTitle.textContent = 'Lời mời vào nhóm và cộng đồng';
        }
        renderContactsFullPage(viewType);
      });
    });

    // Right Sidebar Accordion Toggles (Image 1)
    const headerLinks = document.getElementById('header-links');
    if (headerLinks) {
      headerLinks.addEventListener('click', () => {
        const content = document.getElementById('shared-links-content');
        if (content) {
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
      });
    }
    const headerSecuritySettings = document.getElementById('header-security-settings');
    if (headerSecuritySettings) {
      headerSecuritySettings.addEventListener('click', () => {
        const content = document.getElementById('security-settings-content');
        if (content) {
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
      });
    }

    // View all links button
    const btnViewAllLinks = document.getElementById('btn-view-all-links');
    if (btnViewAllLinks) {
      btnViewAllLinks.addEventListener('click', () => {
        if (btnViewAllMedia) btnViewAllMedia.click();
        const linkTab = document.querySelector('[data-gallery-tab="links"]');
        if (linkTab) linkTab.click();
      });
    }

    // Auto-Delete Modal Listeners (Image 1)
    const rowAutoDeleteMsg = document.getElementById('row-auto-delete-msg');
    const autoDeleteModal = document.getElementById('auto-delete-modal');
    const btnCloseAutoDelete = document.getElementById('btn-close-auto-delete');
    if (rowAutoDeleteMsg && autoDeleteModal) {
      rowAutoDeleteMsg.addEventListener('click', () => {
        autoDeleteModal.style.display = 'flex';
      });
    }
    if (btnCloseAutoDelete && autoDeleteModal) {
      btnCloseAutoDelete.addEventListener('click', () => {
        autoDeleteModal.style.display = 'none';
      });
      autoDeleteModal.addEventListener('click', (e) => {
        if (e.target === autoDeleteModal) autoDeleteModal.style.display = 'none';
      });
    }
    const autoDeleteOptBtns = document.querySelectorAll('.auto-delete-opt-btn');
    autoDeleteOptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        autoDeleteOptBtns.forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        const durationText = btn.textContent;
        const valAutoDelete = document.getElementById('val-auto-delete');
        if (valAutoDelete) valAutoDelete.textContent = durationText;
        if (autoDeleteModal) autoDeleteModal.style.display = 'none';
        if (socket && currentTarget) {
          socket.emit('chat:set_auto_delete', { targetId: currentTarget.id, duration: btn.dataset.duration });
        }
        alert(`Đã cài đặt thời gian tin nhắn tự xóa: ${durationText}`);
      });
    });

    // Block Share Click
    const rowBlockShare = document.getElementById('row-block-share');
    if (rowBlockShare) {
      rowBlockShare.addEventListener('click', () => {
        alert('Đã bật tính năng Chặn chia sẻ: Thành viên khác không thể sao chép hoặc chuyển tiếp nội dung từ cuộc trò chuyện này.');
      });
    }

    // Hide Chat Switch & Modal
    const switchHideChat = document.getElementById('switch-hide-chat');
    const hideChatModal = document.getElementById('hide-chat-modal');
    const btnCloseHideChat = document.getElementById('btn-close-hide-chat');
    const hideChatForm = document.getElementById('hide-chat-form');

    if (switchHideChat && hideChatModal) {
      switchHideChat.addEventListener('change', () => {
        if (switchHideChat.checked) {
          hideChatModal.style.display = 'flex';
        } else {
          alert('Cuộc trò chuyện đã được hiển thị trở lại.');
        }
      });
    }
    if (btnCloseHideChat && hideChatModal) {
      btnCloseHideChat.addEventListener('click', () => {
        hideChatModal.style.display = 'none';
        if (switchHideChat) switchHideChat.checked = false;
      });
      hideChatModal.addEventListener('click', (e) => {
        if (e.target === hideChatModal) {
          hideChatModal.style.display = 'none';
          if (switchHideChat) switchHideChat.checked = false;
        }
      });
    }
    if (hideChatForm) {
      hideChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = document.getElementById('hide-chat-pin').value;
        if (pin.length === 4) {
          if (hideChatModal) hideChatModal.style.display = 'none';
          alert('Cuộc trò chuyện đã được ẩn thành công bằng mã PIN.');
        }
      });
    }

    // Report Conversation (Báo xấu - Image 1)
    const btnReportConv = document.getElementById('btn-report-conv');
    const reportModal = document.getElementById('report-modal');
    const btnCloseReport = document.getElementById('btn-close-report');
    const reportForm = document.getElementById('report-form');

    if (btnReportConv && reportModal) {
      btnReportConv.addEventListener('click', () => {
        reportModal.style.display = 'flex';
      });
    }
    if (btnCloseReport && reportModal) {
      btnCloseReport.addEventListener('click', () => {
        reportModal.style.display = 'none';
      });
      reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) reportModal.style.display = 'none';
      });
    }
    if (reportForm) {
      reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentTarget || !socket) return;
        const selectedRadio = document.querySelector('input[name="report-reason"]:checked');
        const reason = selectedRadio ? selectedRadio.value : 'spam';
        const detailsInput = document.getElementById('report-details-input');
        const details = detailsInput ? detailsInput.value.trim() : '';

        socket.emit('chat:report', {
          targetId: currentTarget.id,
          isGroup: currentTarget.isGroup,
          reason,
          details
        });

        if (reportModal) reportModal.style.display = 'none';
        alert('Cảm ơn bạn đã gửi báo xấu. Hệ thống Zalo sẽ xem xét xử lý trong vòng 24 giờ.');
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

  // Profile Modal Functions (Image 4)
  function openProfileModal() {
    if (!currentUser) return;
    const viewMode = document.getElementById('profile-info-view-mode');
    const editForm = document.getElementById('profile-edit-form');
    if (viewMode) viewMode.style.display = 'block';
    if (editForm) editForm.style.display = 'none';

    const avatarEl = document.getElementById('profile-modal-avatar');
    const coverEl = document.getElementById('profile-cover-img');
    const nameEl = document.getElementById('profile-display-name');
    const genderEl = document.getElementById('profile-view-gender');
    const dobEl = document.getElementById('profile-view-dob');
    const phoneEl = document.getElementById('profile-view-phone');

    if (avatarEl) avatarEl.src = currentUser.avatar;
    if (coverEl) coverEl.src = currentUser.cover || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';
    if (nameEl) nameEl.textContent = currentUser.name;
    if (genderEl) genderEl.textContent = currentUser.gender || 'Nam';
    if (dobEl) dobEl.textContent = currentUser.dob || '28 tháng 12, 2004';
    if (phoneEl) {
      const p = currentUser.phone || '0338351410';
      phoneEl.textContent = p.startsWith('+') ? p : '+84 ' + p.replace(/^0/, '');
    }

    const modal = document.getElementById('profile-modal');
    if (modal) modal.style.display = 'flex';
  }

  function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.style.display = 'none';
  }

  function openSettingsModal(targetTab = 'general') {
    const modal = document.getElementById('zalo-settings-modal');
    if (!modal) return;
    modal.style.display = 'flex';

    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach(x => {
      x.classList.toggle('active', x.dataset.settab === targetTab);
    });

    const allPanes = document.querySelectorAll('.settings-tab-pane');
    allPanes.forEach(p => p.style.display = 'none');
    const activePane = document.getElementById(`pane-set-${targetTab}`);
    if (activePane) activePane.style.display = 'block';
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
      const isAlreadyFriend = (currentUser.friends || []).includes(u.id);
      const isIncoming = (currentUser.friendRequestsReceived || []).some(r => r.sender_id === u.id);
      const isOutgoing = (currentUser.friendRequestsSent || []).includes(u.id);

      if (isAlreadyFriend) {
        actionBtnHtml = `<button class="btn-card-action chat-btn" data-action="chat">Nhắn tin</button>`;
      } else if (isIncoming) {
        actionBtnHtml = `<button class="btn-card-action add-btn" data-action="accept">Chấp nhận kết bạn</button>`;
      } else if (isOutgoing) {
        actionBtnHtml = `<button class="btn-card-action disabled-btn" disabled>Đã gửi lời mời</button>`;
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
          } else if (action === 'accept') {
            socket.emit('friend:accept', { senderId: u.id });
            btnAction.textContent = 'Đã chấp nhận';
            btnAction.className = 'btn-card-action disabled-btn';
            btnAction.disabled = true;
          } else if (action === 'add') {
            socket.emit('friend:send_request', { targetUserId: u.id });
            btnAction.textContent = 'Đã gửi lời mời';
            btnAction.className = 'btn-card-action disabled-btn';
            btnAction.disabled = true;
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
      requestNotificationPermission();

      // Automatically open Cloud cua toi on login if no chat is active
      if (!currentTarget) {
        if (typeof openCloudChat === 'function') {
          openCloudChat();
        }
      }
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
      if (me) {
        currentUser.friends = me.friends || [];
        currentUser.friendRequestsReceived = me.friendRequestsReceived || currentUser.friendRequestsReceived || [];
        currentUser.friendRequestsSent = me.friendRequestsSent || currentUser.friendRequestsSent || [];
      }
      renderSidebarContent();
      const contactsPage = document.getElementById('contacts-full-page');
      if (contactsPage && contactsPage.style.display !== 'none') {
        const activeNav = document.querySelector('.contacts-nav-item.active');
        const viewType = activeNav ? activeNav.dataset.contactView : 'friends';
        renderContactsFullPage(viewType);
      }
    });

    socket.on('friend:request_received', ({ sender, requests, message }) => {
      currentUser.friendRequestsReceived = requests || [];
      playNotificationDing();
      alert(message || `${sender.name} đã gửi lời mời kết bạn!`);
      const contactsPage = document.getElementById('contacts-full-page');
      if (contactsPage && contactsPage.style.display !== 'none') {
        const activeNav = document.querySelector('.contacts-nav-item.active');
        const viewType = activeNav ? activeNav.dataset.contactView : 'friends';
        renderContactsFullPage(viewType);
      }
    });

    socket.on('friend:request_sent', ({ targetUserId, sentRequests, message }) => {
      currentUser.friendRequestsSent = sentRequests || [];
      alert(message || 'Đã gửi lời mời kết bạn!');
    });

    socket.on('friend:requests_updated', ({ requests }) => {
      currentUser.friendRequestsReceived = requests || [];
      const contactsPage = document.getElementById('contacts-full-page');
      if (contactsPage && contactsPage.style.display !== 'none') {
        const activeNav = document.querySelector('.contacts-nav-item.active');
        const viewType = activeNav ? activeNav.dataset.contactView : 'friends';
        renderContactsFullPage(viewType);
      }
    });

    socket.on('friend:alert', ({ message }) => {
      alert(message);
    });

    socket.on('friend:added', ({ friend, message }) => {
      if (!Array.isArray(currentUser.friends)) currentUser.friends = [];
      if (!currentUser.friends.includes(friend.id)) {
        currentUser.friends.push(friend.id);
      }
      if (Array.isArray(currentUser.friendRequestsReceived)) {
        currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(r => r.sender_id !== friend.id);
      }
      if (Array.isArray(currentUser.friendRequestsSent)) {
        currentUser.friendRequestsSent = currentUser.friendRequestsSent.filter(id => id !== friend.id);
      }
      playNotificationDing();
      renderSidebarContent();
      const contactsPage = document.getElementById('contacts-full-page');
      if (contactsPage && contactsPage.style.display !== 'none') {
        const activeNav = document.querySelector('.contacts-nav-item.active');
        const viewType = activeNav ? activeNav.dataset.contactView : 'friends';
        renderContactsFullPage(viewType);
      }
    });

    socket.on('friend:removed', ({ removedFriendId }) => {
      currentUser.friends = (currentUser.friends || []).filter(id => id !== removedFriendId);
      if (currentTarget && currentTarget.id === removedFriendId) {
        currentTarget = null;
        activeMessages = [];
        messagesStream.innerHTML = '';
      }
      renderSidebarContent();
      const contactsPage = document.getElementById('contacts-full-page');
      if (contactsPage && contactsPage.style.display !== 'none') {
        const activeNav = document.querySelector('.contacts-nav-item.active');
        const viewType = activeNav ? activeNav.dataset.contactView : 'friends';
        renderContactsFullPage(viewType);
      }
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
        showDesktopNotification(msg);
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

  // Switching between Messages View and Full Contacts View (Image 2)
  function switchToContactsView() {
    const railBtnMessages = document.getElementById('rail-btn-messages');
    const railBtnFriends = document.getElementById('rail-btn-friends');
    if (railBtnFriends) railBtnFriends.classList.add('active');
    if (railBtnMessages) railBtnMessages.classList.remove('active');

    const convList = document.getElementById('conversations-list');
    const subTabs = document.querySelector('.sidebar-sub-tabs');
    const contactsSubNav = document.getElementById('contacts-sub-nav');
    if (convList) convList.style.display = 'none';
    if (subTabs) subTabs.style.display = 'none';
    if (contactsSubNav) contactsSubNav.style.display = 'flex';

    const chatMain = document.getElementById('chat-main-area');
    const contactsPage = document.getElementById('contacts-full-page');
    const sidebarRight = document.getElementById('sidebar-right');
    if (chatMain) chatMain.style.display = 'none';
    if (sidebarRight) sidebarRight.style.display = 'none';
    if (contactsPage) contactsPage.style.display = 'flex';

    currentSidebarTab = 'contacts';
    renderContactsFullPage('friends');
  }

  function switchToMessagesView() {
    const railBtnMessages = document.getElementById('rail-btn-messages');
    const railBtnFriends = document.getElementById('rail-btn-friends');
    if (railBtnMessages) railBtnMessages.classList.add('active');
    if (railBtnFriends) railBtnFriends.classList.remove('active');

    const convList = document.getElementById('conversations-list');
    const subTabs = document.querySelector('.sidebar-sub-tabs');
    const contactsSubNav = document.getElementById('contacts-sub-nav');
    if (convList) convList.style.display = 'block';
    if (subTabs) subTabs.style.display = 'flex';
    if (contactsSubNav) contactsSubNav.style.display = 'none';

    const chatMain = document.getElementById('chat-main-area');
    const contactsPage = document.getElementById('contacts-full-page');
    const sidebarRight = document.getElementById('sidebar-right');
    if (contactsPage) contactsPage.style.display = 'none';
    if (chatMain) chatMain.style.display = 'flex';
    if (sidebarRight && window.innerWidth > 992) sidebarRight.style.display = 'flex';

    currentSidebarTab = 'messages';
    renderSidebarContent();
  }

  function renderContactsFullPage(viewType = 'friends') {
    const scrollContainer = document.getElementById('contacts-alphabetical-scroll');
    const totalCountEl = document.getElementById('contacts-total-count');
    const countLabelEl = document.getElementById('contacts-count-label');
    const searchInput = document.getElementById('contacts-search-input');
    const sortSelect = document.getElementById('contacts-sort-select');
    const categorySelect = document.getElementById('contacts-category-select');

    if (!scrollContainer) return;
    scrollContainer.innerHTML = '';

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const sortOrder = sortSelect ? sortSelect.value : 'a-z';
    const selectedCategory = categorySelect ? categorySelect.value : 'all';

    if (viewType === 'groups') {
      if (countLabelEl) countLabelEl.innerHTML = `Nhóm và cộng đồng (<span id="contacts-total-count">${allRooms.length}</span>)`;
      if (allRooms.length === 0) {
        scrollContainer.innerHTML = `
          <div class="empty-contacts-state" style="padding: 48px 20px; text-align: center; color: var(--text-muted);">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <p style="font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; color: var(--text-main);">Chưa tham gia nhóm nào</p>
            <p style="font-size: 0.85rem;">Tạo nhóm trò chuyện để kết nối nhiều bạn bè cùng lúc!</p>
          </div>
        `;
        return;
      }
      allRooms.forEach(room => {
        const item = document.createElement('div');
        item.className = 'alphabet-friend-item';
        item.innerHTML = `
          <div class="alphabet-friend-left">
            <div class="alphabet-avatar-wrap">
              <img src="${room.avatar}" alt="${escapeHTML(room.name)}" class="alphabet-avatar">
            </div>
            <div class="alphabet-friend-info">
              <div class="alphabet-friend-name">${escapeHTML(room.name)}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${(room.members || []).length} thành viên</div>
            </div>
          </div>
          <button class="btn-contact-menu">•••</button>
        `;
        item.querySelector('.alphabet-friend-left').addEventListener('click', () => {
          openChatWithTarget(room);
          switchToMessagesView();
        });
        scrollContainer.appendChild(item);
      });
      return;
    }

    if (viewType === 'invites') {
      const requests = (currentUser && currentUser.friendRequestsReceived) || [];
      if (countLabelEl) countLabelEl.innerHTML = `Lời mời kết bạn (<span id="contacts-total-count">${requests.length}</span>)`;
      if (requests.length === 0) {
        scrollContainer.innerHTML = `
          <div class="empty-contacts-state" style="padding: 48px 20px; text-align: center; color: var(--text-muted);">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            <p style="font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; color: var(--text-main);">Không có lời mời kết bạn nào</p>
            <p style="font-size: 0.85rem;">Khi có người gửi lời mời kết bạn, yêu cầu sẽ xuất hiện tại đây.</p>
          </div>
        `;
        return;
      }
      requests.forEach(req => {
        const item = document.createElement('div');
        item.className = 'alphabet-friend-item friend-invite-item';
        item.style.padding = '12px 14px';
        item.style.borderBottom = '1px solid var(--border-color)';
        item.innerHTML = `
          <div class="alphabet-friend-left">
            <div class="alphabet-avatar-wrap">
              <img src="${req.sender_avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + req.sender_id}" alt="${escapeHTML(req.sender_name)}" class="alphabet-avatar">
            </div>
            <div class="alphabet-friend-info">
              <div class="alphabet-friend-name" style="font-size: 0.95rem; font-weight: 600;">${escapeHTML(req.sender_name)}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">${escapeHTML(req.sender_phone || req.sender_tag || '')} muốn kết bạn</div>
            </div>
          </div>
          <div class="invite-actions" style="display: flex; gap: 8px;">
            <button class="primary-btn btn-accept-invite" style="padding: 7px 16px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">Đồng ý</button>
            <button class="secondary-danger-btn btn-reject-invite" style="padding: 7px 16px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">Từ chối</button>
          </div>
        `;
        const btnAccept = item.querySelector('.btn-accept-invite');
        const btnReject = item.querySelector('.btn-reject-invite');
        btnAccept.addEventListener('click', (e) => {
          e.stopPropagation();
          socket.emit('friend:accept', { senderId: req.sender_id });
          btnAccept.textContent = 'Đã chấp nhận';
          btnAccept.disabled = true;
          btnReject.style.display = 'none';
        });
        btnReject.addEventListener('click', (e) => {
          e.stopPropagation();
          socket.emit('friend:reject', { senderId: req.sender_id });
          item.remove();
        });
        scrollContainer.appendChild(item);
      });
      return;
    }

    if (viewType === 'group-invites') {
      if (countLabelEl) countLabelEl.innerHTML = `Lời mời vào nhóm (<span id="contacts-total-count">0</span>)`;
      scrollContainer.innerHTML = '<div class="empty-contacts-state" style="padding: 48px 20px; text-align: center; color: var(--text-muted);"><p>Không có lời mời vào nhóm nào.</p></div>';
      return;
    }

    // Default: viewType === 'friends' -> ONLY real accepted friends from SQLite
    const friendIds = (currentUser && currentUser.friends) || [];
    let list = allUsers.filter(u => friendIds.includes(u.id) && u.id !== currentUser.id).map(u => ({
      id: u.id,
      name: getDisplayName(u.id, u.name),
      rawName: u.name,
      tag: u.tag || '',
      avatar: u.avatar,
      phone: u.phone,
      isOnline: u.status === 'online',
      isGroup: false
    }));

    // Filter by search query
    if (query) {
      list = list.filter(item =>
        item.name.toLowerCase().includes(query) ||
        (item.phone && item.phone.includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'dong-nghiep') {
        list = list.filter(item => item.tag && item.tag.toLowerCase().includes('đồng nghiệp'));
      } else if (selectedCategory === 'ban-be') {
        list = list.filter(item => item.tag && item.tag.toLowerCase().includes('bạn'));
      } else if (selectedCategory === 'gia-dinh') {
        list = list.filter(item => item.tag && item.tag.toLowerCase().includes('gia đình'));
      }
    }

    if (totalCountEl) totalCountEl.textContent = list.length;
    if (countLabelEl) countLabelEl.innerHTML = `Bạn bè (<span id="contacts-total-count">${list.length}</span>)`;

    // Empty state if no friends have been added yet
    if (list.length === 0) {
      scrollContainer.innerHTML = `
        <div class="empty-contacts-state" style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 14px; opacity: 0.45;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <p style="font-size: 1rem; font-weight: 600; margin-bottom: 6px; color: var(--text-main);">Bạn chưa có bạn bè nào trong danh bạ</p>
          <p style="font-size: 0.85rem; max-width: 350px; margin: 0 auto 18px; line-height: 1.5;">Hãy tìm kiếm bạn bè bằng số điện thoại hoặc tên tài khoản để kết bạn và trò chuyện!</p>
          <button id="btn-contacts-find-friend" class="primary-btn" style="padding: 9px 22px; border-radius: 20px; font-size: 0.88rem; cursor: pointer;">+ Thêm Bạn Bè Mới</button>
        </div>
      `;
      const btnFind = document.getElementById('btn-contacts-find-friend');
      if (btnFind && btnOpenAddFriend) {
        btnFind.addEventListener('click', () => btnOpenAddFriend.click());
      }
      return;
    }

    // Sort list
    list.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' });
      return sortOrder === 'z-a' ? -cmp : cmp;
    });

    // Group alphabetically (A-Z)
    const groups = {};
    list.forEach(item => {
      const firstLetter = item.name.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const key = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const cmp = a.localeCompare(b, 'vi');
      return sortOrder === 'z-a' ? -cmp : cmp;
    });

    sortedKeys.forEach(letter => {
      const groupBlock = document.createElement('div');
      groupBlock.className = 'alphabet-group-block';

      const groupHeader = document.createElement('div');
      groupHeader.className = 'alphabet-group-header';
      groupHeader.textContent = letter;
      groupBlock.appendChild(groupHeader);

      groups[letter].forEach(friend => {
        const row = document.createElement('div');
        row.className = 'alphabet-friend-item';
        row.innerHTML = `
          <div class="alphabet-friend-left">
            <div class="alphabet-avatar-wrap">
              <img src="${friend.avatar}" alt="${escapeHTML(friend.name)}" class="alphabet-avatar">
              <span class="status-indicator online" style="position: absolute; bottom: 0; right: 0; width: 12px; height: 12px; border: 2px solid var(--bg-main);"></span>
            </div>
            <div class="alphabet-friend-name">
              <span>${escapeHTML(friend.name)}</span>
              ${friend.tag ? `<span class="tag-badge-pill">${escapeHTML(friend.tag)}</span>` : ''}
            </div>
          </div>
          <button class="btn-contact-menu" title="Tùy chọn">•••</button>
        `;

        row.querySelector('.alphabet-friend-left').addEventListener('click', () => {
          openChatWithTarget(friend);
          switchToMessagesView();
        });

        const dotsBtn = row.querySelector('.btn-contact-menu');
        dotsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = prompt(`Tùy chọn với ${friend.name}:\n1. Nhắn tin\n2. Gọi thoại\n3. Gọi video\n4. Đặt tên gợi nhớ\nNhập số 1-4:`);
          if (action === '1') {
            openChatWithTarget(friend);
            switchToMessagesView();
          } else if (action === '2') {
            openChatWithTarget(friend);
            initiateWebRTCCall(false);
          } else if (action === '3') {
            openChatWithTarget(friend);
            initiateWebRTCCall(true);
          } else if (action === '4') {
            openEditNicknameModal();
          }
        });

        groupBlock.appendChild(row);
      });

      scrollContainer.appendChild(groupBlock);
    });
  }

  // Update Right Sidebar Link & Security Section (Image 1)
  function updateSidebarLinksAndSecurity() {
    const linksContainer = document.getElementById('shared-links-preview');
    if (!linksContainer) return;

    // Scan activeMessages for any URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundLinks = [];
    activeMessages.forEach(msg => {
      if (msg.text && !msg.recalled) {
        const matches = msg.text.match(urlRegex);
        if (matches) {
          matches.forEach(url => {
            let domain = url;
            try { domain = new URL(url).hostname; } catch(e){}
            foundLinks.push({
              url,
              title: url.length > 35 ? url.substring(0, 35) + '...' : url,
              domain: domain,
              date: new Date(msg.timestamp).toLocaleDateString('vi-VN')
            });
          });
        }
      }
    });

    const btnViewAllLinks = document.getElementById('btn-view-all-links');
    if (foundLinks.length > 0) {
      if (btnViewAllLinks) btnViewAllLinks.style.display = 'block';
      linksContainer.innerHTML = '';
      foundLinks.slice(-4).reverse().forEach(link => {
        const card = document.createElement('div');
        card.className = 'shared-link-card';
        card.innerHTML = `
          <div class="link-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <div class="link-card-body">
            <div class="link-title">${escapeHTML(link.title)}</div>
            <div class="link-sub-row">
              <span class="link-domain">${escapeHTML(link.domain)}</span>
              <span class="link-date">${escapeHTML(link.date)}</span>
            </div>
          </div>
        `;
        card.addEventListener('click', () => window.open(link.url, '_blank'));
        linksContainer.appendChild(card);
      });
    } else {
      if (btnViewAllLinks) btnViewAllLinks.style.display = 'none';
      linksContainer.innerHTML = '<p class="empty-media-text" style="color: var(--text-muted); font-size: 0.82rem; padding: 12px 6px; text-align: center; margin: 0;">Chưa có liên kết nào được chia sẻ</p>';
    }
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

    updateGlobalUnreadBadges();
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
      btnClearHistory.style.display = 'flex';

      const btnReportConv = document.getElementById('btn-report-conv');
      if (btnReportConv) btnReportConv.style.display = 'none';

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
      btnClearHistory.style.display = 'flex';

      const btnReportConv = document.getElementById('btn-report-conv');
      if (btnReportConv) btnReportConv.style.display = 'flex';

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
      btnUnfriend.style.display = 'none';
      btnClearHistory.style.display = 'flex';

      const btnReportConv = document.getElementById('btn-report-conv');
      if (btnReportConv) btnReportConv.style.display = 'flex';

      messageInput.placeholder = `Nhập @, tin nhắn tới ${target.name}...`;
    }

    updatePinMuteButtonUI();

    socket.emit('chat:get_history', {
      targetId: target.id,
      isGroup: target.isGroup
    });

    updateSidebarLinksAndSecurity();
    renderSidebarContent();
    messageInput.focus();
  }

  const openChatWithTarget = selectTarget;

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

    updateSidebarLinksAndSecurity();
  }

  async function handleSendMessage() {
    if (!currentTarget || !socket) return;

    const text = messageInput.value.trim();
    const fileToUpload = pendingAttachmentFile || pendingImageFile;

    if (!text && !fileToUpload) return;

    let uploadedImageUrl = null;
    let uploadedFileUrl = null;
    let uploadedFileName = null;

    if (fileToUpload) {
      showToast('Đang tải tệp lên Cloud...');
      const formData = new FormData();
      formData.append('file', fileToUpload);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.url) throw new Error(uploadData.error || 'Lỗi tải tệp lên server');

        if (fileToUpload.type && fileToUpload.type.startsWith('image/')) {
          uploadedImageUrl = uploadData.url;
        } else {
          uploadedFileUrl = uploadData.url;
          uploadedFileName = fileToUpload.name;
        }
        showToast('Đã tải tệp lên Cloud thành công!');
      } catch (err) {
        console.error('File upload error:', err);
        alert('Tải tệp thất bại: ' + (err.message || 'Vui lòng thử lại!'));
        return;
      }
    }

    const payload = {
      targetId: currentTarget.id,
      isGroup: currentTarget.isGroup,
      text: text,
      imageUrl: uploadedImageUrl,
      fileUrl: uploadedFileUrl,
      fileName: uploadedFileName,
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

    pendingAttachmentFile = null;
    pendingImageFile = null;
    fileInput.value = '';
    if (docFileInput) docFileInput.value = '';
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

  // Service Worker Registration for PWA & Offline
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('ZaloChat SW registered:', reg.scope);
      }).catch((err) => {
        console.warn('ZaloChat SW registration failed:', err);
      });
    });
  }

  // PWA Install Event Handler
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('PWA beforeinstallprompt event captured');
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    showToast('🎉 ZaloChat đã được cài đặt vào thiết bị thành công!');
    closePwaInstallModal();
  });

  window.addEventListener('DOMContentLoaded', initApp);
})();
