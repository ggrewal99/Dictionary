document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    const searchBtn = document.querySelector(".search-btn");
    const searchBar = document.querySelector(".search-bar");
    const wordNameTitle = document.querySelector(".word-name-title");
    const phoneticElement = document.querySelector(".phonetic");
    const playButton = document.querySelector(".heading button");
    const contentSegmentContainer = document.querySelector(".content-segment-container");
    const themeSwitcher = document.querySelector("#themeSwitcher");
    const body = document.querySelector("body");
    const fontFamilySelect = document.getElementById("font-family-select");
    const fontFamilySelectContainer = document.querySelector(".dropdown-container");
    let content = document.querySelector(".content");

    const getWidth = (selectedValue) => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 401 && screenWidth <= 1100) {
            if (selectedValue === "Serif") {
                document.documentElement.style.setProperty('--font-family', "serif");
                fontFamilySelectContainer.style.width = "3.5rem";
            }
            else if (selectedValue === "Sans Serif") {
                document.documentElement.style.setProperty('--font-family', "sans-serif");
                fontFamilySelectContainer.style.width = "6rem";
            } else {
                document.documentElement.style.setProperty('--font-family', selectedValue);
                fontFamilySelectContainer.style.width = "6.3rem";
            }
        } else if (window.matchMedia('(max-width: 400px)').matches) {
            if (selectedValue === "Serif") {
                document.documentElement.style.setProperty('--font-family', "serif");
                fontFamilySelectContainer.style.paddingRight = "6rem";
            }
            else if (selectedValue === "Sans Serif") {
                document.documentElement.style.setProperty('--font-family', "sans-serif");
                fontFamilySelectContainer.style.paddingRight = "7.5rem";
            } else {
                document.documentElement.style.setProperty('--font-family', selectedValue);
                fontFamilySelectContainer.style.paddingRight = "8.5rem";
            }
        } else {
            fontFamilySelectContainer.style.paddingRight = "0";
            if (selectedValue === "Serif") {
                document.documentElement.style.setProperty('--font-family', "serif");
                fontFamilySelectContainer.style.width = "4.5rem";
            }
            else if (selectedValue === "Sans Serif") {
                document.documentElement.style.setProperty('--font-family', "sans-serif");
                fontFamilySelectContainer.style.width = "7.5rem";
            } else {
                document.documentElement.style.setProperty('--font-family', selectedValue);
                fontFamilySelectContainer.style.width = "7.5rem";
            }
        }
    }

    fontFamilySelect.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        getWidth(selectedValue);
    });

    let wordData;

    themeSwitcher.addEventListener("change", () => {
        if (themeSwitcher.checked) {
            body.classList.add("dark");
        } else {
            body.classList.remove("dark");
        }
    })

    const searchWord = () => {
        const word = searchBar.value;
        const spinner = document.querySelector(".spinner-container");
        const welcomeMsg = document.querySelector(".welcome-section");
        const notFoundMsg = document.querySelector(".notFound-section");

        wordNameTitle.textContent = "";
        phoneticElement.textContent = "";
        playButton.style.display = "none";
        content.innerHTML = "<div class='section1 content-segment-container'></div>";

        spinner.classList.remove("d-none");

        welcomeMsg.style.display = "none";
        notFoundMsg.style.display = "none";

        axios.get(`${API_URL}${word}`)
            .then((res) => {
                spinner.classList.add("d-none");
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
                    contentSegment.classList.add("content-segment-container");

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
                        li.innerHTML = `${definition.definition}`;

                        if (definition.example) {
                            const exampleElement = document.createElement("p");
                            exampleElement.classList.add("example");
                            exampleElement.textContent = `"${definition.example}"`;
                            li.appendChild(exampleElement);
                        }

                        if (definition.synonyms && definition.synonyms.length > 0) {
                            const synonymsElement = document.createElement("p");
                            synonymsElement.classList.add("synonyms");
                            synonymsElement.textContent = `Synonyms: ${definition.synonyms.join(", ")}`;
                            li.appendChild(synonymsElement);
                        }

                        meaningList.appendChild(li);
                    });

                    sectionContent.appendChild(sectionSubheading);
                    sectionContent.appendChild(meaningList);
                    contentSegment.appendChild(sectionContent);

                    if (meaning.synonyms && meaning.synonyms.length > 0) {
                        const synonymsElement = document.createElement("p");
                        synonymsElement.classList.add("synonyms");
                        synonymsElement.innerHTML = `Synonyms <span class="synonym-value">${meaning.synonyms.join("</span>, <span class='synonym-value'>")}</span>`;
                        contentSegment.appendChild(synonymsElement);
                    }

                    contentSegmentContainer.appendChild(contentSegment);
                    content.appendChild(contentSegmentContainer);
                });

                const bottomDivider = document.createElement("div");
                bottomDivider.classList.add("bottom-divider");
                contentSegmentContainer.appendChild(bottomDivider);

                const sourceElement = document.createElement("div");
                sourceElement.classList.add("source");
                sourceElement.innerHTML = `<span>Source</span> <div><a href="${wordData.sourceUrls[0]}" target="_blank">${wordData.sourceUrls[0]}</a>
                <a href="${wordData.sourceUrls[0]}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>`;
                contentSegmentContainer.appendChild(sourceElement);
            })
            .catch((e) => {
                spinner.classList.add("d-none");
                console.error(e);
                notFoundMsg.style.display = "flex";
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
    searchBar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchWord();
        }
    });
});
