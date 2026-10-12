/* KFL reference kit — behavior
   Plain script, no dependencies; load with `defer`. Every behavior binds to
   semantic markup (roles, aria-*, data-* hooks), never to one page's ids, so a
   single implementation serves every consumer (KFL Law 2). Pages keep working
   without it except for widgets that cannot exist without script: menus, tabs,
   toasts, sorting. Feedback reports real outcomes only (KFL Interaction). */
(() => {
  'use strict';
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* Announcements — one polite live region, created before it is needed. */
  let announcer;
  function announce(text) {
    announcer.textContent = '';
    setTimeout(() => { announcer.textContent = text; }, 60); // repeated text is announced again
  }

  /* Theme: system / light / dark. A per-viewer convenience, so browser storage
     is fine; the page renders correctly when storage is unavailable. */
  const THEME_KEY = 'kfl-theme';
  function applyTheme(value) {
    if (value === 'light' || value === 'dark') document.documentElement.dataset.theme = value;
    else delete document.documentElement.dataset.theme;
  }
  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch { /* storage blocked */ }
    applyTheme(stored);
    // Every copy of the control (top bar, mobile panel) shows the same choice.
    const groups = $$('[data-theme-control]');
    const show = (value) => {
      for (const group of groups) {
        const input = group.querySelector(`input[value="${value}"]`);
        if (input) input.checked = true;
      }
    };
    show(stored ?? 'system');
    for (const group of groups) {
      group.addEventListener('change', (e) => {
        applyTheme(e.target.value);
        show(e.target.value);
        try {
          if (e.target.value === 'system') localStorage.removeItem(THEME_KEY);
          else localStorage.setItem(THEME_KEY, e.target.value);
        } catch { /* storage blocked */ }
      });
    }
  }

  /* Grid overlay: a toggle button with aria-pressed shows the page columns. */
  function initGridToggle() {
    for (const button of $$('[data-grid-toggle]')) {
      button.addEventListener('click', () => {
        const on = !document.body.classList.contains('grid-debug');
        document.body.classList.toggle('grid-debug', on);
        for (const b of $$('[data-grid-toggle]')) b.setAttribute('aria-pressed', String(on));
      });
    }
  }

  /* Disclosure buttons: <button data-toggle aria-expanded aria-controls>. */
  function initToggles(root) {
    for (const button of $$('button[data-toggle][aria-controls]', root)) {
      const target = document.getElementById(button.getAttribute('aria-controls'));
      if (!target) continue;
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        target.hidden = !open;
      });
    }
  }

  /* Tabs — automatic activation with a roving tabindex (WAI-ARIA APG). */
  function initTabs(root) {
    for (const list of $$('[role="tablist"]', root)) {
      const tabs = $$('[role="tab"]', list);
      const select = (tab) => {
        for (const t of tabs) {
          const on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          const panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        }
        tab.focus();
      };
      list.addEventListener('click', (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (tab && list.contains(tab)) select(tab);
      });
      list.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        const vertical = list.getAttribute('aria-orientation') === 'vertical';
        const rtl = getComputedStyle(list).direction === 'rtl';
        const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
        const back = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
        const target = e.key === forward ? tabs[(i + 1) % tabs.length]
          : e.key === back ? tabs[(i - 1 + tabs.length) % tabs.length]
          : e.key === 'Home' ? tabs[0]
          : e.key === 'End' ? tabs[tabs.length - 1] : null;
        if (target) { e.preventDefault(); select(target); }
      });
    }
  }

  /* Menu button (WAI-ARIA APG): opens on click, Enter, Space or arrows; arrows,
     Home/End and type-ahead move focus; Escape closes and returns focus to the
     button; Tab or a click outside closes without stealing focus. */
  const openMenus = new Set();
  function initMenus(root) {
    for (const button of $$('[aria-haspopup="menu"][aria-controls]', root)) {
      const menu = document.getElementById(button.getAttribute('aria-controls'));
      if (!menu) continue;
      const items = () => $$('[role^="menuitem"]:not([aria-disabled="true"])', menu);
      const close = (restoreFocus) => {
        if (menu.hidden) return;
        menu.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        openMenus.delete(close);
        if (restoreFocus) button.focus();
      };
      const open = (index) => {
        for (const other of [...openMenus]) other(false);
        menu.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        placeMenu(button, menu);
        openMenus.add(close);
        const list = items();
        (index < 0 ? list[list.length - 1] : list[index])?.focus();
      };
      button.addEventListener('click', () => (menu.hidden ? open(0) : close(true)));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); open(0); }
        if (e.key === 'ArrowUp') { e.preventDefault(); open(-1); }
      });
      menu.addEventListener('keydown', (e) => {
        const list = items();
        const i = list.indexOf(document.activeElement);
        const go = (n) => { e.preventDefault(); list[(n + list.length) % list.length]?.focus(); };
        if (e.key === 'ArrowDown') go(i + 1);
        else if (e.key === 'ArrowUp') go(i - 1);
        else if (e.key === 'Home') go(0);
        else if (e.key === 'End') go(list.length - 1);
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
        else if (e.key === 'Tab') close(false);
        else if (e.key.length === 1 && /\S/.test(e.key)) {
          const rest = [...list.slice(i + 1), ...list.slice(0, i + 1)];
          rest.find((item) => item.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()))?.focus();
        }
      });
      menu.addEventListener('click', (e) => {
        if (e.target.closest('[role^="menuitem"]:not([aria-disabled="true"])')) close(true);
      });
      document.addEventListener('pointerdown', (e) => {
        if (!menu.hidden && !menu.contains(e.target) && !button.contains(e.target)) close(false);
      });
    }
  }
  function placeMenu(button, menu) {
    // Keep the trigger relationship: flip above when there is no room below,
    // and align to the trigger's end edge when the start edge would overflow.
    menu.removeAttribute('data-placement');
    if (menu.dataset.alignAuto !== undefined) menu.removeAttribute('data-align');
    const trigger = button.getBoundingClientRect();
    const below = innerHeight - trigger.bottom;
    if (menu.offsetHeight + 8 > below && trigger.top > below) menu.dataset.placement = 'top';
    if (menu.getBoundingClientRect().right > document.documentElement.clientWidth - 8) {
      menu.dataset.align = 'end';
      menu.dataset.alignAuto = '';
    }
  }

  /* Dialogs: [data-dialog-open="id"] opens a native modal dialog. Buttons in a
     <form method="dialog"> close it with their value. Only dialogs marked
     data-light-dismiss close on a backdrop click — never one holding input. */
  function initDialogs(root) {
    for (const opener of $$('[data-dialog-open]', root)) {
      opener.addEventListener('click', () => document.getElementById(opener.dataset.dialogOpen)?.showModal());
    }
    for (const dialog of $$('dialog[data-light-dismiss]', root)) {
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close('dismiss'); });
    }
  }

  /* Toasts: KFL.toast(message, { action, onAction }). Actions give 8 s, plain
     messages 5 s; hover or focus pauses the clock. Anything a toast offers must
     also be reachable elsewhere on the page. */
  let toaster;
  function toast(message, { action, onAction, duration } = {}) {
    const origin = document.activeElement;
    const el = document.createElement('div');
    el.className = 'kfl-toast';
    const text = document.createElement('p');
    text.className = 'kfl-toast__message';
    text.textContent = message;
    el.append(text);
    if (action) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'kfl-button kfl-toast__action';
      b.textContent = action;
      b.addEventListener('click', () => { onAction?.(); dismiss(); });
      el.append(b);
    }
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'kfl-button';
    close.dataset.iconOnly = '';
    close.setAttribute('aria-label', 'Dismiss');
    close.innerHTML = '<span class="kfl-icon" data-icon="close" aria-hidden="true"></span>';
    close.addEventListener('click', dismiss);
    el.append(close);
    toaster.append(el);

    let remaining = duration ?? (action ? 8000 : 5000);
    let started = 0;
    let timer = 0;
    const run = () => { started = Date.now(); timer = setTimeout(dismiss, remaining); };
    const pause = () => { clearTimeout(timer); remaining -= Date.now() - started; };
    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', run);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', (e) => { if (!el.contains(e.relatedTarget)) run(); });
    run();

    function dismiss() {
      clearTimeout(timer);
      if (el.hidden) return;
      const hadFocus = el.contains(document.activeElement);
      el.hidden = true; // the exit transition runs; removal waits for it
      const remove = () => el.remove();
      el.addEventListener('transitionend', remove, { once: true });
      setTimeout(remove, 600); // zero-duration paths still clean up (KFL Law 3)
      if (hadFocus && origin?.isConnected) origin.focus();
    }
    return { dismiss };
  }

  /* Tooltips: Escape hides the one in view until the pointer or focus leaves;
     a click on the tooltip itself (part of its trigger's box) does nothing. */
  function initTooltips() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      for (const el of $$('[data-tooltip]:hover, [data-tooltip]:focus-visible')) el.setAttribute('data-tooltip-dismissed', '');
    });
    const reset = (el) => el?.removeAttribute('data-tooltip-dismissed');
    document.addEventListener('pointerout', (e) => {
      const el = e.target.closest?.('[data-tooltip]');
      if (el && !el.contains(e.relatedTarget)) reset(el);
    });
    document.addEventListener('focusout', (e) => reset(e.target.closest?.('[data-tooltip]')));
    document.addEventListener('click', (e) => {
      const el = e.target.closest?.('[data-tooltip]');
      if (!el || e.detail === 0) return; // keyboard activation has no coordinates
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
  }

  /* Sliders: keep the filled track and the paired <output> in step. */
  function initSliders(root) {
    for (const slider of $$('input[type="range"].kfl-slider', root)) {
      const output = slider.id ? document.querySelector(`output[for~="${slider.id}"]`) : null;
      const sync = () => {
        const min = Number(slider.min || 0);
        const max = Number(slider.max || 100);
        slider.style.setProperty('--_pct', `${((slider.value - min) / (max - min)) * 100}%`);
        if (output) output.value = slider.value + (slider.dataset.unit ?? '');
      };
      slider.addEventListener('input', sync);
      sync();
    }
  }

  /* Select all: <input data-select-all="name"> governs inputs with
     data-select-group="name"; it turns indeterminate for a partial selection
     and reports the count through a kfl:selection event. */
  function initSelectAll(root) {
    for (const all of $$('input[data-select-all]', root)) {
      const name = all.dataset.selectAll;
      const members = () => $$(`input[data-select-group="${name}"]`);
      const sync = () => {
        const group = members();
        const count = group.filter((i) => i.checked).length;
        all.checked = count > 0 && count === group.length;
        all.indeterminate = count > 0 && count < group.length;
        all.dispatchEvent(new CustomEvent('kfl:selection', { bubbles: true, detail: { name, count, total: group.length } }));
      };
      all.addEventListener('change', () => { for (const i of members()) i.checked = all.checked; sync(); });
      document.addEventListener('change', (e) => { if (e.target.matches?.(`input[data-select-group="${name}"]`)) sync(); });
      all.kflSync = sync;
      sync();
    }
  }

  /* Sortable tables: header buttons cycle ascending/descending, aria-sort says
     which, and the new order is announced. Cells may carry data-value. */
  function initSortableTables(root) {
    for (const table of $$('table.kfl-table', root)) {
      for (const button of $$('th > .kfl-table__sort', table)) {
        button.addEventListener('click', () => {
          const th = button.closest('th');
          const index = [...th.parentElement.children].indexOf(th);
          const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          for (const other of $$('th[aria-sort]', table)) other.setAttribute('aria-sort', 'none');
          th.setAttribute('aria-sort', dir);
          const numeric = th.hasAttribute('data-numeric');
          const collator = new Intl.Collator(document.documentElement.lang || undefined, { numeric: true, sensitivity: 'base' });
          const value = (row) => row.cells[index]?.dataset.value ?? row.cells[index]?.textContent.trim() ?? '';
          const body = table.tBodies[0];
          const rows = [...body.rows].filter((r) => !r.classList.contains('kfl-table__empty'));
          rows.sort((a, b) => {
            const c = numeric ? Number(value(a)) - Number(value(b)) : collator.compare(value(a), value(b));
            return dir === 'ascending' ? c : -c;
          });
          body.append(...rows);
          announce(`Sorted by ${button.textContent.trim()}, ${dir}`);
        });
      }
    }
  }

  /* Copy: <button data-copy="#source">. The label reports what really happened. */
  function initCopy(root) {
    for (const button of $$('[data-copy]', root)) {
      const label = button.querySelector('[data-copy-label]') ?? button;
      const idle = label.textContent;
      button.addEventListener('click', async () => {
        const source = document.querySelector(button.dataset.copy);
        try {
          await navigator.clipboard.writeText(source?.value ?? source?.textContent ?? '');
          label.textContent = 'Copied';
          announce('Copied to the clipboard');
        } catch {
          label.textContent = 'Copy failed';
          announce('Copy failed. Select the text and copy it manually.');
        }
        setTimeout(() => { label.textContent = idle; }, 2000);
      });
    }
  }

  /* Character count: a soft limit people can exceed while editing, shown as
     "n / max" and enforced at submit — pasting never silently truncates. */
  function initCounters(root) {
    for (const out of $$('[data-count-for]', root)) {
      const field = document.getElementById(out.dataset.countFor);
      if (!field) continue;
      const max = Number(field.dataset.maxlength);
      const sync = () => {
        out.textContent = `${field.value.length} / ${max}`;
        out.toggleAttribute('data-over', field.value.length > max);
      };
      field.addEventListener('input', sync);
      sync();
    }
  }

  /* Password reveal: <button data-reveal="input-id" aria-pressed>. */
  function initReveal(root) {
    for (const button of $$('[data-reveal]', root)) {
      const input = document.getElementById(button.dataset.reveal);
      button.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        button.setAttribute('aria-pressed', String(show));
        button.querySelector('.kfl-icon')?.setAttribute('data-icon', show ? 'eye-off' : 'eye');
      });
    }
  }

  /* Busy buttons: block repeat submissions while work is in flight and keep the
     button's size; the caller announces the real outcome. */
  function setBusy(button, busy) {
    if (busy) {
      button.setAttribute('aria-busy', 'true');
      button.setAttribute('aria-disabled', 'true');
      if (!button.querySelector('.kfl-loader')) button.insertAdjacentHTML('beforeend', '<span class="kfl-loader" aria-hidden="true"><span></span><span></span><span></span></span>');
    } else {
      button.removeAttribute('aria-busy');
      button.removeAttribute('aria-disabled');
    }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('[aria-disabled="true"]');
    if (b) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  /* Forms with data-validate: nothing is judged while people type. Submit checks
     every field, keeps every value, marks each problem at its field and lists
     them in the error summary, which takes focus. After that, an error clears
     the moment its field becomes valid. A valid form dispatches kfl:valid. */
  function initForms(root) {
    for (const form of $$('form[data-validate]', root)) {
      form.noValidate = true;
      const summary = form.querySelector('.kfl-error-summary');
      const controls = () => $$('input, select, textarea', form).filter((f) => !f.disabled && f.type !== 'hidden' && (f.willValidate || f.dataset.maxlength));
      const hostOf = (f) => (f.type === 'radio' || f.type === 'checkbox') && f.closest('fieldset') ? f.closest('fieldset') : f;
      const keyOf = (f) => (f.type === 'radio' ? `radio:${f.name}` : f.id);
      const errorId = (f) => `${f.type === 'radio' ? hostOf(f).id : f.id}-error`;
      const message = (f) => {
        if (f.dataset.maxlength && f.value.length > Number(f.dataset.maxlength)) return f.dataset.errorLength ?? `Use ${f.dataset.maxlength} characters or fewer`;
        const v = f.validity;
        if (v.valid) return '';
        if (v.valueMissing) return f.dataset.errorRequired ?? f.closest('fieldset')?.dataset.errorRequired ?? 'Enter a value';
        if (v.typeMismatch || v.patternMismatch || v.badInput) return f.dataset.errorFormat ?? f.validationMessage;
        return f.dataset.errorRange ?? f.validationMessage;
      };
      const describe = (el, id, on) => {
        const ids = new Set((el.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
        if (on) ids.add(id); else ids.delete(id);
        if (ids.size) el.setAttribute('aria-describedby', [...ids].join(' ')); else el.removeAttribute('aria-describedby');
      };
      const show = (f, text) => {
        const group = f.type === 'radio' ? $$(`input[type="radio"][name="${CSS.escape(f.name)}"]`, form) : [f];
        const id = errorId(f);
        let el = document.getElementById(id);
        for (const g of group) {
          if (text) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid');
          describe(g, id, Boolean(text));
        }
        if (!text) { el?.remove(); return; }
        if (!el) {
          el = document.createElement('p');
          el.id = id;
          el.className = 'kfl-field__error';
          el.innerHTML = '<span class="kfl-icon" data-icon="danger" aria-hidden="true"></span><span></span>';
          const anchor = f.type === 'radio' || f.type === 'checkbox'
            ? f.closest('fieldset')?.lastElementChild ?? f.closest('.kfl-choice') ?? f
            : f.closest('.kfl-input-group, .kfl-select, .kfl-search') ?? f;
          anchor.after(el);
        }
        el.lastElementChild.textContent = text;
      };
      form.addEventListener('submit', (e) => {
        const problems = [];
        const seen = new Set();
        for (const f of controls()) {
          if (seen.has(keyOf(f))) continue;
          seen.add(keyOf(f));
          const text = message(f);
          show(f, text);
          if (text) problems.push({ f, text });
        }
        if (problems.length) {
          e.preventDefault();
          form.dataset.checked = '';
          if (summary) {
            const title = summary.querySelector('.kfl-error-summary__title span:last-child') ?? summary.querySelector('.kfl-error-summary__title');
            title.textContent = problems.length === 1 ? 'Fix 1 problem to continue' : `Fix ${problems.length} problems to continue`;
            const list = summary.querySelector('ul');
            list.replaceChildren(...problems.map(({ f, text }) => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = `#${f.id}`;
              a.textContent = text;
              a.addEventListener('click', (ev) => { ev.preventDefault(); f.focus(); f.scrollIntoView({ block: 'center' }); });
              li.append(a);
              return li;
            }));
            summary.hidden = false;
            summary.focus();
          } else problems[0].f.focus();
          return;
        }
        if (summary) summary.hidden = true;
        if (!form.dispatchEvent(new CustomEvent('kfl:valid', { cancelable: true }))) e.preventDefault();
      });
      const recheck = (e) => {
        const f = e.target;
        if (!('checked' in form.dataset) || !f.matches?.('input, select, textarea')) return;
        if (document.getElementById(errorId(f))) show(f, message(f));
      };
      form.addEventListener('input', recheck);
      form.addEventListener('change', recheck);
    }
  }

  function init(root = document) {
    initToggles(root);
    initTabs(root);
    initMenus(root);
    initDialogs(root);
    initSliders(root);
    initSelectAll(root);
    initSortableTables(root);
    initCopy(root);
    initCounters(root);
    initReveal(root);
    initForms(root);
  }

  function boot() {
    announcer = document.createElement('div');
    announcer.className = 'kfl-visually-hidden';
    announcer.setAttribute('role', 'status');
    toaster = document.querySelector('.kfl-toaster');
    if (!toaster) {
      toaster = document.createElement('div');
      toaster.className = 'kfl-toaster';
      toaster.setAttribute('role', 'status');
      toaster.setAttribute('aria-live', 'polite');
    }
    document.body.append(announcer, toaster);
    initTheme();
    initGridToggle();
    initTooltips();
    init();
  }

  window.KFL = { init, announce, toast, setBusy };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
