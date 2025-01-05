import React, { useState } from "react";
import axios from "axios";

function Translator() {
  const [language, setLanguage] = useState("es"); // Set initial language as Spanish
  const [translatedContent, setTranslatedContent] = useState("");

  const translatePage = async () => {
    try {
      const pageContent = document.body.innerText; // Get all text from the webpage

      // Send request to backend for translation
      const response = await axios.post("/translate", {
        texts: pageContent,
        target_language: language,
      });

      if (response.status === 200) {
        setTranslatedContent(response.data.translated_texts.join(" "));
      }
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  return (
    <div className="translator-page">
      <h1>Translate Page</h1>
      <div>
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <button onClick={translatePage}>Translate</button>

      <div className="translated-content">
        <p>{translatedContent}</p>
      </div>
    </div>
  );
}

export default Translator;
