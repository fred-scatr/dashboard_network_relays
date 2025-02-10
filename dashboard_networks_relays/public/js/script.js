
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("theme-toggle");
    const body = document.body;
    console.log("add event listener");


    // Check stored preference
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    // Toggle function
    toggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        console.log("button clicked");
        console.log("body.classList:", body.classList);

        // Save the preference
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            document.body.classList.remove("dark-mode");
            void document.body.offsetWidth; // ✅ Forces repaint
            document.body.classList.add("dark-mode");
        } else {
            localStorage.setItem("theme", "light");
        }

        console.log("dark mode?" , document.body.classList.contains('dark-mode'));
    });
});
