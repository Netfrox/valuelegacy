document.addEventListener('DOMContentLoaded', () => {
  const buyButton = document.querySelector('.buy');
  if (buyButton) {
    buyButton.addEventListener('click', async (event) => {
      event.preventDefault(); // 🔒 BLOKUJE DOMYŚLNE ZACHOWANIE np. <a href="#">
      await handlePayment(event); // 💳 Uruchamia Stripe
    });
  }
});
  // Efekt Matrix
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

  resizeCanvas();

  const chars = '01';
  const fontSize = 16;
  let columns = canvas.width / fontSize;
  let drops = Array(Math.floor(columns)).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(12, 12, 12, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f5c542';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height || Math.random() > 0.95) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  setInterval(draw, 60);

  window.addEventListener('resize', () => {
    resizeCanvas();
    columns = canvas.width / fontSize;
    drops = Array(Math.floor(columns)).fill(1);
  });

  // =======================
  // PANEL UŻYTKOWNIKA
  // =======================

  function showUserPanel(user) {
    const panel = document.getElementById('user-panel');
    if (!panel) return;

    panel.style.display = 'block';
    document.getElementById('username').textContent = user.username;
    document.getElementById('subscription-status').textContent = user.subscriptionStatus;
    document.getElementById('subscription-expires').textContent = user.subscriptionExpires;
  }

  function logout() {
    localStorage.clear();
    location.reload();
  }

  // Tymczasowe dane testowe
  const testUser = {
    username: 'Kamil#1234',
    subscriptionStatus: 'Aktywna',
    subscriptionExpires: '2025-09-30'
  };

  // Przycisk otwierający panel
  const panelBtn = document.getElementById('user-panel-btn');
  if (panelBtn) {
    panelBtn.addEventListener('click', () => {
      const panel = document.getElementById('user-panel');
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        showUserPanel(testUser);
      }
    });
  }

  // Załaduj panel od razu (lub nie — zależnie od preferencji)
  // showUserPanel(testUser);
}async function handlePayment(event) {
  event?.preventDefault();

  const res = await fetch("http://127.0.0.1:4242/create-checkout-session", {
    method: "POST",
  });

  const data = await res.json();

  const stripe = Stripe("pk_live_51ReE1ILqXUQKMmh7o9lSCc4YIc9Hzu4aj2r1k5w1rdQEKPMcwPF8eqICln7bpWRRkwe1UfE3R8jcjP44cJluwiaO00R0UaiO1J"); // <-- wklej tu swój klucz z panelu Stripe
  stripe.redirectToCheckout({ sessionId: data.id });
}
);

