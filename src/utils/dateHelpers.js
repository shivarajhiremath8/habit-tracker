function formatLocalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getMonthDays(year, month) {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
        days.push({
            date: formatLocalDate(date), // ✅ local-safe
            day: date.getDate(),
        });

        date.setDate(date.getDate() + 1);
    }

    return days;
}
