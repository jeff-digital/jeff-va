(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    });
    const hours = document.getElementById("clientAvailability");
    const timezone = document.getElementById("clientTimezone");
    const status = document.getElementById("availabilityStatus");
    if (hours) hours.textContent = "Daily · 8:00 PM – 5:00 AM next day";
    if (timezone) timezone.textContent = "Philippine Time (UTC+8)";
    let previousAvailability;

    function updateClientAvailability() {
        if (!status) return;
        const parts = formatter.formatToParts(new Date());
        const hour = Number(parts.find(part => part.type === "hour").value);
        const minute = Number(parts.find(part => part.type === "minute").value);
        const minutes = hour * 60 + minute;
        const available = minutes >= 20 * 60 || minutes < 5 * 60;
        if (available === previousAvailability) return;
        previousAvailability = available;
        status.textContent = available
            ? "Within my working hours — available for messages."
            : "Outside my working hours. Leave a message and I’ll respond during my next shift, starting at 8:00 PM Philippine time.";
        status.className = available
            ? "availability-message availability-message--available"
            : "availability-message availability-message--unavailable";
    }

    updateClientAvailability();
    window.setInterval(() => {
        if (!document.hidden) updateClientAvailability();
    }, 15000);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) updateClientAvailability();
    });
    window.addEventListener("pageshow", updateClientAvailability);
})();
