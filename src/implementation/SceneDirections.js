// ScreenDirector Reference
import { SceneDirections as _SceneDirections } from '../bin/ScreenDirector.js';
// Support Library Reference
import * as THREE from 'three';
import { CSS3DObject } from '../lib/CSS3DRenderer.js';

// ScreenDirections Implementation
/*
    This is where the THREE.js code is run.
    New characters need to render to the stage?  Do that here.
    When using lazy Getters for those models, they wont load prematurely.
    Note: Be sure to override the lazy Getter with the initialized model ( See Screenplay.js for an example ).
*/
class SceneDirections extends _SceneDirections {
  enter_splash = async ( screenplay, dictum_name, next_emit, director )=>{
    console.log('SceneDirections.enter_splash');
    screenplay.scene.add( screenplay.lights.ambient_light );
    
    director.emit( next_emit, dictum_name );
  };
  idle_on_splash = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.idle_on_splash');

   director.emit( next_emit, dictum_name );
  };
  progress_splash = async ( screenplay )=>{
  console.log('SceneDirections.progress_splash');


  };
  splash_failure = async ( screenplay )=>{
   console.log('SceneDirections.splash_failure');

  };
  end_splash = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.end_splash');

   director.emit( next_emit, dictum_name );
  };
  enter_scene_01 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.enter_scene_01');

   director.emit( next_emit, dictum_name );
  };
  idle_on_scene_01 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.idle_on_scene_01');

   director.emit( next_emit, dictum_name );
  };
  progress_scene_01 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_01');

  };
  scene_01_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_01_failure');

  };
  end_scene_01 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.end_scene_01');

   director.emit( next_emit, dictum_name );
  };
  enter_scene_02 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.enter_scene_02');

   director.emit( next_emit, dictum_name );
  };
  idle_on_scene_02 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.idle_on_scene_02');

   director.emit( next_emit, dictum_name );
  };
  progress_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_02');

  };
  scene_02_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_02_failure');

  };
  end_scene_02 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.end_scene_02');

   director.emit( next_emit, dictum_name );
  };
  enter_scene_03 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.enter_scene_03');

   director.emit( next_emit, dictum_name );
  };
  idle_on_scene_03 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.idle_on_scene_03');

   director.emit( next_emit, dictum_name );
  };
  progress_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_03');

  };
  scene_03_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_03_failure');

  };
  end_scene_03 = async ( screenplay, dictum_name, next_emit, director )=>{
   console.log('SceneDirections.end_scene_03');
   screenplay.scene.background = new THREE.Color( 0x444444 );
   screenplay.scene.add( await screenplay.actors.jumping_cube );
   screenplay.actors.jumping_cube.position.copy( new THREE.Vector3( 10, 10, 10 ));
   var keyAnimationClip = THREE.AnimationClip.findByName( screenplay.actors.jumping_cube.animations, 'CubeAction.Jump' );
   var action = screenplay.actors.jumping_cube.mixer.clipAction( keyAnimationClip );
   action.play();
   screenplay.active_cam.lookAt( screenplay.actors.jumping_cube.position );

   director.emit( next_emit, dictum_name );
  };
}

export { SceneDirections }
