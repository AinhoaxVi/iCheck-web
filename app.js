const fields = ['model', 'battery-level', 'health', 'storage-capacity', 'storage-free'];
const defaults = Object.fromEntries(fields.map(id => [id, '']));
let saved = { ...defaults };
try { saved = { ...defaults, ...JSON.parse(localStorage.getItem('icheck-web-v1') || '{}') }; } catch {}

for (const id of fields) {
  const field = document.getElementById(id);
  field.value = saved[id] ?? '';
  field.addEventListener('input', persist);
  field.addEventListener('change', persist);
}

function persist() {
  saved = Object.fromEntries(fields.map(id => [id, document.getElementById(id).value]));
  try { localStorage.setItem('icheck-web-v1', JSON.stringify(saved)); } catch {}
  renderManual();
}

function numberValue(id) {
  const n = Number(document.getElementById(id).value);
  return Number.isFinite(n) && document.getElementById(id).value !== '' ? n : null;
}

function renderManual() {
  const level = numberValue('battery-level');
  const health = numberValue('health');
  const total = numberValue('storage-capacity');
  const free = numberValue('storage-free');
  document.getElementById('battery-level-view').textContent = level === null ? '—' : Math.min(100, Math.max(0, level));
  document.getElementById('battery-bar').style.width = `${level === null ? 0 : Math.min(100, Math.max(0, level))}%`;
  document.getElementById('health-view').textContent = health === null ? '—' : Math.min(100, Math.max(0, health));
  document.getElementById('storage-total-view').textContent = total === null ? '—' : `${total} GB`;
  document.getElementById('storage-free-view').textContent = free === null ? '—' : `${free} GB`;
  const usedPercent = total && free !== null ? Math.max(0, Math.min(100, ((total - free) / total) * 100)) : 0;
  document.getElementById('storage-bar').style.width = `${usedPercent}%`;
  document.getElementById('model').value = saved.model || '';
}

renderManual();

const cores = navigator.hardwareConcurrency;
if (Number.isFinite(cores) && cores > 0) {
  document.getElementById('cores-view').textContent = cores;
  document.getElementById('cores-unit').textContent = 'núcleos lógicos que informa Safari';
} else {
  document.getElementById('cores-view').textContent = '—';
  document.getElementById('cores-unit').textContent = 'dato no disponible';
}

const ua = navigator.userAgent;
document.getElementById('browser-view').textContent = /CriOS/.test(ua) ? 'Chrome en iOS' : /FxiOS/.test(ua) ? 'Firefox en iOS' : /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua) ? 'Safari' : 'Navegador web';

document.getElementById('refresh').addEventListener('click', () => {
  renderManual();
  const button = document.getElementById('refresh');
  button.textContent = '✓';
  setTimeout(() => { button.textContent = '↻'; }, 900);
});

document.getElementById('benchmark').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const result = document.getElementById('benchmark-result');
  button.disabled = true;
  button.innerHTML = 'Calculando… <span>◌</span>';
  result.textContent = 'Prueba local en curso. El resultado depende de temperatura, carga y navegador.';
  try {
    const workerCode = `self.onmessage = () => { const start = performance.now(); let n = 0; let x = 0.123456789; while (performance.now() - start < 1100) { for (let i = 0; i < 5000; i++) { x = (x * 1.000000119 + 0.0000001) % 1; n++; } } self.postMessage({ n, ms: performance.now() - start }); };`;
    const url = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
    const worker = new Worker(url);
    const score = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('timeout')), 5000);
      worker.onmessage = e => { clearTimeout(timer); resolve(e.data); };
      worker.onerror = () => { clearTimeout(timer); reject(new Error('worker')); };
      worker.postMessage('start');
    });
    worker.terminate(); URL.revokeObjectURL(url);
    const operations = Math.round(score.n / (score.ms / 1000));
    result.textContent = `Resultado orientativo: ${operations.toLocaleString('es-ES')} operaciones sencillas/s. No equivale a GHz ni al uso de CPU.`;
  } catch {
    result.textContent = 'Safari ha limitado la prueba. Puedes volver a intentarlo con la página activa.';
  } finally {
    button.disabled = false;
    button.innerHTML = 'Repetir prueba de rendimiento <span>→</span>';
  }
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
