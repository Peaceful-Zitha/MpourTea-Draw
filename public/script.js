const nameInput = document.getElementById('nameInput');
const submitBtn = document.getElementById('submitBtn');
const status = document.getElementById('status');
const leaderboardEl = document.getElementById('leaderboard');
const pickWinnerBtn = document.getElementById('pickWinnerBtn');

// For index.html
if(submitBtn) {
  submitBtn.onclick = async () => {
    const name = nameInput.value.trim();
    if(!name) {
      status.textContent = "Please enter your name.";
      status.style.color = "red";
      return;
    }
    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if(res.ok) {
        status.textContent = "Thanks for joining!";
        status.style.color = "green";
        nameInput.value = '';
      } else {
        const data = await res.json();
        status.textContent = data.error || "Error";
        status.style.color = "orange";
      }
    } catch(e) {
      status.textContent = "Network error.";
      status.style.color = "red";
    }
  };
}

// For leaderboard.html
if(leaderboardEl && pickWinnerBtn) {
  async function loadLeaderboard() {
    const res = await fetch('/api/participants');
    const participants = await res.json();
    leaderboardEl.innerHTML = '';
    participants.forEach((p,i) => {
      const li = document.createElement('li');
      li.textContent = `${i+1}. ${p.name}`;
      if(i === 0) li.style.fontWeight = 'bold';
      leaderboardEl.appendChild(li);
    });
  }

  pickWinnerBtn.onclick = async () => {
    const res = await fetch('/api/pick-winner', { method: 'POST' });
    if(res.ok) {
      loadLeaderboard();
      new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg').play();
    } else {
      alert('No participants!');
    }
  };

  loadLeaderboard();
}
