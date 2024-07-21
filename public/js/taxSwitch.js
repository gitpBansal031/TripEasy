let toggleSwitch = document.querySelector("#flexSwitchCheckDefault");
toggleSwitch.addEventListener("click", () => {
    let tax = document.querySelectorAll(".tax-text");
    for (info of tax) {
        if (info.style.display == 'inline') {
            info.style.display = 'none';
        } else {
            info.style.display = 'inline';
        }
    }
})