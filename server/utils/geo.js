const Warehouse = require('../models/Warehouse');

// Haversine formula to calculate distance between two coordinates
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg) {
    return deg * (Math.PI / 180);
}

async function findNearestWarehouse(lat, lng) {
    const warehouses = await Warehouse.find({ status: 'active' });
    let nearest = null;
    let minDist = Infinity;

    for (const wh of warehouses) {
        // Warehouse Load Balancing: Skip if warehouse is full
        if (wh.capacity && wh.currentLoad >= wh.capacity) {
            continue;
        }

        const dist = haversineDistance(lat, lng, wh.location.lat, wh.location.lng);
        if (dist < minDist) {
            minDist = dist;
            nearest = wh;
        }
    }

    return { warehouse: nearest, distance: nearest ? Math.round(minDist * 100) / 100 : 0 };
}

function calculateDeliveryTime(warehouseLat, warehouseLng, userLat, userLng) {
    const distance = haversineDistance(warehouseLat, warehouseLng, userLat, userLng);
    // Assume 40km/h average speed for local delivery
    const hours = distance / 40;
    return Math.round(hours * 10) / 10;
}

function calculateCostSaving(originalDistance, localDistance) {
    const costPerKm = 2.5; // INR per km
    return Math.round((originalDistance - localDistance) * costPerKm);
}

module.exports = { haversineDistance, findNearestWarehouse, calculateDeliveryTime, calculateCostSaving };
