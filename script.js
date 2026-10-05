/* --------------------------------------------------
   Vishal's Portfolio - Interactive Logic & Live Editor
   -------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const editToggleBtn = document.getElementById('edit-mode-toggle');
  const editToggleLabel = document.getElementById('edit-toggle-label');
  const editControlBar = document.getElementById('edit-control-bar');
  const saveEditsBtn = document.getElementById('save-edits-btn');
  const resetEditsBtn = document.getElementById('reset-edits-btn');
  const downloadResumeBtn = document.getElementById('download-resume-btn');
  const topHireBtn = document.getElementById('top-hire-btn');
  const hireModal = document.getElementById('hire-modal');
  const modalClose = document.getElementById('modal-close');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const toast = document.getElementById('toast');
  const profileImg = document.getElementById('profile-img');
  const profileImgWrap = document.getElementById('profile-img-wrap');
  const photoEditOverlay = document.getElementById('photo-edit-overlay');
  const profilePhotoInput = document.getElementById('profile-photo-input');
  const uploadPhotoBtn = document.getElementById('upload-photo-btn');
  const urlPhotoBtn = document.getElementById('url-photo-btn');

  let isEditMode = false;
  const STORAGE_KEY = 'vishal_portfolio_edits_v1';
  const AVATAR_KEY = 'vishal_portfolio_avatar_v1';
  const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='100' r='96' fill='%231e293b' stroke='%233b82f6' stroke-width='6'/><circle cx='100' cy='80' r='38' fill='%23e2e8f0'/><path d='M42 165 C48 125, 75 115, 100 115 C125 115, 152 125, 158 165' fill='%233b82f6'/><path d='M72 74 Q100 55 128 74' stroke='%230f172a' stroke-width='4' stroke-linecap='round'/><circle cx='86' cy='82' r='4.5' fill='%230f172a'/><circle cx='114' cy='82' r='4.5' fill='%230f172a'/><path d='M92 98 Q100 106 108 98' stroke='%230f172a' stroke-width='3.5' stroke-linecap='round'/></svg>";

  // 1. Restore Saved Content from localStorage on Load
  function restoreSavedContent() {
    try {
      // Restore photo
      const savedAvatar = localStorage.getItem(AVATAR_KEY);
      if (savedAvatar && profileImg) {
        profileImg.src = savedAvatar;
      }

      // Restore text content
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      const editableElements = document.querySelectorAll('[data-editable]');
      editableElements.forEach(el => {
        const key = el.getAttribute('data-editable');
        if (data[key] !== undefined) {
          el.innerText = data[key];
        }
      });
      syncContactDetails();
    } catch (err) {
      console.error('Error loading saved content:', err);
    }
  }

  // 2. Save Content to localStorage
  function saveCurrentContent() {
    const data = {};
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach(el => {
      const key = el.getAttribute('data-editable');
      data[key] = el.innerText.trim();
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (profileImg && profileImg.src) {
        localStorage.setItem(AVATAR_KEY, profileImg.src);
      }
      syncContactDetails();
      showToast('Changes & photo saved successfully! 🎉');
    } catch (err) {
      console.error('Error saving content:', err);
      showToast('Failed to save changes.');
    }
  }

  // 3. Reset Content to Default
  function resetToDefault() {
    if (confirm('Are you sure you want to reset all edits to the original default information?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(AVATAR_KEY);
      showToast('Resetting to defaults...');
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  }

  // 4. Toggle Edit Mode
  function setEditMode(active) {
    isEditMode = active;
    const editableElements = document.querySelectorAll('[data-editable]');

    if (isEditMode) {
      document.body.classList.add('editing-active');
      editToggleBtn.classList.add('active');
      editToggleLabel.textContent = 'Edit Mode: ON';
      editControlBar.classList.remove('hidden');
      editableElements.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
      });
      showToast('Edit Mode Enabled! Click any text to customize.');
    } else {
      document.body.classList.remove('editing-active');
      editToggleBtn.classList.remove('active');
      editToggleLabel.textContent = 'Edit Mode: OFF';
      editControlBar.classList.add('hidden');
      editableElements.forEach(el => {
        el.removeAttribute('contenteditable');
      });
    }
  }

  editToggleBtn.addEventListener('click', () => {
    setEditMode(!isEditMode);
  });

  saveEditsBtn.addEventListener('click', () => {
    saveCurrentContent();
  });

  resetEditsBtn.addEventListener('click', () => {
    resetToDefault();
  });

  // 5. Sync Email, Phone, GitHub and LinkedIn edits with Links and Modal
  function syncContactDetails() {
    const emailEl = document.getElementById('contact-email-val');
    const phoneEl = document.getElementById('contact-phone-val');
    const emailLink = document.getElementById('contact-email-link');
    const phoneLink = document.getElementById('contact-phone-link');
    const modalEmailText = document.getElementById('modal-email-text');
    const modalPhoneText = document.getElementById('modal-phone-text');
    const githubEl = document.getElementById('github-url-val');
    const linkedinEl = document.getElementById('linkedin-url-val');
    const githubLink = document.getElementById('github-link');
    const linkedinLink = document.getElementById('linkedin-link');

    if (emailEl && emailLink && modalEmailText) {
      const email = emailEl.innerText.trim();
      emailLink.href = `mailto:${email}`;
      modalEmailText.innerText = email;
    }

    if (phoneEl && phoneLink && modalPhoneText) {
      const phone = phoneEl.innerText.trim();
      phoneLink.href = `tel:${phone.replace(/\s+/g, '')}`;
      modalPhoneText.innerText = phone;
    }

    if (githubEl && githubLink) {
      let gh = githubEl.innerText.trim();
      if (!gh.startsWith('http://') && !gh.startsWith('https://')) {
        gh = 'https://' + gh;
      }
      githubLink.href = gh;
    }

    if (linkedinEl && linkedinLink) {
      let li = linkedinEl.innerText.trim();
      if (!li.startsWith('http://') && !li.startsWith('https://')) {
        li = 'https://' + li;
      }
      linkedinLink.href = li;
    }
  }

  // Monitor live input on contact elements to sync links
  const contactEmailEl = document.getElementById('contact-email-val');
  const contactPhoneEl = document.getElementById('contact-phone-val');
  const contactGithubEl = document.getElementById('github-url-val');
  const contactLinkedinEl = document.getElementById('linkedin-url-val');
  if (contactEmailEl) {
    contactEmailEl.addEventListener('input', syncContactDetails);
  }
  if (contactPhoneEl) {
    contactPhoneEl.addEventListener('input', syncContactDetails);
  }
  if (contactGithubEl) {
    contactGithubEl.addEventListener('input', syncContactDetails);
  }
  if (contactLinkedinEl) {
    contactLinkedinEl.addEventListener('input', syncContactDetails);
  }

  // 6. Resume Download Logic (Print to PDF formatting)
  downloadResumeBtn.addEventListener('click', () => {
    // If in edit mode, turn it off temporarily before printing so outlines don't show
    const wasEditing = isEditMode;
    if (wasEditing) setEditMode(false);

    showToast('Opening print dialog. Select "Save as PDF" to download!');
    setTimeout(() => {
      window.print();
      if (wasEditing) setEditMode(true);
    }, 400);
  });

  // 7. "Hire Me" Modal Controls
  function openHireModal() {
    hireModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeHireModal() {
    hireModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  topHireBtn.addEventListener('click', openHireModal);
  modalClose.addEventListener('click', closeHireModal);

  hireModal.addEventListener('click', (e) => {
    if (e.target === hireModal) {
      closeHireModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !hireModal.classList.contains('hidden')) {
      closeHireModal();
    }
  });

  // 8. Mobile Navigation Toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 9. Profile Photo Upload and Editing
  function triggerPhotoUpload() {
    if (profilePhotoInput) profilePhotoInput.click();
  }

  if (photoEditOverlay) {
    photoEditOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerPhotoUpload();
    });
  }

  if (profileImgWrap) {
    profileImgWrap.addEventListener('click', () => {
      if (isEditMode) {
        triggerPhotoUpload();
      } else {
        showToast('Turn ON "Edit Mode" in the top navbar to change your photo.');
      }
    });
  }

  if (uploadPhotoBtn) {
    uploadPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerPhotoUpload();
    });
  }

  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, WEBP, etc.)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (profileImg) {
          profileImg.src = event.target.result;
          try {
            localStorage.setItem(AVATAR_KEY, event.target.result);
            showToast('Profile photo updated & saved! 📷✨');
          } catch (err) {
            console.warn('Image storage warning:', err);
            showToast('Photo displayed successfully! 📷');
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (urlPhotoBtn) {
    urlPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentUrl = profileImg && !profileImg.src.startsWith('data:') ? profileImg.src : '';
      const url = prompt('Enter the image URL for your profile picture:', currentUrl);
      if (url && url.trim()) {
        if (profileImg) {
          profileImg.src = url.trim();
          try {
            localStorage.setItem(AVATAR_KEY, url.trim());
            showToast('Profile photo URL updated & saved! 🔗✨');
          } catch (err) {
            console.error(err);
          }
        }
      }
    });
  }

  // 10. Creative Themes Engine
  const themeMenuBtn = document.getElementById('theme-menu-btn');
  const themeDropdownMenu = document.getElementById('theme-dropdown-menu');
  const activeThemeName = document.getElementById('active-theme-name');
  const themeChoiceBtns = document.querySelectorAll('.theme-choice-btn');
  const THEME_KEY = 'vishal_portfolio_theme_v1';

  const themeLabels = {
    'cyber-blue': 'Cyber Blue',
    'neon-violet': 'Neon Violet',
    'emerald-code': 'Emerald Code',
    'sunset-amber': 'Sunset Amber',
    'clean-light': 'Clean Light'
  };

  function applyTheme(themeName) {
    if (!themeLabels[themeName]) themeName = 'cyber-blue';
    document.documentElement.setAttribute('data-theme', themeName);
    if (activeThemeName) activeThemeName.textContent = themeLabels[themeName];

    themeChoiceBtns.forEach(btn => {
      if (btn.getAttribute('data-set-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    try {
      localStorage.setItem(THEME_KEY, themeName);
    } catch (err) {
      console.error(err);
    }
  }

  function restoreTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'cyber-blue';
    applyTheme(savedTheme);
  }

  if (themeMenuBtn && themeDropdownMenu) {
    themeMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdownMenu.classList.toggle('hidden');
      const isExpanded = !themeDropdownMenu.classList.contains('hidden');
      themeMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    themeChoiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedTheme = btn.getAttribute('data-set-theme');
        applyTheme(selectedTheme);
        themeDropdownMenu.classList.add('hidden');
        themeMenuBtn.setAttribute('aria-expanded', 'false');
        showToast(`Theme switched to ${themeLabels[selectedTheme]}! 🎨`);
      });
    });

    document.addEventListener('click', (e) => {
      if (!themeDropdownMenu.contains(e.target) && e.target !== themeMenuBtn) {
        themeDropdownMenu.classList.add('hidden');
        themeMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 11. Creative Decor Canvas Particle Network
  const decorCanvas = document.getElementById('decor-canvas');
  if (decorCanvas && decorCanvas.getContext) {
    const ctx = decorCanvas.getContext('2d');
    let particles = [];
    const particleCount = 38;

    function resizeCanvas() {
      decorCanvas.width = window.innerWidth;
      decorCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * decorCanvas.width;
        this.y = Math.random() * decorCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > decorCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > decorCanvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, decorCanvas.width, decorCanvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.15 - dist / 110 * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 12. Creative Contact Form Handler
  const contactForm = document.getElementById('portfolio-contact-form');
  const formMsg = document.getElementById('form-message');
  const charCounter = document.getElementById('char-counter');

  if (formMsg && charCounter) {
    formMsg.addEventListener('input', () => {
      charCounter.textContent = `${formMsg.value.length} / 500`;
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const topic = document.getElementById('form-topic').value;
      const message = formMsg.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required form fields.');
        return;
      }

      // Pre-fill email draft for Vishal
      const recipient = document.getElementById('contact-email-val') ? document.getElementById('contact-email-val').innerText.trim() : 'vishal@jecerc.ac.in';
      const subject = encodeURIComponent(`[Portfolio Inquiry: ${topic}] from ${name}`);
      const body = encodeURIComponent(`Hi Vishal,\n\n${message}\n\n---\nSender Name: ${name}\nSender Email: ${email}\nTopic: ${topic}`);

      showToast('Opening your email client to send message... 🚀');
      setTimeout(() => {
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';
      }, 500);
    });
  }

  // 13. Creative "Hire Me" Form Handler
  const hireForm = document.getElementById('hire-inquiry-form');
  const rolePills = document.querySelectorAll('.role-pill');
  let selectedRole = 'Internship';

  rolePills.forEach(pill => {
    pill.addEventListener('click', () => {
      rolePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedRole = pill.getAttribute('data-role');
    });
  });

  if (hireForm) {
    hireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const company = document.getElementById('hire-company').value.trim();
      const email = document.getElementById('hire-email').value.trim();
      const details = document.getElementById('hire-details').value.trim();

      if (!company || !email) {
        showToast('Please provide your name/organization and email.');
        return;
      }

      const recipient = document.getElementById('contact-email-val') ? document.getElementById('contact-email-val').innerText.trim() : 'vishal@jecerc.ac.in';
      const subject = encodeURIComponent(`[Hire Proposal - ${selectedRole}] from ${company}`);
      const body = encodeURIComponent(`Hi Vishal,\n\nI would like to discuss a ${selectedRole} opportunity with you.\n\nDetails: ${details || 'We would like to connect with you regarding an opportunity.'}\n\n---\nCompany/Name: ${company}\nContact Email: ${email}`);

      showToast('Hire inquiry created! Opening email client... 💼🚀');
      setTimeout(() => {
        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        closeHireModal();
        hireForm.reset();
      }, 500);
    });
  }

  // 14. Toast Notification Helper
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3500);
  }

  // Initial setup
  restoreTheme();
  restoreSavedContent();
});
