const numAnimations = 4;
var animationId = Math.floor(Math.random() * numAnimations);
// animationId = 3;

let N;
let G;
let vMax;
let dtMin;
let fMin;
let m0;
let density;
let luminosity;
let merging;
let bouncing;
let speedup;


if (animationId == 0)
{ // TBP
    N = 3;
    G = 0.000001;
    vMax = 100;
    dtMin = 0.00001;
    fMin = 0.000001;
    m0 = 10;
    density = 1000;
    luminosity = 150;
    merging = false;
    bouncing = true;
    speedup = 100;
}
else if (animationId == 1)
{ // ten bodies
    N = 10;
    G = 0.00001;
    vMax = 100;
    dtMin = 0.000001;
    fMin = 0.000001;
    m0 = 100;
    density = 10000;
    luminosity = 100;
    merging = true;
    bouncing = true;
    speedup = 10;
}
else if (animationId == 2)
{ // hundred bodies
    N = 200;
    G = 0.0000000006674;
    vMax = 10000;
    dtMin = 0.000001;
    fMin = 0.000001;
    m0 = 100;
    density = 1000;
    luminosity = 1;
    merging = true;
    bouncing = false;
    speedup = 25;
}
else
{ // galaxy
    N = 1000;
    G = 0.000006674;
    vMax = 10;
    dtMin = 0.000000000001;
    fMin = 0.00000000001;
    m0 = 1;
    density = 10000;
    luminosity = 50;
    merging = true;
    bouncing = false;
    speedup = 1;
}


Object.freeze({ N, G, vMax, dtMin, fMin, m0, density, luminosity, merging, bouncing, speedup });