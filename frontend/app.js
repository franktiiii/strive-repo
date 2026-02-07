const API_URL = window.APP_CONFIG?.apiUrl || "/api/visitor";

async function updateVisitorCount() {
    const el = document.getElementById("visitor-count");
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        el.textContent = data.visitor_count;
    } catch (error) {
        console.error("Failed to fetch visitor count:", error);
        el.textContent = "unavailable";
    }
}

document.addEventListener("DOMContentLoaded", updateVisitorCount);
