//import * as THREE from './node_modules/three/build/three.module.js';
import { GUI } from './node_modules/three/examples/jsm/libs/dat.gui.module.js';

import { MapControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { Robot6AxisBal } from './robots/Robot6AxisBal.js';
import { MotionExecutor } from './robots/MotionExecution.js';

var camera, controls, scene, renderer;
var gui;
var robot;
var executor;

var currentPose = {A1:0, A2:0, A3:0, A4:0, A5:0, A6:0 };
var targetPose = {A1:0, A2:0, A3:0, A4:0, A5:0, A6:0 };

init();

function init() {
    initScene();
    initControls();
    initGUI();
    //render(); // remove when using next line for animation loop (requestAnimationFrame)
    animate();
}

function initControls() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(0, -400, 300 );

    // controls
    controls = new MapControls( camera, renderer.domElement );    
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.1;
    controls.screenSpacePanning = true;
    controls.minDistance = 100;
    controls.maxDistance = 2500;
    controls.maxPolarAngle = Math.PI / 2;

    //
    window.addEventListener( 'resize', onWindowResize, false );
}

function initScene() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );

    // lights
    var light = new THREE.DirectionalLight( 0xcccccc );
    light.position.set(100, 100, 500);

    scene.add(light);

    var light = new THREE.AmbientLight( 0xaaaaaa );
    scene.add(light);

    robot = new Robot6AxisBal();
    robot.load("robot.ldr_Packed.mpd", function ( model ) {
        scene.add(model);
        executor = new MotionExecutor(robot, scene);
    });
}

function initGUI() {
    gui = new GUI( { autoPlace: true } );

    let jogFolder = gui.addFolder("Jogging");

    jogFolder.add(currentPose, 'A1', -180, 180).step(0.01).listen().onChange(function (value) {
        robot.joint1 = value * Math.PI / 180;
    });
    jogFolder.add(currentPose, 'A2', -180, 180).step(0.01).listen().onChange(function (value) {
        robot.joint2 = value * Math.PI / 180;
    });
    jogFolder.add(currentPose, 'A3', -180, 180).step(0.01).listen().onChange(function (value) {
        robot.joint3 = value * Math.PI / 180;
    });
    jogFolder.add(currentPose, 'A4', -180, 180).step(0.01).listen().onChange(function (value) {
        robot.joint4 = value * Math.PI / 180;
    });
    jogFolder.add(currentPose, 'A5', -180, 180).step(0.01).listen().onChange(function (value) {
        robot.joint5 = value * Math.PI / 180;
    });
    jogFolder.add(currentPose, 'A6', -180, 180).step(0.01).listen().onChange(function (value) {
        robot.joint6 = value * Math.PI / 180;
    });

    jogFolder.open();

    let moveFolder = gui.addFolder("Move");

    moveFolder.add(targetPose, 'A1', -180, 180).step(0.01);
    moveFolder.add(targetPose, 'A2', -180, 180).step(0.01);
    moveFolder.add(targetPose, 'A3', -180, 180).step(0.01);
    moveFolder.add(targetPose, 'A4', -180, 180).step(0.01);
    moveFolder.add(targetPose, 'A5', -180, 180).step(0.01);
    moveFolder.add(targetPose, 'A6', -180, 180).step(0.01);

    let button = new Object();
    button.action = function() {
        if (executor) {
            executor.moveToPose([targetPose.A1 * Math.PI /180, 
                                 targetPose.A2 * Math.PI /180, 
                                 targetPose.A3 * Math.PI /180, 
                                 targetPose.A4 * Math.PI /180, 
                                 targetPose.A5 * Math.PI /180, 
                                 targetPose.A6 * Math.PI /180, 
                                ]);
        }
    }
    button.name = "Move to pose";
    moveFolder.add(button, 'action').name(button.name);

    let override = { value: 1 };
    moveFolder.add(override, 'value', 0, 1).step(0.01).name("Override").onChange(function(value) {
        if (executor) {
            executor.override = value;
        }
    });

    moveFolder.open();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    if (executor) executor.update();

    if (robot) {
        currentPose.A1 = robot.joint1 * 180 / Math.PI;
        currentPose.A2 = robot.joint2 * 180 / Math.PI;
        currentPose.A3 = robot.joint3 * 180 / Math.PI;
        currentPose.A4 = robot.joint4 * 180 / Math.PI;
        currentPose.A5 = robot.joint5 * 180 / Math.PI;
        currentPose.A6 = robot.joint6 * 180 / Math.PI;
    }

    render();
}

function render() {
    renderer.render( scene, camera );
}



