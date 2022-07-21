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
  enter_splash = async ( screenplay )=>{
    console.log('SceneDirections.enter_splash');
    screenplay.scene.add( screenplay.lights.ambient_light );
  };
  idle_on_splash = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_splash');
  };
  progress_splash = async ( screenplay )=>{
  console.log('SceneDirections.progress_splash');
  };
  splash_failure = async ( screenplay )=>{
   console.log('SceneDirections.splash_failure');
  };
  end_splash = async ( screenplay )=>{
   console.log('SceneDirections.end_splash');
  };
  enter_scene_01 = async ( screenplay )=>{
   console.log('SceneDirections.enter_scene_01');
  };
  idle_on_scene_01 = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_scene_01');
  };
  progress_scene_01 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_01');
  };
  scene_01_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_01_failure');
  };
  end_scene_01 = async ( screenplay )=>{
   console.log('SceneDirections.end_scene_01');
  };
  enter_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.enter_scene_02');
  };
  idle_on_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_scene_02');
  };
  progress_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_02');
  };
  scene_02_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_02_failure');
  };
  end_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.end_scene_02');
  };
  enter_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.enter_scene_03');
  };
  idle_on_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_scene_03');
  };
  progress_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_03');
  };
  scene_03_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_03_failure');
  };
  end_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.end_scene_03');
   screenplay.scene.background = new THREE.Color( 0xff0000 );
  };
}

export { SceneDirections }
