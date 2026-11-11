(() => {
  'use strict';
  const MODEL = 'gemini-3.5-flash-lite';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const dialog = document.querySelector('#key-dialog');
  const keyInput = document.querySelector('#api-key');
  const keyError = document.querySelector('#key-error');
  const composer = document.querySelector('#composer');
  const promptBox = document.querySelector('#prompt');
  const chat = document.querySelector('#chat');
  const welcome = document.querySelector('#welcome');
  const sendButton = document.querySelector('#send');
  let apiKey = '';
  let busy = false;
  let history = [];
  function openKeyDialog() { keyError.textContent = ''; keyInput.value = ''; if (!dialog.open) dialog.showModal(); keyInput.focus(); }
  function addMessage(role, text, isError = false) {
    welcome.classList.add('hidden');
    const row = document.createElement('div'); row.className = `message ${role}`;
    const avatar = document.createElement('div'); avatar.className = 'avatar'; avatar.textContent = role === 'user' ? 'أنت' : '✳'; avatar.setAttribute('aria-hidden', 'true');
    const bubble = document.createElement('div'); bubble.className = `bubble${isError ? ' error' : ''}`; bubble.textContent = text;
    row.append(avatar, bubble); chat.append(row); row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return row;
  }
  function addTyping() { const row = document.createElement('div'); row.className = 'message assistant'; row.id = 'typing'; const avatar = document.createElement('div'); avatar.className = 'avatar'; avatar.textContent = '✳'; const dots = document.createElement('div'); dots.className = 'bubble typing'; dots.innerHTML = '<span></span><span></span><span></span>'; row.append(avatar, dots); chat.append(row); row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  function setBusy(value) { busy = value; sendButton.disabled = value; promptBox.disabled = value; }
  function friendlyError(response, data) {
    const error = data?.error || {};
    const message = String(error.message || '');
    const details = Array.isArray(error.details) ? error.details : [];
    const reasons = details.map(item => String(item?.reason || '')).filter(Boolean);
    const reasonText = reasons.join(' ').toUpperCase();
    if (/API_KEY_INVALID|API key not valid/i.test(reasonText + ' ' + message)) return 'مفتاح Google غير صالح أو منسوخ ناقصًا. أنشئ مفتاح Gemini جديدًا في Google AI Studio والصقه من جديد.';
    if (/API_KEY_HTTP_REFERRER_BLOCKED|HTTP_REFERRER_BLOCKED/i.test(reasonText + ' ' + message)) return 'Google حظر المفتاح بسبب قيود المواقع المسموح بها. أضف https://khalilbahri003.github.io/* إلى قيود المواقع للمفتاح.';
    if (/SERVICE_DISABLED|API_DISABLED/i.test(reasonText + ' ' + message)) return 'فعّل Gemini API للمشروع المرتبط بالمفتاح في Google AI Studio، ثم جرّب مجددًا.';
    if (response.status === 400) return 'Google رفض الطلب. تأكد من أن المفتاح خاص بـ Gemini API، وأن الرسالة قصيرة، ثم جرّب مجددًا.';
    if (response.status === 401 || response.status === 403) return 'المفتاح لا يملك صلاحية استخدام Gemini API لهذا المشروع. راجع المفتاح وإعدادات API في Google AI Studio.';
    if (response.status === 404) return 'نموذج Gemini غير متاح لهذا المفتاح أو المشروع. تأكد من إعدادات Gemini API في Google AI Studio.';
    if (response.status === 429) return 'وصلت إلى حدّ الاستخدام أو الطلبات. راجع الحصة في Google AI Studio ثم حاول لاحقًا.';
    if (!response.ok) return `تعذّر الرد (${response.status}). راجع إعدادات Gemini API أو حاول مرة أخرى.`;
    return 'حدث خطأ في الاتصال. تحقق من الإنترنت وحاول مرة أخرى.';
  }
  async function send(text) {
    const message = text.trim(); if (!message || busy) return;
    if (!apiKey) { openKeyDialog(); return; }
    addMessage('user', message); promptBox.value = ''; promptBox.style.height = 'auto';
    history.push({ role: 'user', parts: [{ text: message }] }); const requestHistory = history.slice(-16);
    setBusy(true); addTyping();
    try {
      const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify({ contents: requestHistory, generationConfig: { temperature: 0.7, maxOutputTokens: 1200 } }) });
      let data = {}; try { data = await response.json(); } catch { /* handled below */ }
      document.querySelector('#typing')?.remove();
      if (!response.ok) { history.pop(); addMessage('assistant', friendlyError(response, data), true); return; }
      const answer = (data.candidates?.[0]?.content?.parts || []).map(part => part.text || '').join('').trim();
      if (!answer) { history.pop(); addMessage('assistant', 'لم يصلني ردّ نصّي. جرّب سؤالًا آخر.'); return; }
      history.push({ role: 'model', parts: [{ text: answer }] }); addMessage('assistant', answer);
    } catch { document.querySelector('#typing')?.remove(); history.pop(); addMessage('assistant', 'ما نجمتش نتصل بالخدمة. تحقق من الإنترنت وأعد المحاولة.', true); }
    finally { setBusy(false); promptBox.focus(); }
  }
  document.querySelector('#key-settings').addEventListener('click', openKeyDialog);
  document.querySelector('#save-key').addEventListener('click', () => { const value = keyInput.value.trim(); if (value.length < 10) { keyError.textContent = 'الصق مفتاح API صالحًا أولًا.'; keyInput.focus(); return; } apiKey = value; keyInput.value = ''; keyError.textContent = ''; dialog.close(); promptBox.focus(); });
  document.querySelector('#toggle-key').addEventListener('click', event => { const show = keyInput.type === 'password'; keyInput.type = show ? 'text' : 'password'; event.currentTarget.textContent = show ? 'إخفاء' : 'إظهار'; });
  document.querySelectorAll('.suggestion').forEach(button => button.addEventListener('click', () => { promptBox.value = button.dataset.prompt || ''; promptBox.focus(); if (!apiKey) openKeyDialog(); }));
  composer.addEventListener('submit', event => { event.preventDefault(); send(promptBox.value); });
  promptBox.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); composer.requestSubmit(); } });
  promptBox.addEventListener('input', () => { promptBox.style.height = 'auto'; promptBox.style.height = `${Math.min(promptBox.scrollHeight, 140)}px`; });
  document.querySelector('#clear-chat').addEventListener('click', () => { history = []; chat.replaceChildren(); welcome.classList.remove('hidden'); promptBox.value = ''; promptBox.focus(); });
  window.addEventListener('pagehide', () => { apiKey = ''; history = []; });
  window.setTimeout(openKeyDialog, 500);
})();
