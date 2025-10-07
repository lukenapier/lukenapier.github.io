document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
    const skillPanels = Array.from(document.querySelectorAll('.panel[data-panel="skill"]'));

    if (!tabButtons.length || !skillPanels.length) {
        return;
    }

    const activateTab = (targetId) => {
        const targetPanel = skillPanels.find((panel) => panel.id === targetId);
        if (!targetPanel) {
            return;
        }

        tabButtons.forEach((button) => {
            const isActive = button.dataset.tab === targetId;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-selected', String(isActive));
        });

        skillPanels.forEach((panel) => {
            panel.classList.toggle('active', panel.id === targetId);
        });

        history.replaceState(null, '', `#${targetId}`);
    };

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.tab);
        });

        button.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
                return;
            }
            event.preventDefault();
            const currentIndex = tabButtons.indexOf(button);
            const offset = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (currentIndex + offset + tabButtons.length) % tabButtons.length;
            const nextButton = tabButtons[nextIndex];
            nextButton.focus();
            activateTab(nextButton.dataset.tab);
        });
    });

    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && skillPanels.some((panel) => panel.id === initialHash)) {
        activateTab(initialHash);
    } else {
        const activeButton = tabButtons.find((button) => button.classList.contains('active'));
        if (activeButton) {
            activateTab(activeButton.dataset.tab);
        } else {
            activateTab(skillPanels[0].id);
        }
    }
});
