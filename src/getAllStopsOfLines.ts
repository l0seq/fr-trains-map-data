
import { terRouteFormat, terStopTimeFormat, terTripsFormat, type routeObject, type tripObject } from "@types"
import { removeDuplicates } from "./utils";
import path from "path";
const staticPath = path.join(import.meta.dir, "..", "static")


const terRoutes = (await (await Bun.file(staticPath + "/routes.txt")).text()).split("\n").slice(1, -1)
const terTrips = (await (await Bun.file(staticPath + "/trips.txt")).text()).split("\n").slice(1, -1)
const terStopTimes = (await (await Bun.file(staticPath + "/stop_times.txt")).text()).split("\n").slice(1, -1)

const finalRoutesJson: Array<routeObject> = terRoutes.map((route) => {
    const parsedRoute = route.split(",")
    return {
        routeId: parsedRoute[terRouteFormat.routeId],
        routeShortId: parsedRoute[terRouteFormat.routeShortName],
        routeLongId: parsedRoute[terRouteFormat.routeLongName],
        routeColor: parsedRoute[terRouteFormat.routeColor],
        routeStops: []
    }
})

const finalTripsJson: Array<tripObject> = removeDuplicates(terTrips.map((trip) => {
    const parsedTrip = trip.split(",")
    return {
        routeId: parsedTrip[terTripsFormat.routeId],
        tripId: parsedTrip[terTripsFormat.tripId],
        directionId: parsedTrip[terTripsFormat.directionId]
    }
}))


finalRoutesJson.forEach((route) => {
    const routeTrip = finalTripsJson.find((trip) => {
        return trip.routeId == route.routeId
    })
    if (routeTrip) {
        terStopTimes.filter((stop) => {
            return stop.startsWith(routeTrip.tripId)
        }).forEach((a) => {
            const routeId = finalRoutesJson.findIndex((t) => {
                return t.routeId === route.routeId
            })
            finalRoutesJson[routeId].routeStops.push(a.split(",")[terStopTimeFormat.stopId])
        })

    }

})
Bun.write(staticPath + "/terRoutesStops.json", JSON.stringify(finalRoutesJson))
