//import * as THREE from './node_modules/three/build/three.module.js';
import { GUI } from './node_modules/three/examples/jsm/libs/dat.gui.module.js';

import { MapControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { Robot6AxisBal } from './robots/Robot6AxisBal.js';

var camera, controls, scene, renderer;
var gui;
var robot;

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
    controls.dampingFactor = 0.05;
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

    });
}

function initGUI() {
    gui = new GUI( { autoPlace: true } );

    var pose = {joint1:0, joint2:0, joint3:0, joint4:0, joint5:0, joint6:0 };

    gui.add(pose, 'joint1', -180, 180).step(0.01).onChange(function (value) {
        robot.joint1 = value * Math.PI / 180;
    });
    gui.add(pose, 'joint2', -180, 180).step(0.01).onChange(function (value) {
        robot.joint2 = value * Math.PI / 180;
    });
    gui.add(pose, 'joint3', -180, 180).step(0.01).onChange(function (value) {
        robot.joint3 = value * Math.PI / 180;
    });
    gui.add(pose, 'joint4', -180, 180).step(0.01).onChange(function (value) {
        robot.joint4 = value * Math.PI / 180;
    });
    gui.add(pose, 'joint5', -180, 180).step(0.01).onChange(function (value) {
        robot.joint5 = value * Math.PI / 180;
    });
    gui.add(pose, 'joint6', -180, 180).step(0.01).onChange(function (value) {
        robot.joint6 = value * Math.PI / 180;
    });
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    renderer.render( scene, camera );
}



