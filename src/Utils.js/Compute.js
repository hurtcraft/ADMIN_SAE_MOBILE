export function dist(a,b){
    return Math.sqrt( (a[0]*b[0])**2 +(a[1]*b[1])**2)
}


// Fonction pour trouver le point avec la plus petite coordonnée y (et le plus à gauche en cas d'égalité)
function lowestPoint(points) {
    return points.reduce((lowest, point) => {
        if (point[1] < lowest[1] || (point[1] === lowest[1] && point[0] < lowest[0])) {
            return point;
        }
        return lowest;
    }, points[0]);
}

// Fonction pour calculer l'angle entre le point de référence et un autre point
function polarAngle(p0, p1) {
    return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
}

// Fonction pour déterminer si trois points font un virage à gauche
function isCounterClockwise(p0, p1, p2) {
    return (p1[0] - p0[0]) * (p2[1] - p0[1]) > (p1[1] - p0[1]) * (p2[0] - p0[0]);
}

// Fonction pour calculer l'enveloppe convexe avec l'algorithme de Graham scan
export function grahamScan(points) {
    if(points.length === 0) {
        return points;
    }
    const start = lowestPoint(points);
    
    const sortedPoints = points.slice().sort((p1, p2) => {
        const angle1 = polarAngle(start, p1);
        const angle2 = polarAngle(start, p2);
        if (angle1 === angle2) {
            return dist(start, p2) - dist(start, p1);
        }
        return angle1 - angle2;
    });

    const hull = [start];
    
    for (const point of sortedPoints) {
        while (hull.length > 1 && !isCounterClockwise(hull[hull.length - 2], hull[hull.length - 1], point)) {
            hull.pop();
        }
        hull.push(point);
    }
    return hull;
}

