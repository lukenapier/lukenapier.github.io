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

    const setupMiningArea = () => {
        const miningPanel = document.getElementById('mining');
        if (!miningPanel) {
            return;
        }

        const nodeButtons = Array.from(miningPanel.querySelectorAll('.mine-node'));
        if (!nodeButtons.length) {
            return;
        }

        const detailElements = {
            name: miningPanel.querySelector('[data-mining-detail="name"]'),
            zone: miningPanel.querySelector('[data-mining-detail="zone"]'),
            description: miningPanel.querySelector('[data-mining-detail="description"]'),
            xp: miningPanel.querySelector('[data-mining-detail="xp"]'),
            resource: miningPanel.querySelector('[data-mining-detail="resource"]'),
            time: miningPanel.querySelector('[data-mining-detail="time"]'),
            status: miningPanel.querySelector('[data-mining-detail="status"]'),
        };

        const progressContainer = miningPanel.querySelector('.mine-progress');
        const progressBar = miningPanel.querySelector('.mine-progress .progress-bar');
        const startButton = miningPanel.querySelector('.mine-start');
        const logList = miningPanel.querySelector('.mine-log');

        let selectedNode = nodeButtons.find((button) => button.classList.contains('active')) || nodeButtons[0];
        let miningFrame = null;
        let miningDuration = 0;
        let miningStart = 0;

        const formatSeconds = (value) => {
            const numeric = Number(value);
            if (!Number.isFinite(numeric) || numeric <= 0) {
                return 'Instant';
            }
            return Number.isInteger(numeric) ? `${numeric}s` : `${numeric.toFixed(1)}s`;
        };

        const updateStatus = (message) => {
            if (detailElements.status) {
                detailElements.status.textContent = message;
            }
        };

        const updateProgress = (percentage) => {
            if (!progressBar || !progressContainer) {
                return;
            }
            const safePercentage = Math.max(0, Math.min(100, percentage));
            progressBar.style.width = `${safePercentage}%`;
            progressContainer.setAttribute('aria-valuenow', String(Math.round(safePercentage)));
            progressContainer.setAttribute('aria-valuetext', `${Math.round(safePercentage)} percent`);
        };

        const updateDetails = (node) => {
            if (!node) {
                return;
            }

            if (detailElements.name) {
                detailElements.name.textContent = node.dataset.node || node.textContent.trim();
            }
            if (detailElements.zone) {
                const zone = node.dataset.zone || 'Unknown Vein';
                const level = node.dataset.level ? ` • Recommended Level ${node.dataset.level}` : '';
                detailElements.zone.textContent = `${zone}${level}`;
            }
            if (detailElements.description) {
                detailElements.description.textContent = node.dataset.description || '';
            }
            if (detailElements.xp) {
                detailElements.xp.textContent = node.dataset.xp || '—';
            }
            if (detailElements.resource) {
                detailElements.resource.textContent = node.dataset.resource || '—';
            }
            if (detailElements.time) {
                detailElements.time.textContent = formatSeconds(node.dataset.time);
            }
        };

        const resetProgress = () => {
            updateProgress(0);
            if (startButton) {
                startButton.disabled = false;
                startButton.textContent = 'Start Mining';
            }
            updateStatus('Ready to swing your pickaxe.');
        };

        const selectNode = (node) => {
            if (!node || node === selectedNode || miningFrame) {
                return;
            }
            nodeButtons.forEach((button) => {
                button.classList.toggle('active', button === node);
            });
            selectedNode = node;
            updateDetails(node);
            resetProgress();
        };

        const addLogEntry = (node) => {
            if (!logList) {
                return;
            }
            const entry = document.createElement('li');
            const timestamp = document.createElement('time');
            const now = new Date();
            timestamp.dateTime = now.toISOString();
            timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const summary = document.createElement('span');
            const resource = node.dataset.resource || 'Unknown loot';
            const xp = node.dataset.xp || '';
            summary.textContent = `${resource} • ${xp}`;
            entry.append(timestamp, summary);
            logList.prepend(entry);
            const maxEntries = 6;
            while (logList.children.length > maxEntries) {
                logList.removeChild(logList.lastElementChild);
            }
        };

        const finishMining = () => {
            miningFrame = null;
            miningStart = 0;
            updateProgress(100);
            if (startButton) {
                startButton.disabled = false;
                startButton.textContent = 'Start Mining';
            }
            addLogEntry(selectedNode);
            const nodeName = selectedNode.dataset.node || 'the vein';
            const resource = selectedNode.dataset.resource || 'loot';
            const xp = selectedNode.dataset.xp || ''; 
            const xpText = xp ? ` and gained ${xp}` : '';
            updateStatus(`You mined ${resource} from ${nodeName}${xpText ? `${xpText}.` : '.'}`);
        };

        const step = (timestamp) => {
            if (!miningStart) {
                miningStart = timestamp;
            }
            const elapsed = timestamp - miningStart;
            const progress = Math.min(1, elapsed / miningDuration);
            updateProgress(progress * 100);

            if (progress >= 1) {
                finishMining();
                return;
            }
            miningFrame = window.requestAnimationFrame(step);
        };

        const startMining = () => {
            if (!selectedNode || miningFrame) {
                updateStatus('You are already mining...');
                return;
            }
            const cycleTime = Number(selectedNode.dataset.time) || 6;
            miningDuration = Math.max(1000, cycleTime * 1000);
            miningStart = 0;
            updateProgress(0);
            updateStatus('Swinging your pickaxe...');
            if (startButton) {
                startButton.disabled = true;
                startButton.textContent = 'Mining...';
            }
            miningFrame = window.requestAnimationFrame(step);
        };

        nodeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                selectNode(button);
            });
            button.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') {
                    return;
                }
                event.preventDefault();
                selectNode(button);
            });
        });

        if (startButton) {
            startButton.addEventListener('click', startMining);
        }

        updateDetails(selectedNode);
        resetProgress();
    };

    setupMiningArea();
});
