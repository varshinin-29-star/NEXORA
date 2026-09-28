/* =========================================================
   NEXORA - GLOBAL JAVASCRIPT
   AI AGENT OPERATIONS PLATFORM
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL CONFIG
   ========================================================= */

const NEXORA = {
    appName: "Nexora",
    version: "1.0.0",
    storage: {
        theme: "nexora_theme",
        loggedIn: "nexora_logged_in",
        email: "nexora_user_email",
        account: "nexora_account",
        selectedAgent: "selectedAgent",
        builder: "nexora_agent_builder"
    }
};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializePage();

    initializeNavigation();

    initializeTheme();

    initializeNotifications();

    initializeSearch();

    initializeCommandPalette();

    initializeMobileMenu();

    initializeButtons();

    initializeLiveClock();

    initializeUserData();

    initializePageTransitions();

    initializeOnlineStatus();

});


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

function initializePage() {

    document.body.classList.add("page-loaded");

    console.log(
        `%c${NEXORA.appName} v${NEXORA.version}`,
        "font-weight:bold;font-size:16px;color:#8b6cff;"
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    const navLinks =
        document.querySelectorAll(
            "a[href]"
        );

    navLinks.forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const cleanHref =
            href.split("#")[0]
                .split("?")[0]
                .toLowerCase();

        if (
            cleanHref === currentPage &&
            currentPage !== ""
        ) {

            link.classList.add("active");

        }

        link.addEventListener("click", () => {

            const target =
                link.getAttribute("href");

            if (
                target &&
                !target.startsWith("#") &&
                !target.startsWith("javascript:")
            ) {

                document.body.classList.add(
                    "page-exit"
                );

            }

        });

    });

}


/* =========================================================
   THEME
   ========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            NEXORA.storage.theme
        );

    if (savedTheme === "light") {

        document.body.classList.add(
            "light-theme"
        );

    }

    const themeButtons =
        document.querySelectorAll(
            "[data-theme]"
        );

    themeButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const theme =
                    button.dataset.theme;

                setTheme(theme);

            }
        );

    });

    const themeSelect =
        document.querySelector(
            "#themeSelect"
        );

    if (themeSelect) {

        themeSelect.value =
            savedTheme || "dark";

        themeSelect.addEventListener(
            "change",
            () => {

                setTheme(
                    themeSelect.value
                );

            }
        );

    }

}


function setTheme(theme) {

    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );

        localStorage.setItem(
            NEXORA.storage.theme,
            "light"
        );

    } else {

        document.body.classList.remove(
            "light-theme"
        );

        localStorage.setItem(
            NEXORA.storage.theme,
            "dark"
        );

    }

    nexoraToast(
        theme === "light"
            ? "Light mode enabled"
            : "Dark mode enabled",
        "success"
    );

}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function nexoraToast(
    message,
    type = "info",
    duration = 3000
) {

    let container =
        document.querySelector(
            ".nexora-toast-container"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "nexora-toast-container";

        container.style.position = "fixed";
        container.style.right = "24px";
        container.style.bottom = "24px";
        container.style.zIndex = "99999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "12px";

        document.body.appendChild(
            container
        );

    }

    const toast =
        document.createElement("div");

    toast.className =
        `nexora-toast nexora-toast-${type}`;

    const icons = {
        success: "✓",
        error: "!",
        warning: "⚠",
        info: "i"
    };

    toast.innerHTML = `
        <span class="nexora-toast-icon">
            ${icons[type] || "i"}
        </span>

        <span class="nexora-toast-message">
            ${escapeHTML(message)}
        </span>

        <button
            class="nexora-toast-close"
            type="button"
            aria-label="Close notification"
        >
            ×
        </button>
    `;

    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "10px";
    toast.style.padding = "13px 16px";
    toast.style.borderRadius = "14px";
    toast.style.background = "#111827";
    toast.style.color = "#f5f7ff";
    toast.style.border =
        "1px solid rgba(255,255,255,.1)";
    toast.style.boxShadow =
        "0 20px 50px rgba(0,0,0,.35)";
    toast.style.minWidth = "260px";
    toast.style.maxWidth = "420px";
    toast.style.animation =
        "nexoraToastIn .25s ease";

    container.appendChild(toast);

    const close =
        toast.querySelector(
            ".nexora-toast-close"
        );

    close.addEventListener(
        "click",
        () => removeToast(toast)
    );

    setTimeout(
        () => removeToast(toast),
        duration
    );

}


/* =========================================================
   REMOVE TOAST
   ========================================================= */

function removeToast(toast) {

    if (!toast) return;

    toast.style.opacity = "0";
    toast.style.transform =
        "translateY(10px)";

    setTimeout(() => {

        if (toast.parentNode) {

            toast.parentNode.removeChild(
                toast
            );

        }

    }, 200);

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function initializeNotifications() {

    const notificationButtons =
        document.querySelectorAll(
            ".notification-btn, [data-notifications]"
        );

    notificationButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleNotificationPanel(
                    button
                );

            }
        );

    });

}


function toggleNotificationPanel(button) {

    let panel =
        document.querySelector(
            ".nexora-notification-panel"
        );

    if (panel) {

        panel.remove();

        return;

    }

    panel =
        document.createElement("div");

    panel.className =
        "nexora-notification-panel";

    panel.innerHTML = `
        <div class="notification-header">
            <strong>Notifications</strong>
            <button
                type="button"
                class="notification-mark-read"
            >
                Mark all read
            </button>
        </div>

        <div class="notification-item">
            <span class="notification-dot success"></span>
            <div>
                <strong>Agent completed</strong>
                <p>Research Agent completed a task.</p>
                <small>2 min ago</small>
            </div>
        </div>

        <div class="notification-item">
            <span class="notification-dot warning"></span>
            <div>
                <strong>Approval required</strong>
                <p>A workflow is waiting for approval.</p>
                <small>8 min ago</small>
            </div>
        </div>

        <div class="notification-item">
            <span class="notification-dot error"></span>
            <div>
                <strong>Execution failed</strong>
                <p>Data Sync Agent needs attention.</p>
                <small>18 min ago</small>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    const rect =
        button.getBoundingClientRect();

    panel.style.position = "fixed";
    panel.style.top =
        `${rect.bottom + 10}px`;
    panel.style.right =
        `${Math.max(16, window.innerWidth - rect.right)}px`;
    panel.style.width = "340px";
    panel.style.maxWidth =
        "calc(100vw - 32px)";
    panel.style.background = "#111827";
    panel.style.border =
        "1px solid rgba(255,255,255,.1)";
    panel.style.borderRadius = "18px";
    panel.style.padding = "16px";
    panel.style.zIndex = "9999";
    panel.style.boxShadow =
        "0 25px 70px rgba(0,0,0,.4)";

    const markRead =
        panel.querySelector(
            ".notification-mark-read"
        );

    markRead.addEventListener(
        "click",
        () => {

            panel.querySelectorAll(
                ".notification-dot"
            ).forEach(dot => {

                dot.style.opacity = ".35";

            });

            nexoraToast(
                "All notifications marked as read",
                "success"
            );

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

function initializeSearch() {

    const searchInputs =
        document.querySelectorAll(
            ".global-search input, #globalSearch, .search-input"
        );

    searchInputs.forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Enter")
                    return;

                const value =
                    input.value
                        .trim()
                        .toLowerCase();

                if (!value) return;

                performGlobalSearch(value);

            }
        );

    });

}


function performGlobalSearch(query) {

    const routes = {

        dashboard: "index.html",
        home: "index.html",

        agent: "agents.html",
        agents: "agents.html",

        profile: "agent-profile.html",

        builder: "agent-builder.html",

        workflow: "workflows.html",
        workflows: "workflows.html",

        task: "tasks.html",
        tasks: "tasks.html",
        queue: "tasks.html",

        approval: "approvals.html",
        approvals: "approvals.html",

        activity: "activity.html",
        logs: "activity.html",

        execution: "executions.html",
        executions: "executions.html",
        history: "executions.html",

        analytics: "analytics.html",
        reports: "analytics.html",

        settings: "settings.html"
    };

    let destination = null;

    for (const key in routes) {

        if (query.includes(key)) {

            destination = routes[key];

            break;

        }

    }

    if (destination) {

        window.location.href =
            destination;

    } else {

        nexoraToast(
            `Searching for "${query}"...`,
            "info"
        );

    }

}


/* =========================================================
   COMMAND PALETTE
   ========================================================= */

function initializeCommandPalette() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openCommandPalette();

            }

            if (
                event.key === "Escape"
            ) {

                closeCommandPalette();

            }

        }
    );

}


function openCommandPalette() {

    let palette =
        document.querySelector(
            ".nexora-command-palette"
        );

    if (palette) {

        palette.classList.add("open");

        const input =
            palette.querySelector(
                ".command-search"
            );

        if (input) input.focus();

        return;

    }

    palette =
        document.createElement("div");

    palette.className =
        "nexora-command-palette open";

    palette.innerHTML = `
        <div class="command-overlay"></div>

        <div class="command-box">

            <div class="command-top">

                <span>⌘</span>

                <input
                    class="command-search"
                    type="text"
                    placeholder="Search Nexora..."
                    autocomplete="off"
                >

                <kbd>ESC</kbd>

            </div>

            <div class="command-list">

                <button data-command="dashboard">
                    <span>⌂</span>
                    Dashboard
                </button>

                <button data-command="agents">
                    <span>◉</span>
                    AI Agents
                </button>

                <button data-command="builder">
                    <span>＋</span>
                    Agent Builder
                </button>

                <button data-command="workflows">
                    <span>⌁</span>
                    Workflows
                </button>

                <button data-command="tasks">
                    <span>☷</span>
                    Task Queue
                </button>

                <button data-command="approvals">
                    <span>✓</span>
                    Approvals
                </button>

                <button data-command="executions">
                    <span>↻</span>
                    Execution History
                </button>

                <button data-command="analytics">
                    <span>◫</span>
                    Analytics
                </button>

                <button data-command="settings">
                    <span>⚙</span>
                    Settings
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(
        palette
    );

    const input =
        palette.querySelector(
            ".command-search"
        );

    const overlay =
        palette.querySelector(
            ".command-overlay"
        );

    input.focus();

    input.addEventListener(
        "input",
        () => {

            const search =
                input.value
                    .toLowerCase()
                    .trim();

            palette
                .querySelectorAll(
                    ".command-list button"
                )
                .forEach(button => {

                    const text =
                        button.textContent
                            .toLowerCase();

                    button.style.display =
                        text.includes(search)
                            ? "flex"
                            : "none";

                });

        }
    );

    palette
        .querySelectorAll(
            ".command-list button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    executeCommand(
                        button.dataset.command
                    );

                }
            );

        });

    overlay.addEventListener(
        "click",
        closeCommandPalette
    );

}


function closeCommandPalette() {

    const palette =
        document.querySelector(
            ".nexora-command-palette"
        );

    if (!palette) return;

    palette.classList.remove(
        "open"
    );

}


function executeCommand(command) {

    const routes = {

        dashboard: "index.html",
        agents: "agents.html",
        builder: "agent-builder.html",
        workflows: "workflows.html",
        tasks: "tasks.html",
        approvals: "approvals.html",
        executions: "executions.html",
        analytics: "analytics.html",
        settings: "settings.html"

    };

    if (routes[command]) {

        window.location.href =
            routes[command];

    }

}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function initializeMobileMenu() {

    const menuButtons =
        document.querySelectorAll(
            ".mobile-menu-btn, [data-mobile-menu]"
        );

    menuButtons.forEach(button => {

        button.addEventListener(
            "click",
            toggleMobileSidebar
        );

    });

}


function toggleMobileSidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );

    if (!sidebar) return;

    sidebar.classList.toggle(
        "mobile-open"
    );

    document.body.classList.toggle(
        "sidebar-open"
    );

}


/* =========================================================
   GLOBAL BUTTONS
   ========================================================= */

function initializeButtons() {

    document.addEventListener(
        "click",
        event => {

            const runButton =
                event.target.closest(
                    "[data-run-agent]"
                );

            if (runButton) {

                runAgent(
                    runButton.dataset.runAgent
                );

            }

            const pauseButton =
                event.target.closest(
                    "[data-pause-agent]"
                );

            if (pauseButton) {

                pauseAgent(
                    pauseButton.dataset.pauseAgent
                );

            }

            const copyButton =
                event.target.closest(
                    "[data-copy]"
                );

            if (copyButton) {

                copyToClipboard(
                    copyButton.dataset.copy
                );

            }

        }
    );

}


/* =========================================================
   RUN AGENT
   ========================================================= */

function runAgent(agentName = "AI Agent") {

    nexoraToast(
        `${agentName} started successfully`,
        "success"
    );

    const buttons =
        document.querySelectorAll(
            "[data-run-agent]"
        );

    buttons.forEach(button => {

        button.disabled = true;

        const original =
            button.innerHTML;

        button.dataset.originalText =
            original;

        button.innerHTML =
            "Running...";

        setTimeout(() => {

            button.disabled = false;

            button.innerHTML =
                button.dataset.originalText ||
                "Run";

        }, 1800);

    });

}


/* =========================================================
   PAUSE AGENT
   ========================================================= */

function pauseAgent(agentName = "AI Agent") {

    nexoraToast(
        `${agentName} has been paused`,
        "warning"
    );

}


/* =========================================================
   WORKFLOW RUN
   ========================================================= */

function runWorkflow(workflowName = "Workflow") {

    nexoraToast(
        `${workflowName} execution started`,
        "success"
    );

}


/* =========================================================
   CONFIRMATION
   ========================================================= */

function nexoraConfirm(
    message,
    onConfirm
) {

    const result =
        window.confirm(message);

    if (result && typeof onConfirm === "function") {

        onConfirm();

    }

}


/* =========================================================
   COPY TO CLIPBOARD
   ========================================================= */

async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(
            text
        );

        nexoraToast(
            "Copied to clipboard",
            "success"
        );

    } catch (error) {

        nexoraToast(
            "Unable to copy",
            "error"
        );

    }

}


/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

function saveNexoraData(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error(
            "Nexora storage error:",
            error
        );

    }

}


function getNexoraData(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {

            return fallback;

        }

        return JSON.parse(value);

    } catch (error) {

        return fallback;

    }

}


function removeNexoraData(key) {

    localStorage.removeItem(key);

}


/* =========================================================
   USER DATA
   ========================================================= */

function initializeUserData() {

    const email =
        localStorage.getItem(
            NEXORA.storage.email
        );

    if (!email) return;

    const userEmailElements =
        document.querySelectorAll(
            "[data-user-email]"
        );

    userEmailElements.forEach(
        element => {

            element.textContent =
                email;

        }
    );

    const account =
        getNexoraData(
            NEXORA.storage.account
        );

    if (account) {

        const name =
            [
                account.firstName,
                account.lastName
            ]
            .filter(Boolean)
            .join(" ");

        document
            .querySelectorAll(
                "[data-user-name]"
            )
            .forEach(
                element => {

                    element.textContent =
                        name ||
                        "Nexora User";

                }
            );

    }

}


/* =========================================================
   LIVE CLOCK
   ========================================================= */

function initializeLiveClock() {

    const clocks =
        document.querySelectorAll(
            "[data-live-clock]"
        );

    if (!clocks.length) return;

    function updateClock() {

        const now =
            new Date();

        const time =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        clocks.forEach(
            clock => {

                clock.textContent =
                    time;

            }
        );

    }

    updateClock();

    setInterval(
        updateClock,
        30000
    );

}


/* =========================================================
   PAGE TRANSITIONS
   ========================================================= */

function initializePageTransitions() {

    const style =
        document.createElement("style");

    style.textContent = `
        @keyframes nexoraToastIn {
            from {
                opacity: 0;
                transform: translateY(12px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .page-loaded {
            animation: nexoraPageIn .35s ease;
        }

        @keyframes nexoraPageIn {
            from {
                opacity: 0;
                transform: translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .page-exit {
            opacity: .65;
        }

        .nexora-command-palette {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 99998;
        }

        .nexora-command-palette.open {
            display: block;
        }

        .command-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,.65);
            backdrop-filter: blur(8px);
        }

        .command-box {
            position: absolute;
            top: 14vh;
            left: 50%;
            transform: translateX(-50%);
            width: min(620px, calc(100vw - 30px));
            background: #101522;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 30px 100px rgba(0,0,0,.5);
        }

        .command-top {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .command-search {
            flex: 1;
            border: 0;
            outline: 0;
            background: transparent;
            color: #fff;
            font-size: 15px;
        }

        .command-top kbd {
            padding: 4px 8px;
            border-radius: 7px;
            background: rgba(255,255,255,.08);
            color: #8b94a7;
            font-size: 11px;
        }

        .command-list {
            padding: 8px;
            max-height: 430px;
            overflow-y: auto;
        }

        .command-list button {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px 14px;
            border: 0;
            border-radius: 10px;
            background: transparent;
            color: #f5f7ff;
            text-align: left;
            cursor: pointer;
            font-size: 14px;
        }

        .command-list button:hover {
            background: rgba(139,108,255,.14);
        }

        .nexora-notification-panel {
            color: #f5f7ff;
        }

        .notification-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .notification-mark-read {
            border: 0;
            background: transparent;
            color: #9b87ff;
            cursor: pointer;
            font-size: 11px;
        }

        .notification-item {
            display: flex;
            gap: 10px;
            padding: 12px 4px;
            border-top: 1px solid rgba(255,255,255,.06);
        }

        .notification-item p {
            margin: 4px 0;
            color: #8b94a7;
            font-size: 12px;
        }

        .notification-item small {
            color: #5f697b;
            font-size: 10px;
        }

        .notification-dot {
            width: 8px;
            height: 8px;
            min-width: 8px;
            margin-top: 6px;
            border-radius: 50%;
        }

        .notification-dot.success {
            background: #43dfa0;
        }

        .notification-dot.warning {
            background: #ffb65f;
        }

        .notification-dot.error {
            background: #ff6678;
        }

        .nexora-toast-success .nexora-toast-icon {
            color: #43dfa0;
        }

        .nexora-toast-error .nexora-toast-icon {
            color: #ff6678;
        }

        .nexora-toast-warning .nexora-toast-icon {
            color: #ffb65f;
        }

        .nexora-toast-info .nexora-toast-icon {
            color: #42c8ff;
        }

        .nexora-toast-close {
            margin-left: auto;
            border: 0;
            background: transparent;
            color: #8b94a7;
            cursor: pointer;
            font-size: 18px;
        }

        @media (max-width: 600px) {

            .nexora-toast-container {
                right: 12px !important;
                left: 12px !important;
                bottom: 12px !important;
            }

            .nexora-toast {
                min-width: auto !important;
                width: 100%;
            }

            .command-box {
                top: 8vh;
            }

        }
    `;

    document.head.appendChild(
        style
    );

}


/* =========================================================
   ONLINE / OFFLINE STATUS
   ========================================================= */

function initializeOnlineStatus() {

    window.addEventListener(
        "online",
        () => {

            nexoraToast(
                "Connection restored",
                "success"
            );

        }
    );

    window.addEventListener(
        "offline",
        () => {

            nexoraToast(
                "You are offline",
                "warning"
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* =========================================================
   LOGOUT
   ========================================================= */

function nexoraLogout() {

    localStorage.removeItem(
        NEXORA.storage.loggedIn
    );

    localStorage.removeItem(
        NEXORA.storage.email
    );

    nexoraToast(
        "Signed out successfully",
        "success"
    );

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 700);

}


/* =========================================================
   GLOBAL WINDOW EXPORTS
   ========================================================= */

window.NEXORA = NEXORA;

window.nexoraToast =
    nexoraToast;

window.nexoraConfirm =
    nexoraConfirm;

window.runAgent =
    runAgent;

window.pauseAgent =
    pauseAgent;

window.runWorkflow =
    runWorkflow;

window.copyToClipboard =
    copyToClipboard;

window.saveNexoraData =
    saveNexoraData;

window.getNexoraData =
    getNexoraData;

window.removeNexoraData =
    removeNexoraData;

window.nexoraLogout =
    nexoraLogout;

window.setTheme =
    setTheme;


/* =========================================================
   END
   ========================================================= */