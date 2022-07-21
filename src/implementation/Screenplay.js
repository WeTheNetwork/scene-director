// ScreenDirector Reference
import { Screenplay as _Screenplay, SceneAsset3D } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { FirstPersonControls } from '../lib/FirstPersonControls.js';

// Constant Definitions
const LIGHT = {
  night: 0x050505,
  evening: 0x526079,
  theater: 0x555555,
  indoor: 0x999999,
  day: 0xffffff,
  off: 0x000000,
  green: 0x00ff00,
  red: 0xff0000,
  blue: 0x0000ff
};
const VIEW = {
  fov: 45,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 10000
};

// Screenplay Implementation
class Screenplay extends _Screenplay{
  actors = {

    // Lazy Getters
    /*
        The Screenplay contains ALL of the models which your site will EVER need to render.
        Most applications will want to introduce models as needed, in order to optimize system resources.

        asyncronous loaders are used to ensure that the system is not hung up on resource loading.
        - ex: actors.jumping_cube()

        syncronous loaders are used for loading any other assets.
        - ex: lights.point_light()

        Note: Delete the models initialization logic, replacing it with the initialized model object ( see any ).
              This prevents the model from initializing multiple times.
    */

    // Jumping Cube
    get jumping_cube(){
      let loading = new Promise( (resolve, reject)=>{
        const loader = new GLTFLoader().setPath( '/models/' );
        loader.load( 'jumping_cube.glb',
          async ( gltf )=>{
            let _jumping_cube = gltf.scene.children[0];
            _jumping_cube.material = new THREE.MeshStandardMaterial( { color: LIGHT.indoor } );
            _jumping_cube.animations = gltf.animations;
            _jumping_cube.name = "Jumping Cube";
            let jumping_cube = new SceneAsset3D( _jumping_cube );
            jumping_cube.directions.set( 'revolve', function(){
              jumping_cube.rotation.y += .01;
            });
            jumping_cube.mixer = new THREE.AnimationMixer( jumping_cube );
            var keyAnimationClip = THREE.AnimationClip.findByName( jumping_cube.animations, 'CubeAction.Jump' );
            //var action = jumping_cube.mixer.clipAction( keyAnimationClip );
            //action.play();
            resolve( jumping_cube );
          },
          async function ( xhr ) {
            // TODO: Repair progress functionality
            //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          async ( err )=>{
            console.error( err );
            reject( err );
          }
        );
      } );


      return (async () => {
      try {
        return await loading.then(( _jumping_cube )=>{
          delete this.jumping_cube;
          return this.jumping_cube = _jumping_cube;
        })
      } catch(e) {
        return 0; // fallback value;
      }
    })();
    }
  }
  lights = {
    get point_light(){
      delete this.point_light;
      return this.point_light = new THREE.PointLight( 0xffffff, 2.5, 0, 2 );
    },
    get ambient_light(){
      delete this.ambient_light;
      return this.ambient_light = new THREE.AmbientLight( LIGHT.evening ) ;
    }
  };
  cameras;
  actions = {
    change_cam: async ( cam_name ) =>{

    }
  };


  constructor( ){
    super( );

    // Camera & Controls Setup
    this.active_cam = this.cameras.camera_a = new THREE.PerspectiveCamera( VIEW.fov, VIEW.aspect, VIEW.near, VIEW.far );
    this.cameras.camera_a.name = 'ActiveCam';
  }
}

export { Screenplay }
