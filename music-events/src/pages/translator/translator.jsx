import React, { useState, useEffect } from "react";
import axios from "axios";
import "./translator.scss";
import { FaEarthAfrica } from "react-icons/fa6";

function Translator() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
  ];

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getTranslatableNodes = () => {
    const textNodes = [];
    const walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (
            !parent ||
            ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) ||
            parent.classList.contains("no-translate") ||
            !node.textContent.trim()
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node;
    while ((node = walk.nextNode())) {
      const text = node.textContent.trim();
      if (text) {
        textNodes.push({ node, text });
      }
    }

    console.log("Translatable nodes found:", textNodes);
    return textNodes;
  };

  const handleLanguageSelect = async (languageCode) => {
    try {
      setIsTranslating(true);

      const translatableNodes = getTranslatableNodes();
      const textsToTranslate = translatableNodes.map((item) => item.text);

      if (textsToTranslate.length === 0) {
        console.warn("No translatable text found.");
        return;
      }

      console.log("Texts to translate:", textsToTranslate);

      const batchSize = 100;
      const translatedTexts = [];

      for (let i = 0; i < textsToTranslate.length; i += batchSize) {
        const batch = textsToTranslate.slice(i, i + batchSize);
        console.log("Sending batch:", batch);

        const response = await axios.post("http://localhost:8080/translate", {
          texts: batch,
          target_language: languageCode,
        });

        if (response.data.translated_texts) {
          translatedTexts.push(...response.data.translated_texts);
        }

        console.log("Translated batch:", response.data.translated_texts);
      }

      translatableNodes.forEach((item, index) => {
        if (translatedTexts[index]) {
          console.log(`Replacing "${item.text}" with "${translatedTexts[index]}"`);
          item.node.textContent = translatedTexts[index];
        }
      });
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
      setShowDropdown(false);
    }
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="translate-icon-container" onClick={toggleDropdown}>
      <FaEarthAfrica className={`translate-icon ${isTranslating ? "spinning" : ""}`} />
      {showDropdown && (
        <div className="language-dropdown" onClick={(e) => e.stopPropagation()}>
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`language-box ${isTranslating ? "disabled" : ""}`}
              onClick={() => !isTranslating && handleLanguageSelect(lang.code)}
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
