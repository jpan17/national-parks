/*global THREE*/
/****************************** SCENE GLOBAL VARS ******************************/
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var clock;

// objects related to scene objects
var rainier;
var sceneSubject;

/****************************** ROOM VARS *************************************/
var ground;
var backWall;
var leftWall;
var rightWall;
var frontWall; // front means facing player initially

var ambientLight;
var pointLight;

var backDist = 200;
var leftDist = -200;
var rightDist = 200;
var frontDist = -200;

// obstacles in the game
var collidableObjects = []; // An array of collidable objects used later
var PLAYERCOLLISIONDIST = 5;

/****************************** CONTROL VARS **********************************/

// control global variables
var player;
var controls;
var controlsEnabled = false;

// Flags to determine which direction the player is moving
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var MOVESPEED = 30,
    LOOKSPEED = 0.075

getPointerLock();
    
init();
  
function init() {


  clock = new THREE.Clock();
  clock.start();
	// set up the scene
  createScene();
  getPointerLock();
  animate();
}

function createScene(){
	// 1. set up scene
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene

	// 2. camera
  camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 1, 2000 );//perspective camera
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = -200;
  scene.add(camera);

	// 3. renderer
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
  renderer.setClearColor(0xcce0ff, 1); // enable fog (??)

  renderer.shadowMap.enabled = true;//enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( sceneWidth, sceneHeight );
  dom = document.getElementById('container');
	dom.appendChild(renderer.domElement);

  // setup player movement
  controls = new THREE.PlayerControls(camera, dom);
  controls.getObject().position.set(0, 0, 0);
  scene.add(controls.getObject());

  // create the background
  rainier = new Rainier(scene);
  sceneSubject = [new Background(scene)];

  const color = 0xFFFFFF;
  const intensity = 1;
  ambientLight = new THREE.AmbientLight(color, intensity);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(color, intensity);
  scene.add(pointLight);

	window.addEventListener('resize', onWindowResize, false);
}

function animate(){
    var delta = clock.getDelta();

    controls.animatePlayer(delta);

    render();

    // keep requesting renderer
    requestAnimationFrame(animate);
}

function render(){
  renderer.render(scene, camera);//draw
}

function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}

function getPointerLock() {
  document.onclick = function () {
    dom.requestPointerLock();
  }
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}


/* This code was adapted from
https://docs.microsoft.com/en-us/windows/uwp/get-started/get-started-tutorial-game-js3d
*/
function rayIntersect(ray, distance, objects) {
  var close = [];
  //console.log(distance);
  if (Array.isArray(objects)) {
    var intersects = ray.intersectObjects(objects);
    for (var i = 0; i < intersects.length; i++) {
      // If there's a collision, push into close
      if (intersects[i].distance < distance) {
        //console.log(intersects[i].distance);
        close.push(intersects[i]);
      }
    }
  }
  else {
    var intersect = ray.intersectObject(objects);
      if (intersect.distance < distance) {
        close.push(intersect);
    }
  }
  return close;
}
