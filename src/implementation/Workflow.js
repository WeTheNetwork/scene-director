// Screen Director Reference
import { Workflow as _Workflow } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';

// Workflow Implementation
class Workflow extends _Workflow{

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

  confirm_privileges = async ( screenplay ) => {
    console.log('Workflow.confirm_privileges');
    return true;
  };
  verify_capabilities = async ( screenplay ) => {
    console.log( 'Workflow.verify_capabilities' );
    return true;
  };
  introduction = async () => {
    console.log('Workflow.introduction');
    return true;
  };
  user_introduction = async () => {
    console.log('Workflow.user_introduction');
    return true;
  };
  ready_for_user = async () => {
    console.log('Workflow.ready_for_user');
    return true;
  };
}

export { Workflow }
