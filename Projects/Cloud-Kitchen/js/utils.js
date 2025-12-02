/**
 * Utility Functions
 * Contains helper functions for UI interactions like Alerts and Toasts.
 */

let currentConfirmCallback = null;

export function initAlertSystem() {
    const alertModal = document.getElementById('alert-modal');
    const alertClose = document.getElementById('alert-close');
    const alertConfirmBtn = document.getElementById('alert-confirm');
    const alertCancelBtn = document.getElementById('alert-cancel');

    if (alertClose) alertClose.addEventListener('click', () => alertModal.classList.add('hidden'));
    if (alertCancelBtn) alertCancelBtn.addEventListener('click', () => alertModal.classList.add('hidden'));
    if (alertConfirmBtn) alertConfirmBtn.addEventListener('click', () => {
        if (typeof currentConfirmCallback === 'function') {
            currentConfirmCallback();
        }
        alertModal.classList.add('hidden');
        currentConfirmCallback = null;
    });
}

export const showAlert = (message, isError = false, confirmCallback = null) => {
    const alertModal = document.getElementById('alert-modal');
    const alertMessage = document.getElementById('alert-message');
    const alertIcon = document.getElementById('alert-icon');
    const alertClose = document.getElementById('alert-close');
    const alertConfirmBtn = document.getElementById('alert-confirm');
    const alertCancelBtn = document.getElementById('alert-cancel');

    if (!alertModal || !alertMessage) return;

    alertMessage.textContent = message;
    currentConfirmCallback = confirmCallback;

    if (confirmCallback) {
        alertIcon.innerHTML = `<svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
        alertIcon.className = `w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4`;
        alertClose.classList.add('hidden');
        alertConfirmBtn.classList.remove('hidden');
        alertCancelBtn.classList.remove('hidden');
    } else {
        alertIcon.innerHTML = isError
            ? `<svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
            : `<svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
        alertIcon.className = `w-14 h-14 ${isError ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`;
        alertClose.classList.remove('hidden');
        alertConfirmBtn.classList.add('hidden');
        alertCancelBtn.classList.add('hidden');
    }
    alertModal.classList.remove('hidden');
}

export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 transform transition-all duration-300 translate-x-full opacity-0`;

    let icon = '';
    if (type === 'success') icon = '<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>';
    else if (type === 'error') icon = '<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></div>';
    else icon = '<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg></div>';

    toast.innerHTML = `${icon}<div class="pl-4 text-sm font-normal">${message}</div>`;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (container.contains(toast)) container.removeChild(toast);
        }, 300);
    }, 5000);
}
