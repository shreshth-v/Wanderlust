let taxSwitch = document.querySelector("#flexSwitchCheckReverse");
let taxes = document.querySelectorAll(".tax-amount");

taxSwitch.addEventListener("click", () => {
    for(tax of taxes) {
        if (tax.style.display  === "inline") {
            tax.style.display = "none";
        } else {
            tax.style.display = "inline";
        }
    }
})