function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showPopup(message, type) {
  type = type || 'info';
  const icons = { success: '&#10003;', error: '&#10007;', warning: '&#9888;', info: '&#8505;' };
  const icon = icons[type] || icons.info;

  const existing = document.querySelector('.popup-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  overlay.innerHTML =
    '<div class="popup-box ' + type + '">' +
      '<span class="popup-icon">' + icon + '</span>' +
      '<div class="popup-message">' + escapeHTML(message) + '</div>' +
      '<button class="popup-btn ok">OK</button>' +
    '</div>';

  document.body.appendChild(overlay);

  const btn = overlay.querySelector('.popup-btn');

  return new Promise(function(resolve) {
    function close() { overlay.remove(); resolve(true); }
    btn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
  });
}

function showConfirm(message) {
  const existing = document.querySelector('.popup-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  overlay.innerHTML =
    '<div class="popup-box warning">' +
      '<span class="popup-icon">&#9888;</span>' +
      '<div class="popup-message">' + escapeHTML(message) + '</div>' +
      '<div style="display:flex; gap: 12px; justify-content: center;">' +
        '<button class="popup-btn ok" id="popupConfirmSim" style="background:#4caf50;">Sim</button>' +
        '<button class="popup-btn ok" id="popupConfirmNao" style="background:#666;">Nao</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  return new Promise(function(resolve) {
    document.getElementById('popupConfirmSim').addEventListener('click', function() {
      overlay.remove();
      resolve(true);
    });
    document.getElementById('popupConfirmNao').addEventListener('click', function() {
      overlay.remove();
      resolve(false);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { overlay.remove(); resolve(false); }
    });
  });
}

function showPrompt(message) {
  const existing = document.querySelector('.popup-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';

  overlay.innerHTML =
    '<div class="popup-box warning">' +
      '<span class="popup-icon">&#9888;</span>' +
      '<div class="popup-message">' + escapeHTML(message) + '</div>' +
      '<input type="text" id="popupPromptInput" style="width:100%;box-sizing:border-box;background:var(--red-card);border:1px solid rgba(255,255,255,0.15);border-radius:8px;padding:10px 12px;color:var(--white);font-size:14px;margin-bottom:16px;">' +
      '<div style="display:flex; gap: 12px; justify-content: center;">' +
        '<button class="popup-btn ok" id="popupPromptOk" style="background:#4caf50;">OK</button>' +
        '<button class="popup-btn ok" id="popupPromptCancel" style="background:#666;">Cancelar</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  const input = document.getElementById('popupPromptInput');
  input.focus();

  return new Promise(function(resolve) {
    document.getElementById('popupPromptOk').addEventListener('click', function() {
      const val = input.value.trim();
      overlay.remove();
      resolve(val);
    });
    document.getElementById('popupPromptCancel').addEventListener('click', function() {
      overlay.remove();
      resolve(null);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { overlay.remove(); resolve(null); }
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        overlay.remove();
        resolve(val);
      }
      if (e.key === 'Escape') {
        overlay.remove();
        resolve(null);
      }
    });
  });
}