console.log("JS loaded");

// Voice Search
function startVoice() {
  const voiceText = document.getElementById("voiceText");
  const resultsList = document.getElementById("voiceResults");

  console.log("Voice search started");

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  recognition.onresult = async function (event) {
    const transcript = event.results[0][0].transcript;
    console.log("Recognized text:", transcript);

    voiceText.innerText = "You said: " + transcript;

    try {
      const response = await fetch(
        "http://localhost:5000/api/schemes/recommend-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query: transcript })
        }
      );

      const data = await response.json();
      console.log("Backend response:", data);

      resultsList.innerHTML = "";

      if (!data.recommendations || data.recommendations.length === 0) {
        resultsList.innerHTML = "<li>No schemes found</li>";
        return;
      }

      data.recommendations.forEach(scheme => {
        const li = document.createElement("li");
        li.textContent = scheme.name;
        resultsList.appendChild(li);
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Voice search failed");
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech error:", event);
    voiceText.innerText = "Voice recognition failed";
  };

  recognition.start();
}
