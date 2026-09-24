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

document.getElementById('rsvp-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('guests');
  if (!input.reportValidity()) return;
  const count = Number(input.value);
  if (!Number.isInteger(count) || count < 1 || count > 99) return;
  const message = `Hola Pablo y Carmen ❤️ Confirmamos nuestra asistencia a este día tan especial. ${count === 1 ? 'Asistiré 1 persona' : `Seremos ${count} personas`}. ¡Nos vemos el 27 de noviembre! 🥂`;
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

