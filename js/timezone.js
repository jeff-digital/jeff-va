function updateClientAvailability() {
    const clientTimezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

    const startUTC = new Date();
    startUTC.setUTCHours(
        12,
        0,
        0,
        0
    );
    const endUTC = new Date();
    endUTC.setUTCHours(
        21,
        0,
        0,
        0
    );

    const clientStart =
        new Intl.DateTimeFormat("en-US", {
            timeZone: clientTimezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(startUTC);
        
    const clientEnd =
        new Intl.DateTimeFormat("en-US", {
            timeZone: clientTimezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(endUTC);
        
        document.getElementById(
            "clientAvailability"
        ).textContent =
            `${clientStart} – ${clientEnd}`;
        
        document.getElementById(
            "clientTimezone"
        ).textContent =
            clientTimezone;
    }

updateClientAvailability();