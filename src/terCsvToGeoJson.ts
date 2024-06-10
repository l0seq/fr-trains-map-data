import { terFormat, type geoJsonObject } from "@types"
import path from "path";
const staticPath = path.join(import.meta.dir, "..", "static")

const terFile = Bun.file(staticPath + "/stops.txt")
const terArray = (await terFile.text()).split("\n").slice(1, -1)
const terJson: Array<geoJsonObject> = terArray.map((line) => {
    const parsedLine = line.split(",")
    if (parsedLine[terFormat.stopId].startsWith("StopArea")) {
        return {
            geometry: {
                coordinates: [
                    parseFloat(parsedLine[terFormat.stopLon]),
                    parseFloat(parsedLine[terFormat.stopLat])
                ],
                type: "Point"
            },
            properties: {
                id: parsedLine[terFormat.stopId],
                name: parsedLine[terFormat.stopName],
                stop_points: [],
            },
            type: "Feature"
        }
    }
    else {
        return {
            geometry: {
                coordinates: [
                    parseFloat(parsedLine[terFormat.stopLon]),
                    parseFloat(parsedLine[terFormat.stopLat])
                ],
                type: "Point"
            },
            properties: {
                id: parsedLine[terFormat.stopId],
                name: parsedLine[terFormat.stopName],
                parent_station: parsedLine[terFormat.parentStation]
            },
            type: "Feature"
        }
    }
})


terJson.filter((v) => {
    return v.properties.id.startsWith("StopPoint")
}).forEach((i) => {
    const areaId = terJson.findIndex((v) => {
        return v.properties.id === i.properties.parent_station
    })
    if (terJson[areaId].properties.stop_points) {
        terJson[areaId].properties.stop_points.push(i.properties.id)
    }
})
await Bun.write(staticPath + "/terStops.json", JSON.stringify(terJson.filter((a) => {
    return a.properties.id.startsWith("StopArea")
})))
console.log("End of conversion", terJson.length, "items")