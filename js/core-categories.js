(() => {
    const row = document.querySelector('.core-categories');
    const trigger = row?.querySelector('button');
    const tooltip = document.getElementById('core-categories-tooltip');
    if (!trigger || !tooltip) return;

    let pinned = false;
    const show = (visible) => {
        tooltip.hidden = !visible;
        trigger.setAttribute('aria-expanded', String(visible));
    };
    const dismiss = () => {
        pinned = false;
        show(false);
    };

    row.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'touch') show(true);
    });
    row.addEventListener('pointerleave', () => {
        if (!pinned && document.activeElement !== trigger) show(false);
    });
    trigger.addEventListener('focus', () => show(true));
    trigger.addEventListener('blur', dismiss);
    trigger.addEventListener('click', () => {
        pinned = !pinned;
        show(pinned);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') dismiss();
    });
    document.addEventListener('pointerdown', (event) => {
        if (!row.contains(event.target)) dismiss();
    });
})();
