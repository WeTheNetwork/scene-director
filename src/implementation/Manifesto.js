import * as THREE from 'three';
import { Manifesto as _Manifesto, Dictum } from '../bin/ScreenDirector.js';

class Manifesto extends _Manifesto{
  constructor( screenplay, workflow ){
    super( screenplay, workflow );


    this.dictums.set("Ready System", new Dictum([
        workflow.init_controls
      ],
      {
        on_enter: screenplay.directions.enter_ready,
        on_idle: screenplay.directions.idle_on_ready,
        on_progress: screenplay.directions.progress_ready,
        on_failure: screenplay.directions.ready_failure,
        on_end: screenplay.directions.ready_for_anything,
        hooks: {
          resume_user: screenplay.directions.resume_user
        }
      }, true));



  }
}
export default Manifesto;
