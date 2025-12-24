const BACKEND_URL = "https://ai-chatbot-0xoo.onrender.com"

const input = document.getElementById("user-input")
const sendBtn = document.getElementById("send-btn")
const chatBox = document.getElementById("chat-box")

sendBtn.addEventListener("click", sendMessage)

async function sendMessage() {
  const message = input.value.trim()
  if (!message) return

  addMessage("You", message)
  input.value = ""

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    })

    const data = await res.json()
    addMessage("AI", data.reply)

  } catch (err) {
    console.error(err)
    addMessage("AI", "Server error ❌")
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div")
  div.innerHTML = `<b>${sender}:</b> ${text}`
  chatBox.appendChild(div)
}
