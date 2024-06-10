import type { tripObject } from "./@types";

export function removeDuplicates(arr: tripObject[]) {
    const seen = new Set();
    return arr.filter((trip) => {
        const prefix = trip.routeId
        if (seen.has(prefix)) {
            return false;
        } else {
            seen.add(prefix);
            return true;
        }
    });
}