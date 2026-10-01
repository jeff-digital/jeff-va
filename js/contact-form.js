document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const submitButton = document.getElementById("contactSubmit");
    const status = document.getElementById("contactFormStatus");
    const successModal = document.getElementById("contactSuccessModal");
    const closeModalButton = document.getElementById("contactSuccessClose");
    const purposeSelect = document.getElementById("contactPurpose");
    const otherPurposeField = document.getElementById("contactOtherPurposeField");
    const otherPurposeInput = document.getElementById("contactOtherPurpose");

    if (!form || !submitButton || !status || !successModal || !closeModalButton || !purposeSelect || !otherPurposeField || !otherPurposeInput) return;

    const syncOtherPurposeField = () => {
        const isOtherSelected = purposeSelect.value === "Other";
        otherPurposeField.classList.toggle("hidden", !isOtherSelected);
        otherPurposeInput.required = isOtherSelected;

        if (!isOtherSelected) {
            otherPurposeInput.value = "";
        }
    };

    purposeSelect.addEventListener("change", syncOtherPurposeField);
    syncOtherPurposeField();

    const closeSuccessModal = () => {
        successModal.classList.add("hidden");
        successModal.classList.remove("flex");
        successModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("overflow-hidden");
        submitButton.focus();
    };

    const openSuccessModal = () => {
        successModal.classList.remove("hidden");
        successModal.classList.add("flex");
        successModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("overflow-hidden");
        closeModalButton.focus();
    };

    closeModalButton.addEventListener("click", closeSuccessModal);

    successModal.addEventListener("click", (event) => {
        if (event.target === successModal) closeSuccessModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !successModal.classList.contains("hidden")) {
            closeSuccessModal();
        }
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        status.textContent = "";

        try {
            const response = await fetch("https://formsubmit.co/ajax/almocerajeffreys@gmail.com", {
                method: "POST",
                body: new FormData(form),
                headers: { Accept: "application/json" }
            });
            const result = await response.json().catch(() => ({}));
            const submissionSucceeded = result.success === true || result.success === "true";

            if (!response.ok || !submissionSucceeded) {
                status.textContent = "Your message could not be sent. Please try again later.";
                return;
            }

            form.reset();
            syncOtherPurposeField();
            status.textContent = "";
            openSuccessModal();
        } catch {
            status.textContent = "Sorry, your message could not be sent. Please try again later.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send message";
        }
    });
});