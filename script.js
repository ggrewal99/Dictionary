document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    const searchBtn = document.querySelector(".search-btn");
    const searchBar = document.querySelector(".search-bar");

    const wordNameTitle = document.querySelector(".word-name-title");
    const phoneticElement = document.querySelector(".phonetic");
    const playButton = document.querySelector(".heading button");

    const contentSegmentContainer = document.querySelector(".content-segment-container");

    let wordData;

    const searchWord = () => {
        const word = searchBar.value;

        axios.get(`${API_URL}${word}`)
            .then((res) => {
                wordData = res.data[0];
                wordNameTitle.textContent = wordData.word;

                if (wordData.phonetic) {
                    phoneticElement.textContent = wordData.phonetic;
                    phoneticElement.style.display = "block";
                } else {
                    phoneticElement.style.display = "none";
                }

                // Remove previous click event listener
                playButton.removeEventListener("click", playAudio);

                // Show play button if audio file is available, otherwise hide it
                const audioUrl = findAudioUrl(wordData.phonetics);
                if (audioUrl) {
                    playButton.style.display = "inline-block";

                    // Add new click event listener to play the audio
                    playButton.addEventListener("click", playAudio);
                } else {
                    playButton.style.display = "none";
                }

                contentSegmentContainer.innerHTML = "";

                // Create a div for each partOfSpeech
                wordData.meanings.forEach((meaning) => {
                    const contentSegment = document.createElement("div");
                    contentSegment.classList.add("section1", "content-segment-container");

                    const sectionHeading = document.createElement("div");
                    sectionHeading.classList.add("section-heading");

                    const partOfSpeechTitle = document.createElement("h2");
                    partOfSpeechTitle.classList.add("section-title");
                    partOfSpeechTitle.textContent = meaning.partOfSpeech;

                    const sectionDivider = document.createElement("div");
                    sectionDivider.classList.add("section-divider");

                    sectionHeading.appendChild(partOfSpeechTitle);
                    sectionHeading.appendChild(sectionDivider);
                    contentSegment.appendChild(sectionHeading);

                    const sectionContent = document.createElement("div");
                    sectionContent.classList.add("section-content");

                    const sectionSubheading = document.createElement("h3");
                    sectionSubheading.classList.add("section-subheading");
                    sectionSubheading.textContent = "Meaning";

                    const meaningList = document.createElement("ul");

                    meaning.definitions.forEach((definition) => {
                        const li = document.createElement("li");
                        li.textContent = definition.definition;

                        if (definition.example) {
                            const exampleElement = document.createElement("p");
                            exampleElement.classList.add("example");
                            exampleElement.textContent = `Example: ${definition.example}`;
                            li.appendChild(exampleElement);
                        }

                        meaningList.appendChild(li);
                    });

                    sectionContent.appendChild(sectionSubheading);
                    sectionContent.appendChild(meaningList);
                    contentSegment.appendChild(sectionContent);

                    contentSegmentContainer.appendChild(contentSegment);
                });
            })
            .catch((e) => {
                console.error(e);
            });
    }

    const findAudioUrl = (phonetics) => {
        for (const phonetic of phonetics) {
            if (phonetic.audio) {
                return phonetic.audio;
            }
        }
        return null;
    };

    const playAudio = () => {
        const audioUrl = findAudioUrl(wordData.phonetics);
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    searchBtn.addEventListener("click", searchWord);
});
