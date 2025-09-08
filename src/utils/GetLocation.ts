import NodeGeocoder from "node-geocoder";

export async function GetLocation (lat: number, lon: number): Promise<{ lat: number; lon: number; address?: string }> {
    const geocoder = NodeGeocoder({ provider: "openstreetmap" });

    try {
        const result = await geocoder.reverse({ lat, lon });
        return {
            lat,
            lon,
            address: result[0]?.formattedAddress,
        };
    } catch (e) {
        // console.error("Geocoding failed:", e);
        console.log(e)
        return { lat, lon }; // fallback without address
    }
}