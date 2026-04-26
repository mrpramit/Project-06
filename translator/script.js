// ===== GLOBAL STATE =====
let sourceLang = "auto";
let targetLang = "hi";


// ===== CUSTOM SELECT SETUP =====
function setupCustomSelect(id, isSource) {
    const select = document.getElementById(id);
    const selected = select.querySelector(".selected");
    const options = select.querySelector(".options");

    // Toggle dropdown
    selected.onclick = () => {
        options.style.display =
            options.style.display === "block" ? "none" : "block";
    };

    // Select option
    options.querySelectorAll("div").forEach(opt => {
        opt.onclick = () => {
            selected.innerText = opt.innerText;
            options.style.display = "none";

            if (isSource) {
                sourceLang = opt.dataset.value;
            } else {
                targetLang = opt.dataset.value;
            }
        };
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
        if (!select.contains(e.target)) {
            options.style.display = "none";
        }
    });
}


// ===== INIT DROPDOWNS =====
setupCustomSelect("sourceSelect", true);
setupCustomSelect("targetSelect", false);


// ===== TRANSLATE FUNCTION =====
async function translateText() {
    let text = document.getElementById("inputText").value;
    let output = document.getElementById("outputText");

    if (!text) return;

    // Reset animation classes
    output.classList.remove("done");
    output.classList.remove("typing");

    // Skeleton loader
    output.innerHTML = `
        <div class='skeleton'></div>
        <div class='skeleton'></div>
        <div class='skeleton'></div>
    `;

    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        let res = await fetch(url);
        let data = await res.json();

        let fullText = data[0].map(item => item[0]).join("");
        typeText(fullText);
    } catch {
        output.innerText = "Error...";
    }
}


// ===== TYPING ANIMATION =====
function typeText(text) {
    let output = document.getElementById("outputText");

    output.innerHTML = "";
    output.classList.add("typing");

    let i = 0;

    function typing() {
        if (i < text.length) {
            output.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, 12);
        } else {
            output.classList.remove("typing");
            output.classList.add("done");
        }
    }

    typing();
}


// ===== SWAP FUNCTION =====
function swapLang() {
    let btn = document.getElementById("swapBtn");

    btn.classList.add("rotate");
    setTimeout(() => btn.classList.remove("rotate"), 300);

    // Swap values
    let temp = sourceLang;
    sourceLang = targetLang;
    targetLang = temp;

    // Update UI text
    document.querySelector("#sourceSelect .selected").innerText =
        document.querySelector(`#sourceSelect .options div[data-value="${sourceLang}"]`).innerText;

    document.querySelector("#targetSelect .selected").innerText =
        document.querySelector(`#targetSelect .options div[data-value="${targetLang}"]`).innerText;
}


// ===== COPY =====
function copyText() {
    let text = document.getElementById("outputText").innerText;
    navigator.clipboard.writeText(text);
}


// ===== CLEAR =====
function clearText() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputText").innerHTML = "";
}