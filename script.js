'use strict';

// Paraguay, UTC−03:00. El desplazamiento explícito evita usar la zona del invitado.
const weddingDate = new Date('2026-11-27T20:30:00-03:00').getTime();
const units = ['days', 'hours', 'minutes', 'seconds'];
function updateCountdown() {
  const remaining = Math.max(0, weddingDate - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = [Math.floor(totalSeconds / 86400), Math.floor(totalSeconds / 3600) % 24, Math.floor(totalSeconds / 60) % 60, totalSeconds % 60];
  units.forEach((unit, index) => { document.getElementById(unit).textContent = String(values[index]).padStart(2, '0'); });
  if (remaining === 0) {
    document.getElementById('countdown-title').textContent = '¡Llegó nuestro gran día!';
    document.getElementById('countdown-note').textContent = 'Gracias por ser parte de nuestra historia.';
  }
  return remaining;
}
if (updateCountdown() > 0) {
  const timer = setInterval(() => { if (updateCountdown() === 0) clearInterval(timer); }, 1000);
}

const invitationParams = new URLSearchParams(window.location.search);
const family = (invitationParams.get('familia') || '').trim();
const rawCapacity = invitationParams.get('cupos') || '';
const personalized = invitationParams.has('familia') || invitationParams.has('cupos');
const capacity = Number(rawCapacity);
const validInvitation = !personalized || (family.length > 0 && family.length <= 120 && /^[1-9]\d?$/.test(rawCapacity));
const rsvpForm = document.getElementById('rsvp-form');
const invitationNote = document.createElement('p');
invitationNote.id = 'invitation-note';
if (personalized) {
  rsvpForm.before(invitationNote);
  if (validInvitation) {
    invitationNote.textContent = `${family}: ${capacity === 1 ? 'te reservamos 1 lugar' : `les reservamos ${capacity} lugares`}.`;
    const originalInput = document.getElementById('guests');
    const select = document.createElement('select');
    select.id = 'guests';
    select.name = 'guests';
    select.required = true;
    select.setAttribute('aria-describedby', 'invitation-note');
    for (let count = 1; count <= capacity; count++) {
      select.add(new Option(String(count), String(count)));
    }
    select.value = String(capacity);
    originalInput.replaceWith(select);
  } else {
    invitationNote.textContent = 'Este enlace está incompleto. Pedile a Pablo o Carmen que te reenvíen tu invitación personalizada.';
    rsvpForm.hidden = true;
  }
}

rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('guests');
  if (!input.reportValidity()) return;
  const count = Number(input.value);
  if (!validInvitation || !Number.isInteger(count) || count < 1 || count > (personalized ? capacity : 99)) return;
  const familyMessage = personalized ? ` Invitación para ${family} (${capacity} ${capacity === 1 ? 'lugar reservado' : 'lugares reservados'}).` : '';
  const message = `Hola Pablo y Carmen ❤️${familyMessage} Confirmamos nuestra asistencia a este día tan especial. ${count === 1 ? 'Asistirá 1 persona' : `Seremos ${count} personas`}. ¡Nos vemos el 27 de noviembre! 🥂`;
  window.location.href = `https://wa.me/595985768360?text=${encodeURIComponent(message)}`;
});

const copyButton = document.getElementById('copy-alias');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(document.getElementById('gift-alias').textContent.trim());
    status.textContent = 'Alias copiado.';
  } catch {
    status.textContent = 'Podés seleccionar y copiar el alias: CI. 4740050';
  }
});

