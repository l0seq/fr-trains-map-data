import terStops from "static/terStops.json"
import terRoutes from "static/terRoutesStops.json"
import type { geoJsonLineObject } from "@types"
import path from "path";
const staticPath = path.join(import.meta.dir, "..", "static")


const geoJSON: geoJsonLineObject[] = []


terRoutes.forEach((r, i) => {
    const coordinates: Array<number[]> = []
    r.routeStops.forEach((ro) => {
        const area = terStops.find((s) => {
            return s.properties.stop_points.includes(ro)
        })
        if (area) {
            coordinates.push(area.geometry.coordinates)
        }
    })
    geoJSON.push({
        geometry: {
            type: "LineString",
            coordinates: coordinates
        },
        properties: {
            id: r.routeId,
            name: r.routeShortId + " " + r.routeLongId,
        },
        type: "Feature"
    })
})


await Bun.write(staticPath + "/terRoutesStopsGeo.json", JSON.stringify(geoJSON))