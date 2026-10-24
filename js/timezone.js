(() => {
    const manilaFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "numeric",
        day: "numeric"
    });
    const hours = document.getElementById("clientAvailability");
    const timezone = document.getElementById("clientTimezone");
    const localAvailability = document.getElementById("clientLocalAvailability");
    const localTimezone = document.getElementById("clientLocalTimezone");
    const status = document.getElementById("availabilityStatus");
    const weekdayShiftStarts = new Set([1, 2, 3, 4, 5]);
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
    const localDateFormatter = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric"
    });
    const localTimeFormatter = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit"
    });
    const localZoneFormatter = new Intl.DateTimeFormat(undefined, {
        timeZoneName: "short"
    });

    if (hours) hours.textContent = "8:00 PM–5:00 AM";
    if (timezone) timezone.textContent = "Philippine Time (UTC+8)";

    function getManilaCalendarDate(date) {
        const parts = manilaFormatter.formatToParts(date);
        const value = type => Number(parts.find(part => part.type === type).value);
        return {
            year: value("year"),
            month: value("month"),
            day: value("day")
        };
    }

    function getShiftWindow(now) {
        const manilaDate = getManilaCalendarDate(now);
        const calendarDay = Date.UTC(manilaDate.year, manilaDate.month - 1, manilaDate.day);
        const shifts = [];

        for (let offset = -1; offset <= 7; offset += 1) {
            const shiftDate = new Date(calendarDay + offset * 86400000);
            if (!weekdayShiftStarts.has(shiftDate.getUTCDay())) continue;

            // Philippine time is UTC+8 year-round: 8:00 PM PHT equals 12:00 PM UTC.
            const start = new Date(Date.UTC(
                shiftDate.getUTCFullYear(),
                shiftDate.getUTCMonth(),
                shiftDate.getUTCDate(),
                12
            ));
            shifts.push({ start, end: new Date(start.getTime() + 9 * 60 * 60 * 1000) });
        }

        const active = shifts.find(shift => now >= shift.start && now < shift.end);
        return active || shifts.find(shift => shift.start > now);
    }

    function formatLocalShift(shift) {
        const startDate = localDateFormatter.format(shift.start);
        const endDate = localDateFormatter.format(shift.end);
        const startTime = localTimeFormatter.format(shift.start);
        const endTime = localTimeFormatter.format(shift.end);

        return startDate === endDate
            ? `${startDate} · ${startTime}–${endTime}`
            : `${startDate}, ${startTime}–${endDate}, ${endTime}`;
    }

    function formatDuration(milliseconds) {
        const totalMinutes = Math.max(1, Math.ceil(milliseconds / 60000));
        const days = Math.floor(totalMinutes / 1440);
        const hoursRemaining = Math.floor((totalMinutes % 1440) / 60);
        const minutesRemaining = totalMinutes % 60;
        const parts = [];

        if (days) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
        if (hoursRemaining) parts.push(`${hoursRemaining} ${hoursRemaining === 1 ? "hour" : "hours"}`);
        if (minutesRemaining && parts.length < 2) {
            parts.push(`${minutesRemaining} ${minutesRemaining === 1 ? "minute" : "minutes"}`);
        }

        return parts.slice(0, 2).join(" ");
    }

    function updateClientAvailability() {
        if (!status || !localAvailability || !localTimezone) return;
        const now = new Date();
        const shift = getShiftWindow(now);
        if (!shift) return;

        const available = now >= shift.start && now < shift.end;
        const target = available ? shift.end : shift.start;
        const zonePart = localZoneFormatter
            .formatToParts(shift.start)
            .find(part => part.type === "timeZoneName")?.value;

        localAvailability.textContent = formatLocalShift(shift);
        localTimezone.textContent = zonePart && zonePart !== localZone
            ? `${localZone} (${zonePart})`
            : localZone;
        status.textContent = available
            ? `Online now · ${formatDuration(target - now)} remaining`
            : `Offline now · Online in ${formatDuration(target - now)}`;
        status.className = available
            ? "availability-message availability-message--available"
            : "availability-message availability-message--unavailable";
    }

    updateClientAvailability();
    window.setInterval(() => {
        if (!document.hidden) updateClientAvailability();
    }, 30000);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) updateClientAvailability();
    });
    window.addEventListener("pageshow", updateClientAvailability);
})();
