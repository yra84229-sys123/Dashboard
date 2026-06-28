// Main UI Scripts
document.addEventListener("DOMContentLoaded", function () {
    // 1. Sidebar Collapse
    const sidebar = document.getElementById("sidebar");
    const collapseBtn = document.getElementById("collapse-btn");
    const mainContent = document.getElementById("main-content");

    // Load saved sidebar state
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
    if (isCollapsed) {
        sidebar.classList.add("collapsed");
    }

    collapseBtn.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        localStorage.setItem("sidebar-collapsed", sidebar.classList.contains("collapsed"));
    });

    // 2. Mobile Sidebar Toggle
    const menuToggle = document.getElementById("menu-toggle");

    menuToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        sidebar.classList.toggle("mobile-active");
        document.body.classList.toggle("sidebar-open");
    });

    // Close mobile sidebar when clicking outside
    document.addEventListener("click", function (e) {
        if (window.innerWidth <= 992) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove("mobile-active");
                document.body.classList.remove("sidebar-open");
            }
        }
    });

    // 3. Theme Toggle (Light / Dark Mode)
    const themeSwitch = document.getElementById("theme-switch");
    const themeLabel = document.querySelector(".theme-label");

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeSwitch.checked = false;
        updateThemeUI(true);
    } else {
        document.body.classList.remove("dark-theme");
        themeSwitch.checked = true;
        updateThemeUI(false);
    }

    themeSwitch.addEventListener("change", function () {
        const isDark = !this.checked; // checked means Light, unchecked means Dark
        if (isDark) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
            updateThemeUI(true);
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
            updateThemeUI(false);
        }

        // Call global chart update function if chart.js is loaded
        if (typeof updateChartsTheme === "function") {
            updateChartsTheme(isDark);
        }
    });

    function updateThemeUI(isDark) {
        if (isDark) {
            themeLabel.innerHTML = `<i class="fa-solid fa-moon icon-moon" style="color: #3b82f6;"></i> <span>Dark Mode</span>`;
        } else {
            themeLabel.innerHTML = `<i class="fa-solid fa-sun icon-sun" style="color: #f59e0b;"></i> <span>Light Mode</span>`;
        }
    }

    // 4. Dropdowns (Notifications & Profile)
    const notificationBtn = document.getElementById("notification-btn");
    const notificationDropdown = document.getElementById("notification-dropdown");
    const profileTrigger = document.getElementById("profile-trigger");
    const profileDropdown = document.getElementById("profile-dropdown");

    // Toggle Notification
    notificationBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllDropdowns();
        notificationDropdown.classList.toggle("show");
    });

    // Toggle Profile
    profileTrigger.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllDropdowns();
        profileDropdown.classList.toggle("show");
    });

    // Click outside to close dropdowns
    document.addEventListener("click", function () {
        closeAllDropdowns();
    });

    function closeAllDropdowns() {
        notificationDropdown.classList.remove("show");
        profileDropdown.classList.remove("show");
    }

    // Stop propagation inside dropdowns to prevent closing on clicking item
    notificationDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
    });
    profileDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Mark as read notifications
    const markReadBtn = document.querySelector(".mark-read");
    const badge = document.querySelector(".icon-btn .badge");
    if (markReadBtn) {
        markReadBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const unreadItems = document.querySelectorAll(".notification-item.unread");
            unreadItems.forEach(item => item.classList.remove("unread"));
            if (badge) badge.style.display = "none";
        });
    }

    // 5. Fullscreen Toggle
    const fullscreenBtn = document.getElementById("fullscreen-btn");

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", function () {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    // Update icon when fullscreen changes
    document.addEventListener("fullscreenchange", function () {
        if (fullscreenBtn) {
            const icon = fullscreenBtn.querySelector("i");
            if (icon) {
                if (document.fullscreenElement) {
                    icon.classList.remove("fa-expand");
                    icon.classList.add("fa-compress");
                } else {
                    icon.classList.remove("fa-compress");
                    icon.classList.add("fa-expand");
                }
            }
        }
    });

    // 6. Search Bar Table Filter (Index page specific)
    const searchInput = document.getElementById("search-input");
    const pagesTableRows = document.querySelectorAll("#pages-table tbody tr");
    const adminsTableRows = document.querySelectorAll("#admins-table tbody tr");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const filterText = this.value.toLowerCase().trim();

            // Filter Pages Table
            pagesTableRows.forEach(row => {
                const pageName = row.cells[0].textContent.toLowerCase();
                const owner = row.cells[3].textContent.toLowerCase();
                if (pageName.includes(filterText) || owner.includes(filterText)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });

            // Filter Admins Table
            adminsTableRows.forEach(row => {
                const adminName = row.cells[0].textContent.toLowerCase();
                if (adminName.includes(filterText)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    // 7. Interactive Filter Dropdown (Overview Chart - Index page specific)
    const overviewFilter = document.getElementById("overview-filter");
    if (overviewFilter) {
        overviewFilter.addEventListener("change", function () {
            const selectedDays = this.value;

            // Randomize chart data based on selected filter to show visual change
            if (window.overviewChartInstance) {
                let data1 = [];
                let data2 = [];
                let labels = [];

                if (selectedDays === "7") {
                    labels = ['Jun 19', 'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24', 'Jun 25'];
                    data1 = [80, 103, 85, 105, 100, 90, 108];
                    data2 = [35, 52, 42, 58, 50, 44, 53];
                } else if (selectedDays === "30") {
                    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    data1 = [320, 410, 390, 430];
                    data2 = [140, 190, 180, 210];
                } else if (selectedDays === "90") {
                    labels = ['Apr', 'May', 'Jun'];
                    data1 = [1200, 1450, 1580];
                    data2 = [580, 710, 820];
                }

                window.overviewChartInstance.data.labels = labels;
                window.overviewChartInstance.data.datasets[0].data = data1;
                window.overviewChartInstance.data.datasets[1].data = data2;
                window.overviewChartInstance.update();
            }
        });
    }
});
