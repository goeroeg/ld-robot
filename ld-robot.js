//import * as THREE from './node_modules/three/build/three.module.js';

import { MapControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { LDrawLoader } from './gfx/LDrawLoader.js'; // use fixed - 

var camera, controls, scene, renderer;

init();

function init() {
    initScene();
    initControls();
        
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
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 2500;
    controls.maxPolarAngle = Math.PI / 2;

    //
    window.addEventListener( 'resize', onWindowResize, false );
}


function initScene() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcccccc );

    // lights
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
    var light = new THREE.DirectionalLight(0x002288);
    light.position.set(-1, -1, -1);
    scene.add(light);
    var light = new THREE.AmbientLight(0x222222);
    scene.add(light);

    var lDrawLoader = new LDrawLoader();
    lDrawLoader.smoothNormals = true; 
    lDrawLoader.separateObjects = true;
    lDrawLoader
        .setPath( "ldraw/" )        
        .load( "models/robot.ldr_Packed.mpd", function ( model ) {

            // console.log(model);

            // Convert from LDraw coordinates: rotate 180 degrees around OX
            model.rotateX(-Math.PI/2);

            // Adjust materials

            model.traverse( c => { 
                c.visible = !c.isLineSegments;                 

                if (c.isMesh)
                {
                    c.castShadow = true; 
                    c.receiveShadow = true; 
                }
            });

            console.log(model);

            scene.add(model);
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



