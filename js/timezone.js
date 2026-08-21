/* ========================================================= */
/* CLIENT TIMEZONE AVAILABILITY */
/* ========================================================= */

function updateClientAvailability() {

    // Detect client's timezone
    const clientTimezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;


    /*
     * Philippine working hours:
     *
     * 8:00 PM PHT = 12:00 PM UTC
     * 5:00 AM PHT = 9:00 PM UTC
     */

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


    // Convert 8:00 PM PHT to client's timezone
    const clientStart =
        new Intl.DateTimeFormat("en-US", {
            timeZone: clientTimezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(startUTC);


    // Convert 5:00 AM PHT to client's timezone
    const clientEnd =
        new Intl.DateTimeFormat("en-US", {
            timeZone: clientTimezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(endUTC);


    // Display availability
    document.getElementById(
        "clientAvailability"
    ).textContent =
        `${clientStart} – ${clientEnd}`;


    // Display timezone
    document.getElementById(
        "clientTimezone"
    ).textContent =
        clientTimezone;

}


updateClientAvailability();