import * as THREE from './lib/three.min.js';
import { Manifesto as _Manifesto, Dictum } from './bin/ScreenDirector.js';

class Manifesto extends _Manifesto{
  constructor( scene_directions, workflow ){
    super( scene_directions, workflow );  // Though it doesn't do anything... it is necessary to make 'this' available.

    this.Splash = new Dictum( [ workflow.confirm_privileges, workflow.verify_capabilities ],
      {
        on_enter: scene_directions.enter_splash,
        on_idle: scene_directions.idle_on_splash,
        on_progress: scene_directions.progress_splash,
        on_failure: scene_directions.splash_failure,
        on_end: scene_directions.end_splash
      }, true, true );
    this.Scene_01 = new Dictum( workflow.introduction,
      {
        on_enter: scene_directions.enter_scene_01,
        on_idle: scene_directions.idle_on_scene_01,
        on_progress: scene_directions.progress_scene_01,
        on_failure: scene_directions.scene_01_failure,
        on_end: scene_directions.end_scene_01
      }, true, true );
    this.Scene_02 = new Dictum( workflow.user_introduction,
      {
        on_enter: scene_directions.enter_scene_02,
        on_idle: scene_directions.idle_on_scene_02,
        on_progress: scene_directions.progress_scene_02,
        on_failure: scene_directions.scene_02_failure,
        on_end: scene_directions.end_scene_02
      }, true, true );
    this.Scene_03 = new Dictum( workflow.ready_for_user,
      {
        on_enter: scene_directions.enter_scene_03,
        on_idle: scene_directions.idle_on_scene_03,
        on_progress: scene_directions.progress_scene_03,
        on_failure: scene_directions.scene_03_failure,
        on_end: scene_directions.end_scene_03
      }, true, true );
  }
}

export { Manifesto }
