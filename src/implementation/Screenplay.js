import * as THREE from '../lib/three.min.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { FirstPersonControls } from '../lib/FirstPersonControls.js';
import { Screenplay as _Screenplay, SceneAsset3D } from '../bin/ScreenDirector.js';
import GUI from 'lil-gui';

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
  far: 100000000000000
};

class Screenplay extends _Screenplay{
  actors = {

    // Jumping Cube
    get jumping_cube(){
      let loading = new Promise((resolve, reject)=>{
        const loader = new GLTFLoader().setPath( 'models/' );
        loader.load( 'jumping_cube.glb',
          async ( gltf )=>{
            let _jumping_cube = gltf.scene.children[0];
            _jumping_cube.material = new THREE.MeshStandardMaterial( { color: LIGHT.green } );
            _jumping_cube.animations = gltf.animations;
            _jumping_cube.name = "Jumping Cube";
            let jumping_cube = new SceneAsset3D( _jumping_cube );
            jumping_cube.directions.set( 'revolve', function(){
              jumping_cube.rotation.y += .01;
            });
            jumping_cube.mixer = new THREE.AnimationMixer( jumping_cube );
            var keyAnimationClip = THREE.AnimationClip.findByName( jumping_cube.animations, 'CubeAction.Jump' );
            var action = jumping_cube.mixer.clipAction( keyAnimationClip );
            action.play();
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
      });


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
      let _ship = this.actors.Ship;
      let _cam = _ship.cameras.get( cam_name );
      let _cam_pos = new THREE.Vector3();
      _cam.getWorldPosition( _cam_pos );
      this.active_cam.position.copy( _cam_pos );
      let _target_pos = new THREE.Vector3();
      switch( cam_name ){
        case 'ConnCam':
          _ship.conn_station.getWorldPosition( _target_pos );
          break;
        case 'OpsCam':
          _ship.ops_station.getWorldPosition( _target_pos );
          break;
        case 'CaptainCam':
          _ship.NavDots.sight_target.getWorldPosition( _target_pos );
          break;
      }
      this.active_cam.lookAt( _target_pos );
      this.active_cam.updateProjectionMatrix();
      this.active_cam.name = cam_name;
    }
  };


  constructor( ){
    super( );

    // Camera & Controls Setup
    this.active_cam = new THREE.PerspectiveCamera( VIEW.fov, VIEW.aspect, VIEW.near, VIEW.far );
    this.active_cam.name = 'ActiveCam';
  }
}

export { Screenplay }
