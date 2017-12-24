"use strict";
/* global jd, localStorage */

{
  let storyInput = jd.f(".story-input");
  let partsOfSpeechInput = jd.f(".parts-of-speech");
  
  
  let bracketedRegex = /\[([^\]]+)\]/g; /\[([^\]]+)\]/g
  let updateParts = () => {
    let madlib = storyInput.value;
    localStorage.setItem("story", madlib);
    
    let partsOfSpeech = [];
    
    let match = bracketedRegex.exec(madlib);
    while (match != null) {
      partsOfSpeech.push(match[1]);
      match = bracketedRegex.exec(madlib);
    }
    
    {
      let i = 0;
      for (let speech of partsOfSpeechInput.querySelectorAll(".replace-speech")) {
        if (partsOfSpeech[i]) {
          speech.textContent = partsOfSpeech[i];
        } else {
          partsOfSpeechInput.removeChild(speech.parentNode);
        }
        ++i;
      }
      while (i < partsOfSpeech.length) {
        jd.c("label", {}, [
          jd.c("span", {class: "replace-speech", _: partsOfSpeech[i]}),
          jd.c("input", {class: "replace-input", _: partsOfSpeech[i]})
        ], partsOfSpeechInput);
        ++i;
      }
    }
    
    updateStory();
  };
  
  
  let updateStory = () => {
    let madlib = storyInput.value;
    
    let replacements = Array.prototype.slice.call(document.querySelectorAll(".replace-input")).map(input => input.value);
    if (!replacements.includes("")) {
      let i = 0;
      madlib = madlib.replace(bracketedRegex, x => replacements[i++] || x);
      jd.f(".final-story").classList.remove("hide");
      jd.f(".final-story").textContent = madlib;
    }
  };
  
  storyInput.value = localStorage.getItem("story") || "";
  updateParts();
  
  let updatePartsTimeout;
  storyInput.addEventListener("keypress", e => {
    if (e.key === "Enter" || e.key === ".") {
      updateParts();
    } else {
      if (updatePartsTimeout) {
        clearTimeout(updatePartsTimeout);
      }
      updatePartsTimeout = setTimeout(updateParts, 1000);
    }
  });
  storyInput.addEventListener("paste", updateParts);
  
  let partsOfSpeechTimeout;
  partsOfSpeechInput.addEventListener("keypress", e => {
    if (partsOfSpeechTimeout) {
      clearTimeout(partsOfSpeechTimeout);
    }
    partsOfSpeechTimeout = setTimeout(updateStory, 1000);
  });
}