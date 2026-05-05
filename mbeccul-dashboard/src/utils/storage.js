// src/utils/storage.js
const STORAGE_KEY = 'mbeccul_data';
export function loadState() {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        return serialized ? JSON.parse(serialized) : null;
    } catch {
        return null;
    }
}
export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.error('Could not save state:', err);
    }
}
export function clearState() {
    localStorage.removeItem(STORAGE_KEY);
}