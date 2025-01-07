import React, { useState } from "react";
import axios from "axios";
import "./translator.scss"
import { FaEarthAfrica } from "react-icons/fa6";// this is for translation of the page 


function Translator() {
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
  ];

  const handleLanguageSelect = async (languageCode) => {
    try {
      const pageContent = Array.from(document.body.querySelectorAll("*"))
        .map((node) => (node.nodeType === 3 ? node : null)) // Only text nodes (nodeType 3)
        .filter(Boolean)
        .map((node) => node.textContent)
        .join(" "); // Extract the text

      const response = await axios.post("/translate", {
        texts: pageContent,
        target_language: languageCode,
      });

      if (response.status === 200) {
        const translatedText = response.data.translated_texts.join(" ");
        replacePageText(translatedText);
      } else {
        console.error("Translation failed:", response.data.error);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setShowDropdown(false); // Hide the dropdown after translation
    }
  };

  const replacePageText = (translatedText) => {
    let textNodes = document.body.querySelectorAll("*");
    textNodes.forEach((node) => {
      if (node.nodeType === 3) { 
        node.textContent = translatedText;
      }
    });
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  document.addEventListener("click", closeDropdown);

  return (
    <div
        className="translate-icon-container"
        onClick={toggleDropdown}
      >
        <FaEarthAfrica className="translate-icon" />
        {showDropdown && (
          <div className="language-dropdown" onClick={(e) => e.stopPropagation()}>
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="language-box"
                onClick={() => handleLanguageSelect(lang.code)}
              >
                {lang.name}
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

export default Translator;
