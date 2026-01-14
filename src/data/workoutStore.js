// Temporary in-memory store (acts like backend)
export const workoutStore = {
    workouts: {},

    addWorkout(entry) {
        this.workouts[entry.date] = entry;
    },

    getWorkouts() {
        return this.workouts;
    },
};
