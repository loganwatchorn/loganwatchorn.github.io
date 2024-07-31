const luminosity_sqrt = Math.sqrt(luminosity);
function smoothstep(x1, x2, p) {
    return (x1 + x2) * p + Math.min(x1, x2);
}
function normalRandom(mean, sd) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * sd + mean;
}
function uniformRandom(lowerBound, upperBound) {
    return Math.random() * (upperBound - lowerBound) + lowerBound;
}
function lorentz_dt(vx, vy) {
    var vSq = vx * vx + vy * vy;
    var vMaxSq = vMax * vMax;
    if (vSq >= vMaxSq) return dtMin;
    return Math.sqrt(1 - vSq / vMaxSq);
}

var yMax, yMin, xMax, xMin;
function updatePlaneSize() {
    var visibleHeight = 2 * Math.tan(camera.fov * Math.PI / 360) * camera.position.z;
    var visibleWidth = visibleHeight * window.innerWidth / window.innerHeight;

    yMax = visibleHeight / 2;
    yMin = -yMax;
    xMax = visibleWidth / 2;
    xMin = -xMax;
}


// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 101);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

updatePlaneSize();


// Circle rendering functions
function getCircleGeometry(circleRadius) {
    var numTriangles;
    if (circleRadius < 0.1) numTriangles = 4;
    else if (circleRadius < 0.2) numTriangles = 8;
    else if (circleRadius < 1) numTriangles = 16;
    else numTriangles = 32;

    return new THREE.CircleGeometry(circleRadius, numTriangles);
}
function updateCircle(i) {
    if (b[i].m == 0) {
        if (b[i].circle) {
            scene.remove(b[i].circle);
            b[i].circle.geometry.dispose();
            b[i].circle.material.dispose();
            b[i].circle = null;
        }
    } else {
        if (b[i].circle) {
            b[i].circle.position.x = b[i].x;
            b[i].circle.position.y = b[i].y;
            if (b[i].circle.geometry.parameters.radius !== b[i].r) {
                b[i].circle.geometry.dispose();
                b[i].circle.geometry = getCircleGeometry(b[i].r * luminosity_sqrt);
            }
        } else {
            b[i].circle = new THREE.Mesh(
                getCircleGeometry(b[i].r * luminosity_sqrt),
                new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
            );
            scene.add(b[i].circle);
        }
    }
}

// Initialize bodies
var b = [];
function updateRadius(i) {
    b[i].r = Math.sqrt(b[i].m / density);
}
for (var i = 0; i < N; i++) {
    b.push({});
    b[i].m = m0;
    // b[i].x = uniformRandom(xMin / 2, xMax / 2);
    // b[i].y = uniformRandom(yMin / 2, yMax / 2);
    var stdDev = Math.min(xMax - xMin, yMax - yMin) * 0.25;
    b[i].x = normalRandom(0, stdDev);
    b[i].y = normalRandom(0, stdDev);
    b[i].vx = Math.min(vMax, 0.0001 * b[i].y);
    b[i].vy = -Math.min(vMax, 0.0001 * b[i].x);
    b[i].inBounds = true;
    updateRadius(i);

    updateCircle(i);
}


// Physics logic
function mergeBodies(i, j) {
    var mi = b[i].m;
    var mj = b[j].m;
    var m = mi + mj;

    var x = (b[i].x * mi + b[j].x * mj) / m;
    var y = (b[i].y * mi + b[j].y * mj) / m;

    var vx = (b[i].vx * mi + b[j].vx * mj) / m;
    var vy = (b[i].vy * mi + b[j].vy * mj) / m;

    b[i].m = m;
    b[i].x = x;
    b[i].y = y;
    b[i].vx = vx;
    b[i].vy = vy;
    updateRadius(i);
    updateCircle(i);

    b[j].m = 0;
    updateCircle(j);
}
function moveBodies() {
    for (var step = speedup; step > 0; step--) {
        // Find maximum speed
        var dt = Number.MAX_VALUE;
        for (var i = 0; i < N; i++) {
            if (b[i].m == 0) continue;
            var dt_i = lorentz_dt(b[i].vx, b[i].vy);
            dt = Math.min(dt, dt_i);
        }

        // Merge close bodies
        if (merging) {
            for (var i = 0; i < N; i++) {
                if (b[i].m == 0) continue;

                for (var j = i + 1; j < N; j++) {
                    if (b[j].m == 0) continue;

                    var dx = b[j].x - b[i].x;
                    var dy = b[j].y - b[i].y;
                    var dSq = dx * dx + dy * dy;
                    var d = Math.sqrt(dSq);

                    if (d <= b[i].r + b[j].r) {
                        mergeBodies(i, j);
                    }
                }
            }
        }

        // Update velocities and position using leapfrog integration & Einstein's law of motion
        for (var i = 0; i < N; i++) {
            if (b[i].m == 0) continue;

            var fx = 0, fy = 0;
            for (var j = 0; j < N; j++) {
                if (i == j || b[j].m == 0) continue;

                var dx = b[j].x - b[i].x;
                var dy = b[j].y - b[i].y;
                var dSq = dx * dx + dy * dy;
                var d = Math.sqrt(dSq);
                if (d == 0) {
                    fx = 0, fy = 0;
                    break;
                }
                var f = G * b[i].m * b[j].m / d;
                f = Math.max(f, fMin);
                fx += f * dx / d;
                fy += f * dy / d;
            }

            if (isNaN(fx) || isNaN(fy)) {
                fx = 0; fy = 0;
            }

            var vMaxSq = vMax * vMax;
            var vSq = Math.min(vMaxSq, b[i].vx * b[i].vx + b[i].vy * b[i].vy);
            // var lorentz_component = Math.pow(Math.sqrt(1 - vSq / (vMax * vMax)), 3);
            // var lorentz_component = Math.sqrt(1 - vSq / vMaxSq);
            var lorentz_component = 1;
            var ax = fx / b[i].m * lorentz_component;
            var ay = fy / b[i].m * lorentz_component;

            // var dt = lorentz_dt(b[i].vx, b[i].vy);

            // Update velocity (half-step)
            b[i].vx += ax * dt / 2;
            b[i].vy += ay * dt / 2;

            // Update position
            b[i].x += b[i].vx * dt;
            b[i].y += b[i].vy * dt;

            // Update velocity (half-step)
            b[i].vx += ax * dt / 2;
            b[i].vy += ay * dt / 2;
        }

        // Enforce speed limit
        for (var i = 0; i < N; i++) {
            if (b[i].m == 0) continue;
            var vSq = b[i].vx * b[i].vx + b[i].vy * b[i].vy;
            var v = Math.sqrt(vSq);
            if (v > vMax) {
                b[i].vx = b[i].vx * vMax / v;
                b[i].vy = b[i].vy * vMax / v;
            }
        }

        // Bounce off borders
        if (bouncing) {
            for (var i = 0; i < N; i++) {
                if (b[i].m == 0) continue;
                var inBoundsX = (b[i].x >= xMin && b[i].x <= xMax);
                var inBoundsY = (b[i].y >= yMin && b[i].y <= yMax);
                if (b[i].inBounds) {
                    if (!inBoundsX) {b[i].vx = -0.5 * b[i].vx; b[i].inBounds = false;}
                    if (!inBoundsY) {b[i].vy = -0.5 * b[i].vy; b[i].inBounds = false;}
                } else if (inBoundsX && inBoundsY) {
                    b[i].inBounds = true;
                }
            }
        }

        // Pull to center
        // for (var i = 0; i < N; i++) {
        //     if (b[i].m == 0) continue;
        //     b[i].x *= 0.999;
        //     b[i].y *= 0.999;
        // }
    }

    // Render circles
    for (var i = 0; i < N; i++) {
        if (b[i].m == 0) continue;
        updateCircle(i);
    }
}


// Render the scene
function animate() {
    requestAnimationFrame(animate);
    moveBodies();
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updatePlaneSize();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle slider inputs
function updateSliderValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(sliderId + '-value');
    output.innerHTML = slider.value;
    
    switch(sliderId) {
        case 'G':
            G = parseFloat(slider.value);
            break;
        case 'vMax':
            vMax = parseFloat(slider.value);
            break;
        case 'dMin':
            dMin = parseFloat(slider.value);
            break;
        case 'mTotal':
            mTotal = parseFloat(slider.value);
            // Update masses of all bodies
            const newMass = mTotal / N;
            for (let i = 0; i < N; i++) {
                if (b[i].m > 0) {
                    b[i].m = newMass;
                    updateCircleRadius(i);
                }
            }
            break;
    }
}

// Set up event listeners for sliders
// ['G', 'vMax', 'dMin', 'mTotal'].forEach(param => {
//     const slider = document.getElementById(param);
//     slider.oninput = function() {
//         updateSliderValue(param);
//     };
//     // Initialize slider values
//     updateSliderValue(param);
// });