import * as THREE from 'three';
import { Manifesto as _Manifesto, Dictum } from '../bin/ScreenDirector.js';

class Manifesto extends _Manifesto{
  constructor( scene_directions, workflow ){
    super( scene_directions, workflow );  // Though it doesn't do anything... it is necessary to make 'this' available.

    this.Splash = new Dictum( [ workflow.verify_capabilities, workflow.user_instruction ],
      {
        on_enter: scene_directions.enter_splash,
        on_idle: scene_directions.idle_on_splash,
        on_progress: scene_directions.progress_splash,
        on_failure: scene_directions.splash_failure,
        on_end: scene_directions.end_splash
      }, true );
  }
}

export { Manifesto }
