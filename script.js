document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    const searchBtn = document.querySelector(".search-btn");
    const searchBar = document.querySelector(".search-bar");

    const searchWord = () => {
        const word = searchBar.value;

        axios.get(`${API_URL}${word}`)
            .then((res) => {
                console.log(res.data);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    searchBtn.addEventListener("click", searchWord);
})