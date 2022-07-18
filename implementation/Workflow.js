import * as THREE from './lib/three.min.js';
import GUI from 'lil-gui';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { Workflow as _Workflow } from './bin/ScreenDirector.js';

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

  verify_capabilities = async ( screenplay ) => {
    console.log( 'Workflow.verify_capabilities' );
    return true;
  };
  confirm_privileges = async ( screenplay ) => {
    console.log('Workflow.confirm_privileges');
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
  orbit_controls_demo = async () => {
    console.log('Workflow.orbit_controls_demo');
    return true;
  };
  wireframe_demo = async () => {
    console.log('Workflow.wireframe_demo');
    return true;
  };
  projects_showcase = async () => {
    console.log('Workflow.projects_showcase');
    return true;
  };
  comms_init = async () => {
    console.log('Workflow.comms_init');
    return true;
  };
  profile_display = async () => {
    console.log('Workflow.profile_display');
    return true;
  };
  ping_me = async () => {
    console.log('Workflow.ping_me');
    return true;
  };
  offer_contact = async () => {
    console.log('Workflow.offer_contact');
    return true;
  };
  user_interface_demo = async () => {
    console.log('Workflow.user_interface_demo');
    return true;
  };
}

export { Workflow }
