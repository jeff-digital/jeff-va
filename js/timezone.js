function updateClientAvailability() {
    const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const startUTC = new Date();
    startUTC.setUTCHours(12, 0, 0, 0);

    const endUTC = new Date();
    endUTC.setUTCHours(21, 0, 0, 0);

    const clientStart = new Intl.DateTimeFormat("en-US", {
        timeZone: clientTimezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(startUTC);

    const clientEnd = new Intl.DateTimeFormat("en-US", {
        timeZone: clientTimezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(endUTC);

    const clientAvailability = document.getElementById("clientAvailability");
    const clientTimezoneEl = document.getElementById("clientTimezone");
    const availabilityStatusEl = document.getElementById("availabilityStatus");

    if (clientAvailability) {
        clientAvailability.textContent = `${clientStart} – ${clientEnd}`;
    }

    if (clientTimezoneEl) {
        clientTimezoneEl.textContent = clientTimezone;
    }

    if (availabilityStatusEl) {
        const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

        if (!isOnline) {
            availabilityStatusEl.textContent = "I'm currently unavailable. I'll respond promptly once I'm back online.";
            availabilityStatusEl.className = "mt-2 text-sm font-medium text-red-600";
            return;
        }

        availabilityStatusEl.textContent = "I am currently online and will respond to your message shortly.";
        availabilityStatusEl.className = "mt-2 text-sm font-medium text-green-700";
    }
}

updateClientAvailability();
window.addEventListener("online", updateClientAvailability);
window.addEventListener("offline", updateClientAvailability);