console.log("Life Event JS loaded");

const API_BASE_URL = "http://localhost:5000";

document.getElementById("searchBtn").addEventListener("click", async () => {
  const input = document.getElementById("lifeEventInput");
  const list = document.getElementById("recommendationsList");

  const query = input.value.trim();
  console.log("Sending query:", query);

  if (!query) {
    alert("Please enter your life event");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/schemes/recommend-ai`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      }
    );

    const data = await response.json();
    console.log("Response from backend:", data);

    list.innerHTML = "";

    if (!data.recommendations || data.recommendations.length === 0) {
      list.innerHTML = "<li>No schemes found</li>";
      return;
    }

    data.recommendations.forEach((scheme) => {
      const li = document.createElement("li");
      li.textContent = scheme.name;
      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert("Backend error. Check console.");
  }
});
