// Screen Director Reference
import { Workflow as _Workflow, SceneAsset3D, CSS3DAsset, SceneTransformation } from '../bin/ScreenDirector.js';
// UI Library Reference
import { ErrorBoundary, LoginForm } from '../imp/ui_core.js';
// React Module Reference
import { createRef, useState, useEffect, useRef, Component as oldComponent } from 'react';
import ReactDOM from 'react-dom/client';
import { createPortal } from 'react-dom';
// Support Library Reference
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Workflow Implementation
class Workflow extends _Workflow{
  react_app;

    // Load and resume the user's experience ( @Time-Space Coordinates + difference )
  resume_user = async ( projector, dictum_name, director, ndx ) => {
    console.log('Workflow.resume_user');
    document.title = 'resume_user | WeThe.Network';

    const verifyToken = async ( uname, token ) => {
      if( !uname && !token ) return false;

      let resume = new Request("/tokens",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "username": uname.toString(),
          "token": token.toString()
        }
      });

      return await fetch( resume ).then( async res => {
        let status = res.status;
        if(status==200) return {
          valid: true,
          tokens: res.headers.get('token')
        }
        else return false
      });
    }

    let saving = ( director.CAN_SAVE && director.SHOULD_SAVE );
    let validation = false;
    let uname = '';
    let token = '';

    if( saving ){
      uname = ( typeof(localStorage.getItem("uname")) !== 'undefined' ) ? localStorage.getItem("uname") : false;
      token = ( typeof(localStorage.getItem("token")) !== 'undefined' ) ? localStorage.getItem("token") : false;
      validation = await verifyToken( uname, token );
    }
    await validation;
    let auto_resumed = ( validation ) ? validation.valid: false;
    let tokens = ( validation ) ? validation.tokens: false;

    console.log( 'auto_resumed?: ', auto_resumed );
    function ResumeUser( uname, token ){

      let resume = new Request("/a",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "username": uname,
          "token": token
        },
        body: ""
      });
      fetch( resume ).then( async res => {
        // Fire the resume_user screenplay directions.
        if( res.status == 200 ) director.emit( `${dictum_name}_resume_user`, dictum_name, [ await res.json() ] );

        // Permissions Coordination
        // Do an initial check to see what the notification permission state is
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
          // TODO: Request permission if saved to do so... or NOT saved to not ask again.
          // NOTE: As notifications will be useful to most users, a reminder request should be regularly sent out to users saved to Not Ask

        } else {

        }
      });

    }

    if( !auto_resumed ){

      this.react_app.render( <LoginForm director={director} projector={projector} dictum_name={dictum_name} ndx={ndx} /> );
    } else {
      ResumeUser( uname, token );
      director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    }
  };

  init_controls = async ( projector, dictum_name, director, ndx ) => {
    console.log('Workflow.init_controls');
    director.emit( `${dictum_name}_progress`, dictum_name, ndx );
    this.react_app.render();
  };

  constructor( react_app ){
    super( react_app );
  }
}
export default Workflow;
