const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3.1:8b",
    prompt: "Give me 3 tips for staying healthy today.",
    system: "You are HealthGenie AI, a personal health assistant.",
    stream: false
  })
});
const data = await response.json();
console.log("✅ OLLAMA RESPONSE:", data.response);
