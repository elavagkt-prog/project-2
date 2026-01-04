const API_BASE_URL = "http://localhost:5000";

function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("Voice:", transcript);

    document.getElementById("voiceText").innerText =
      `You said: "${transcript}"`;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/schemes/recommend-ai`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: transcript })
        }
      );

      const data = await response.json();
      console.log("API response:", data);

      const list = document.getElementById("voiceResults");
      list.innerHTML = "";

      if (!data.recommendations || data.recommendations.length === 0) {
        list.innerHTML = "<li>No schemes found</li>";
        return;
      }

      data.recommendations.forEach(scheme => {
        const li = document.createElement("li");
        li.textContent = scheme.name;
        list.appendChild(li);
      });

    } catch (err) {
      console.error("Fetch error:", err);
      alert("API call failed");
    }
  };

  recognition.start();
}
