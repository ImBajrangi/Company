// Enhanced notification system with cooldown and duplicate prevention
const notificationSystem = {
    cooldown: false,
    cooldownTime: 1000, // Minimum time between notifications
    activeNotifications: new Set(),
    lastMessage: '',
    
    canShowNotification(message) {
        // Prevent exact duplicate messages
        if (this.lastMessage === message) {
            return false;
        }
        
        // Check cooldown
        if (this.cooldown) {
            return false;
        }
        
        return true;
    },
    
    setCooldown() {
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, this.cooldownTime);
    }
};

function showNotification(message, type = 'info', duration = 3000) {
    // Check if we can show the notification
    if (!notificationSystem.canShowNotification(message)) {
        return;
    }
    
    // Update last message and set cooldown
    notificationSystem.lastMessage = message;
    notificationSystem.setCooldown();
    
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Limit maximum number of visible notifications
    const maxNotifications = 3;
    const currentNotifications = notificationContainer.children;
    if (currentNotifications.length >= maxNotifications) {
        notificationContainer.removeChild(currentNotifications[0]);
    }
    
    // Define notification properties
    const notificationTypes = {
        info: { title: 'Information', icon: 'fa-info-circle', color: '#4a6fff' },
        success: { title: 'Success', icon: 'fa-check-circle', color: '#3ec74f' },
        error: { title: 'Error', icon: 'fa-exclamation-circle', color: '#ff5a6a' },
        warning: { title: 'Warning', icon: 'fa-exclamation-triangle', color: '#ffb347' }
    };
    
    const notifType = notificationTypes[type] || notificationTypes.info;
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.setProperty('--notification-color', notifType.color);
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${notifType.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notifType.title}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    // Add cosmic effects
    if (type === 'success' || type === 'error') {
        notification.classList.add('glow');
    }
    
    // Add to container with animation
    notificationContainer.appendChild(notification);
    
    // Track this notification
    const notificationId = Date.now();
    notificationSystem.activeNotifications.add(notificationId);
    
    // Animate in
    gsap.fromTo(notification, {
        x: 100,
        opacity: 0,
        scale: 0.8
    }, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
    
    // Add sound effect (only for significant notifications)
    if (type === 'error' || type === 'success') {
        playNotificationSound(type);
    }
    
    // Auto remove
    setTimeout(() => {
        // Only remove if it's still in our active set
        if (notificationSystem.activeNotifications.has(notificationId)) {
            notificationSystem.activeNotifications.delete(notificationId);
            
            gsap.to(notification, {
                x: 100,
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: "back.in(1.7)",
                onComplete: () => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }
            });
        }
    }, duration);
}