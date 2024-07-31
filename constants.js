const numAnimations = 3;
var animationId = Math.floor(Math.random() * numAnimations);

let N;
let G;
let dPow;
let vMax;
let dtMin;
let fMin;
let m0;
let density;
let luminosity;
let merging;
let bouncing;
let wallDamp;
let speedup;

if (animationId == 0)
{ // TBP
    N = 3;
    G = 0.0001;
    dPow = 1;
    vMax = 100;
    dtMin = 0.00001;
    fMin = 0.000001;
    m0 = 100;
    density = 100;
    luminosity = 5;
    merging = false;
    bouncing = true;
    wallDamp = 1;
    speedup = 2;
}
else if (animationId == 1)
{ // ten bodies
    N = 10;
    G = 0.00001;
    dPow = 1;
    vMax = 100;
    dtMin = 0.000001;
    fMin = 0.000001;
    m0 = 100;
    density = 10000;
    luminosity = 50;
    merging = true;
    bouncing = true;
    wallDamp = 0.5;
    speedup = 2;
}
else
{ // hundred bodies
    N = 100;
    G = 0.00000000006674;
    dPow = 2;
    vMax = 300000;
    dtMin = 0.000001;
    fMin = 0.000001;
    m0 = 50000000;
    density = 3000000000;
    luminosity = 5;
    merging = true;
    bouncing = true;
    wallDamp = 0.1;
    speedup = 1;
}


Object.freeze({ N, G, dPow, vMax, dtMin, fMin, m0, density, luminosity, merging, bouncing, wallDamp, speedup });