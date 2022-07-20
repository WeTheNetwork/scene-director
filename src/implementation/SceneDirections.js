// ScreenDirector Reference
import { SceneDirections as _SceneDirections } from '../bin/ScreenDirector.js';
// Support Library Reference
import * as THREE from 'three';
import { CSS3DObject } from '../lib/CSS3DRenderer.js';

// ScreenDirections Implementation
class SceneDirections extends _SceneDirections {
  enter_splash = async ( screenplay )=>{
    console.log('SceneDirections.enter_splash');
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
   console.log('SceneDirections.enter_scene_01');
  };
  idle_on_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_scene_01');
  };
  progress_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_01');
  };
  scene_02_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_01_failure');
  };
  end_scene_02 = async ( screenplay )=>{
   console.log('SceneDirections.end_scene_01');
  };
  enter_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.enter_scene_01');
  };
  idle_on_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.idle_on_scene_01');
  };
  progress_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.progress_scene_01');
  };
  scene_03_failure = async ( screenplay )=>{
   console.log('SceneDirections.scene_01_failure');
  };
  end_scene_03 = async ( screenplay )=>{
   console.log('SceneDirections.end_scene_01');
  };
}

export { SceneDirections }
