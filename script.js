const Scene = require('Scene');
const T = require('Textures');
const M = require('Materials');
const R = require('Reactive');

const FaceTracking = require('FaceTracking');
const FaceGestures = require('FaceGestures');
const TouchGestures = require('TouchGestures');
const Animation = require('Animation');

const Instruction = require('Instruction');
const Dia = require('Diagnostics');

(async function() {

    const [face, alpaca, NewYearStuff, emitterFront, emitterBack, pointLight1, pointLight2, pointLight3] = await Promise.all([
        FaceTracking.face(0),
        Scene.root.findFirst('CristmassAlpaca3DModel'),
        Scene.root.findFirst('NewYearStuff'),
        Scene.root.findFirst('Emitter Front'),
        Scene.root.findFirst('Emitter Back'),
        Scene.root.findFirst('pointLight1'),
        Scene.root.findFirst('pointLight2'),
        Scene.root.findFirst('pointLight3'),
    ]);

const movementExp = 400;
const rotationExp = 300;

const xPos = face.cameraTransform.position.x;
const yPos = face.cameraTransform.position.y;
const zPos = face.cameraTransform.position.z;

let visibility = false;

NewYearStuff.hidden = true;
emitterFront.birthrate = 0;
emitterBack.birthrate = 0;

    alpaca.transform.rotationX = R.mul(face.cameraTransform.rotationX, 0.5).expSmooth(movementExp);
    alpaca.transform.rotationY = R.mul(face.cameraTransform.rotationY, 1.0).expSmooth(movementExp);
    alpaca.transform.rotationZ = R.mul(face.cameraTransform.rotationZ, 0.3).expSmooth(movementExp);

    const timeDriverParameters = {
        durationMilliseconds: 1800,
        loopCount: Infinity,
        mirror: true
    };

    const timeDriver = Animation.timeDriver(timeDriverParameters);
    const quadraticSampler = Animation.samplers.easeInOutSine(-0.02, 0.021);
    const translationAnimation = Animation.animate(timeDriver, quadraticSampler);

    // (x,
    //  y,
    //  z);
    alpaca.transform.position = R.pack3(
        R.add(xPos, -0.07).expSmooth(rotationExp),
        R.add(R.add(yPos, translationAnimation), -0.26).expSmooth(rotationExp),
        R.add(zPos, 0.6).expSmooth(rotationExp)
    );
    // Start the time driver (unlike value drivers this needs to be done explicitly)
    timeDriver.start();


TouchGestures.onTap().subscribe((gesture) => {
    // Switch materials depending on which one is currently applied to the plane
    if(visibility) {
        visibility = !visibility;
        
        NewYearStuff.hidden = true;
        emitterFront.birthrate = 0;
        emitterBack.birthrate = 0;
    } else {
        visibility = !visibility;
        
        NewYearStuff.hidden = false;
        emitterFront.birthrate = 7;
        emitterBack.birthrate = 30;
    }
});

})(); 
