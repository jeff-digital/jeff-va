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
        const now = new Date();
        const phtNow = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).formatToParts(now);

        const phtDay = phtNow.find((part) => part.type === "weekday")?.value;
        const phtHour = Number(phtNow.find((part) => part.type === "hour")?.value ?? 0);
        const phtMinute = Number(phtNow.find((part) => part.type === "minute")?.value ?? 0);
        const phtTime = phtHour * 60 + phtMinute;

        const businessDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
        const isBusinessDay = businessDays.includes(phtDay);
        const isOnlineInPht = isBusinessDay && (phtTime >= 20 * 60 || phtTime < 5 * 60);

        if (isOnlineInPht) {
            availabilityStatusEl.textContent = "You’re within my online hours right now.";
            availabilityStatusEl.className = "mt-2 text-sm font-medium text-green-700";
            return;
        }

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const currentDayIndex = days.indexOf(phtDay || "Sun");
        const nextBusinessStartDay = businessDays.includes(phtDay)
            ? currentDayIndex
            : ((currentDayIndex === 6 ? 1 : currentDayIndex + 1) % 7);

        let minutesUntilOnline = 0;

        if (businessDays.includes(phtDay)) {
            if (phtTime < 20 * 60 && phtTime >= 5 * 60) {
                minutesUntilOnline = (20 * 60) - phtTime;
            } else {
                minutesUntilOnline = (24 * 60) - phtTime + (20 * 60);
            }
        } else {
            const daysUntilNextBusiness = phtDay === "Sat" ? 2 : 1;
            minutesUntilOnline = (daysUntilNextBusiness * 24 * 60) - phtTime + (20 * 60);
        }

        const hoursUntilOnline = Math.max(1, Math.ceil(minutesUntilOnline / 60));
        const hourLabel = hoursUntilOnline === 1 ? "hour" : "hours";

        availabilityStatusEl.textContent = `I’ll be online in ${hoursUntilOnline} ${hourLabel}.`;
        availabilityStatusEl.className = "mt-2 text-sm font-medium text-gray-600";
    }
}

updateClientAvailability();