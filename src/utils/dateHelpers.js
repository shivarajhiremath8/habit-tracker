export function getMonthDays(year, month) {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
        days.push({
            date: date.toISOString().split("T")[0],
            day: date.getDate(),
        });
        date.setDate(date.getDate() + 1);
    }

    return days;
}
