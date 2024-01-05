export function activateTabControls() {
    const playTab = document.getElementById("play_tab");
    const apiTab = document.getElementById("api_tab");
    const playSection = document.getElementById("play_section");
    const apiSection = document.getElementById("api_section");
    apiTab.addEventListener("click", () => {
        playSection.classList.add("hidden");
        apiSection.classList.remove("hidden");
        playTab.classList.add("inactive_tab");
        apiTab.classList.remove("inactive_tab");
    });
    playTab.addEventListener("click", () => {
        playSection.classList.remove("hidden");
        apiSection.classList.add("hidden");
        playTab.classList.remove("inactive_tab");
        apiTab.classList.add("inactive_tab");
    });
}