---
title: State management
---
# Introduction

This document will walk you through the state management implementation in <SwmPath>[src/App.js](/src/App.js)</SwmPath>.

The purpose of this implementation is to manage user input, handle chat interactions, and manage loading states effectively.

We will cover:

1. How state variables are initialized and their roles.
2. The process of handling user input and updating the chat state.
3. The integration with an external API for generating responses.
4. Error handling and updating the chat with responses or errors.
5. Managing the loading state throughout the process.

# State initialization

<SwmSnippet path="/src/App.js" line="6">

---

We begin by initializing state variables. These variables are crucial for managing user input, chat history, and loading status.

```
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
```

---

</SwmSnippet>

# Handling user input

<SwmSnippet path="/src/App.js" line="10">

---

The <SwmToken path="/src/App.js" pos="10:3:3" line-data="  const handleSend = async () =&gt; {">`handleSend`</SwmToken> function processes user input. It updates the chat state with the user's message and resets the input field. It also sets the loading state to true, indicating that a response is being fetched.

```
  const handleSend = async () => {
    if (!input.trim()) return;

    const newChat = [...chat, { sender: "user", text: input }];
    setChat(newChat);
    setInput("");
    setLoading(true);
```

---

</SwmSnippet>

# API integration

<SwmSnippet path="/src/App.js" line="18">

---

We use Axios to send a POST request to an external API. This request includes the user's input and expects a response that will be used to update the chat.

```
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
```

---

</SwmSnippet>

# Handling API response

<SwmSnippet path="/src/App.js" line="33">

---

Upon receiving a response, we update the chat with the bot's reply. If an error occurs, we log it and update the chat with an error message.

```
      const reply = response?.data?.candidates?.[0]?.content?.parts?.[0].text || "No response";
      setChat([...newChat, { sender: "bot", text: reply }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChat([...newChat, { sender: "bot", text: "Error fetching response" }]);
```

---

</SwmSnippet>

# Managing loading state

<SwmSnippet path="/src/App.js" line="38">

---

Finally, regardless of success or failure, we reset the loading state to false, indicating that the process of fetching a response is complete.

```
    } finally {
      setLoading(false);
    }
  };
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBZ2VtaW5pLWNoYXQlM0ElM0FBYmhpLURldjEy" repo-name="gemini-chat"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
