(function () {
  'use strict';

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'ui-popup-overlay';
    overlay.innerHTML =
      '<div class="ui-popup" role="dialog" aria-modal="true">' +
        '<div class="ui-popup-header">' +
          '<span class="ui-popup-icon"></span>' +
          '<h3 class="ui-popup-title"></h3>' +
          '<button type="button" class="ui-popup-close" aria-label="Fechar">&times;</button>' +
        '</div>' +
        '<div class="ui-popup-body"></div>' +
        '<div class="ui-popup-actions"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function makeButton(text, className, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ui-popup-btn ' + className;
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function showPopup(options) {
    const overlay = createOverlay();
    const root = overlay.querySelector('.ui-popup');
    const type = options.type || 'info';

    root.classList.add('ui-popup-' + type);
    overlay.querySelector('.ui-popup-icon').classList.add('icon-' + type);
    overlay.querySelector('.ui-popup-title').textContent = options.title || '';
    overlay.querySelector('.ui-popup-body').appendChild(options.body);

    let input = null;
    if (options.input) {
      const field = document.createElement('div');
      field.className = 'ui-popup-field';
      if (options.input.label) {
        const label = document.createElement('label');
        label.className = 'ui-popup-field-label';
        label.textContent = options.input.label;
        field.appendChild(label);
      }
      input = document.createElement('input');
      input.type = options.input.type || 'text';
      input.className = 'ui-popup-input';
      input.placeholder = options.input.placeholder || '';
      input.value = options.input.value || '';
      field.appendChild(input);
      overlay.querySelector('.ui-popup-body').appendChild(field);
    }

    const actions = overlay.querySelector('.ui-popup-actions');

    let settled = false;
    function close(value) {
      if (settled) return;
      settled = true;
      document.removeEventListener('keydown', onKeydown);
      overlay.remove();
      if (typeof options.onClose === 'function') options.onClose(value, input ? input.value : null);
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close(options.cancelValue);
    }

    document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('mousedown', function (e) {
      if (e.target === overlay) close(options.cancelValue);
    });
    overlay.querySelector('.ui-popup-close').addEventListener('click', function () {
      close(options.cancelValue);
    });

    requestAnimationFrame(function () {
      if (input) {
        input.focus();
      } else if (typeof options.focus === 'function') {
        options.focus();
      }
    });

    return { close: close, root: root, actions: actions, input: input };
  }

  window.uiAlert = function uiAlert(message, options) {
    if (typeof options === 'string') options = { title: options };
    options = options || {};
    return new Promise(function (resolve) {
      const body = document.createElement('div');
      const p = document.createElement('p');
      p.className = 'ui-popup-message';
      p.textContent = message;
      body.appendChild(p);

      let modal, okBtn;
      modal = showPopup({
        type: options.type || 'info',
        title: options.title || 'Aviso',
        body: body,
        cancelValue: undefined,
        focus: function () { if (okBtn) okBtn.focus(); },
        onClose: function () { resolve(); }
      });

      okBtn = makeButton('OK', 'btn-primary', function () { modal.close(); });
      modal.actions.appendChild(okBtn);
    });
  };

  window.uiConfirm = function uiConfirm(message, options) {
    options = options || {};
    return new Promise(function (resolve) {
      const body = document.createElement('div');
      const p = document.createElement('p');
      p.className = 'ui-popup-message';
      p.textContent = message;
      body.appendChild(p);

      let modal, confirmBtn;
      modal = showPopup({
        type: options.type || 'warning',
        title: options.title || 'Confirmar Ação',
        body: body,
        cancelValue: false,
        focus: function () { if (confirmBtn) confirmBtn.focus(); },
        onClose: function (value) { resolve(value === true); }
      });

      const cancelBtn = makeButton(options.cancelText || 'Cancelar', 'btn-cancel', function () {
        modal.close(false);
      });
      confirmBtn = makeButton(options.confirmText || 'Confirmar', options.danger ? 'btn-danger' : 'btn-primary', function () {
        modal.close(true);
      });
      modal.actions.appendChild(cancelBtn);
      modal.actions.appendChild(confirmBtn);
    });
  };

  window.uiPrompt = function uiPrompt(options) {
    options = options || {};
    return new Promise(function (resolve) {
      const body = document.createElement('div');
      if (options.message) {
        const p = document.createElement('p');
        p.className = 'ui-popup-message';
        p.textContent = options.message;
        body.appendChild(p);
      }

      let modal, okBtn;
      modal = showPopup({
        type: options.type || 'info',
        title: options.title || 'Informação Necessária',
        body: body,
        input: {
          label: options.label || '',
          placeholder: options.placeholder || '',
          value: options.value || ''
        },
        cancelValue: null,
        focus: function () { if (modal.input) modal.input.focus(); },
        onClose: function (value) { resolve(value); }
      });

      const cancelBtn = makeButton(options.cancelText || 'Cancelar', 'btn-cancel', function () {
        modal.close(null);
      });
      okBtn = makeButton(options.confirmText || 'OK', 'btn-primary', function () {
        const val = modal.input.value;
        if (options.required && !val.trim()) {
          modal.root.classList.remove('ui-popup-shake');
          void modal.root.offsetWidth;
          modal.root.classList.add('ui-popup-shake');
          modal.input.focus();
          return;
        }
        modal.close(val);
      });
      modal.actions.appendChild(cancelBtn);
      modal.actions.appendChild(okBtn);

      modal.input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') okBtn.click();
      });
    });
  };
})();
