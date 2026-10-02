function updateClientAvailability() {
    const ownerTimezone = "Asia/Manila";
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    const phTimeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: ownerTimezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const phTimeParts = phTimeFormatter.formatToParts(now);
    const phHour = Number(phTimeParts.find(part => part.type === "hour")?.value || 0);
    const phMinute = Number(phTimeParts.find(part => part.type === "minute")?.value || 0);
    const phTotalMinutes = phHour * 60 + phMinute;
    const isOwnerAvailable = phTotalMinutes >= 20 * 60 || phTotalMinutes < 6 * 60;

    const clientAvailability = document.getElementById("clientAvailability");
    const clientTimezoneEl = document.getElementById("clientTimezone");
    const availabilityStatusEl = document.getElementById("availabilityStatus");

    if (clientAvailability) {
        clientAvailability.textContent = "8:00 PM – 6:00 AM (Philippines Time)";
    }

    if (clientTimezoneEl) {
        clientTimezoneEl.textContent = ownerTimezone;
    }

    if (availabilityStatusEl) {
        const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

        if (!isOnline || isWeekend || !isOwnerAvailable) {
            const offlineMessage = isWeekend
                ? "I'm currently offline because it's the weekend. I'll respond when I'm back online."
                : !isOwnerAvailable
                    ? "I’m currently offline outside my available hours in the Philippines. Feel free to leave me a message, and I’ll get back to you as soon as possible once I’m back online."
                    : "I'm currently unavailable. I'll respond as soon as I'm online again.";

            availabilityStatusEl.textContent = offlineMessage;
            availabilityStatusEl.className = "mt-2 text-sm font-medium text-red-600";
            return;
        }

        availabilityStatusEl.textContent = "I'm currently online and available for messages in the Philippines time zone.";
        availabilityStatusEl.className = "mt-2 text-sm font-medium text-green-700";
    }
}

updateClientAvailability();
window.addEventListener("online", updateClientAvailability);
window.addEventListener("offline", updateClientAvailability);