// Screen Director Reference
import { Workflow as _Workflow } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';

// Workflow Implementation
class Workflow extends _Workflow{
  elevated_vars = {
    "u_name": ""
  }

  ActivateOrbitControls = async ( screenplay )=>{
    if( !screenplay.controls.orbit_controls ) {
      screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, screenplay.renderer.domElement );
      screenplay.controls.orbit_controls.zoomSpeed = 4;
      screenplay.controls.orbit_controls.enableDamping = true;
      screenplay.controls.orbit_controls.saveState();
    }

    screenplay.controls.orbit_controls.release_distance = 1 + screenplay.controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.orbit_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.orbit_controls.enabled = true;
  }

  DeactivateOrbitControls = async ( screenplay )=>{
    screenplay.controls.orbit_controls.reset();
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.orbit_controls.enabled = false;
    screenplay.updatables.delete( 'controls' );
    screenplay.active_cam.user_control = false;
  }

  confirm_privileges = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.confirm_privileges');
    let proceed = window.confirm('Scene Director Loaded: "Shall we proceed?"');
    if( proceed ) director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    else {
      let patience = (Math.random() * 10) > 5 ? true : false;
      if( !patience ){
        window.alert( 'Out of patience... proceeding.' );
        director.emit( `${dictum_name}_failure`, dictum_name, ndx );
      } else {
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    }
  };
  verify_capabilities = async ( screenplay, dictum_name, director, ndx ) => {
    console.log( 'Workflow.verify_capabilities' );
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then( stream => {
        window.localStream = stream; // A
        window.localAudio.srcObject = stream; // B
        window.localAudio.autoplay = true; // C
    }).catch( err => {
        console.log("u got an error:" + err)
    }).finally( _ => {
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    });
  };
  introduction = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.introduction');
    window.alert( 'Howdy!  This is where I introduce myself.  Though it appears as though I am a basic page with archaic pop-up modals... I am actually an orchestrated set of directions which collaborate with the User Interface in order to perform elaborate animations during transitions; making it possible for you to create an immersive 3D worldscape for your online experience!' );
    setTimeout( (dictum_name, director, ndx)=>{
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }, 5000, dictum_name, director, ndx );
  };
  user_introduction = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.user_introduction');
    let _x = this.elevated_vars.u_name = window.prompt( 'What name would you like to be known by?' );
    this.elevated_vars.u_name = ( _x === null || _x.match(/[^\s]/gi) === null ) ? 'stranger' : _x;
    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
  ready_for_user = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.ready_for_user');
    window.alert( `Okay ${ this.elevated_vars.u_name }, now I'm ready for you.` );
    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
  };
}

export { Workflow }
