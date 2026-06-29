// Format currency (TZS default)
export function formatCurrency(amount) {
    if (isNaN(amount)) return 'TZS 0.00';
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
    }).format(amount);
}

// Format date
export function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-TZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
