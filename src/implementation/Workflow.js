import React from 'react';
import ReactDOM from 'react-dom/client';
import { Peer } from "peerjs";
// Screen Director Reference
import { Workflow as _Workflow, SceneAsset3D, CSS3DAsset, SceneTransformation } from '../bin/ScreenDirector.js';
// Support Library Reference
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { FirstPersonControls } from '../lib/FirstPersonControls.js';
import { FlyControls } from '../lib/FlyControls.js';
import { TrackballControls } from '../lib/TrackballControls.js';

// React Component Error Boundary Class
// Refer to --> # https://reactjs.org/docs/error-boundaries.html #
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  // Update state so the next render will show the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  // You can also log the error to an error reporting service
  componentDidCatch(error, errorInfo) {
    console.error( error, errorInfo );
  }

  render() {
    // You can render any custom fallback UI
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Workflow Implementation
class Workflow extends _Workflow{
  elevated_vars = {
    "u_name": "",
    "ups_test": {
      "ticks": 0,
      "duration": 0,
      "stamps": [],
      "max": -1,
      "min": -1,
      "score": 0
    },
    "resume": {
      "objects": [],
      "targets": {
        "timeline": [],
        "table": [],
        "sphere": [],
        "helix": [],
        "grid": []
      }
    },
    "lil_gui": {}
  }
  react_app;

  ActivateOrbitControls = async ( screenplay )=>{
    if( !screenplay.controls.orbit_controls ) {
      screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
      screenplay.controls.orbit_controls.zoomSpeed = 3;
      screenplay.controls.orbit_controls.enableDamping = true;
      screenplay.controls.orbit_controls.saveState();
    }
    let ship = screenplay.actors.Ship;
    switch( screenplay.active_cam.name ){
      case 'Center':
        screenplay.controls.orbit_controls.target = new THREE.Vector3();
        break;
      case '3rdPerson':
        ship.getWorldPosition( screenplay.controls.orbit_controls.target );
        break;
      case 'CaptainCam':
        ship.NavDots.sight_target.getWorldPosition( screenplay.controls.orbit_controls.target );
        break;
    }
    screenplay.controls.orbit_controls.release_distance = 1 + screenplay.controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.orbit_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.orbit_controls.enabled = true;

  }
  DeactivateOrbitControls = async ( screenplay )=>{
    if( !screenplay.controls.orbit_controls ) {
      screenplay.controls.orbit_controls = new OrbitControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.controls.orbit_controls.reset();
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.orbit_controls.enabled = false;
    screenplay.updatables.delete( 'controls' );
    screenplay.active_cam.user_control = false;
  }

  ActivateFirstPersonControls = async ( screenplay )=>{
    if( !screenplay.controls.first_person_controls ) {
      screenplay.controls.first_person_controls = new FirstPersonControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.controls.first_person_controls.movementSpeed = 1000;
    screenplay.controls.first_person_controls.lookSpeed = 10 * 0.005;
    let ship = screenplay.actors.Ship;
    switch( screenplay.active_cam.name ){
      case 'Center':
        //screenplay.controls.first_person_controls.target.copy( screenplay.props.SplashScreen.position );
        break;
      case '3rdPerson':
        //ship.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
      case 'CaptainCam':
        //ship.NavDots.sight_target.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
    }
    //screenplay.controls.first_person_controls.release_distance = 1 + screenplay.first_person_controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.first_person_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.first_person_controls.enabled = true;
  }
  DeactivateFirstPersonControls = async ( screenplay )=>{
    if( !screenplay.controls.first_person_controls ) {
      screenplay.controls.first_person_controls = new FirstPersonControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.first_person_controls.enabled = false;
    screenplay.updatables.delete( 'controls' );
    screenplay.active_cam.user_control = false;
  }

  ActivateFlyControls = async ( screenplay )=>{
    if( !screenplay.controls.fly_controls ) {
      screenplay.controls.fly_controls = new FlyControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.controls.fly_controls.movementSpeed = 1000;
    screenplay.controls.fly_controls.rollSpeed = 10 * 0.005;
    screenplay.controls.fly_controls.dragToLook = true;
    let ship = screenplay.actors.Ship;
    switch( screenplay.active_cam.name ){
      case 'Center':
        //screenplay.controls.first_person_controls.target.copy( screenplay.props.SplashScreen.position );
        break;
      case '3rdPerson':
        //ship.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
      case 'CaptainCam':
        //ship.NavDots.sight_target.getWorldPosition( screenplay.controls.first_person_controls.target );
        break;
    }
    //screenplay.controls.first_person_controls.release_distance = 1 + screenplay.first_person_controls.orbit_controls.getDistance();
    screenplay.updatables.set( 'controls', screenplay.controls.fly_controls );
    screenplay.active_cam.user_control = true;
    screenplay.active_cam.updateProjectionMatrix();
    screenplay.controls.fly_controls.enabled = true;
  }
  DeactivateFlyControls = async ( screenplay )=>{
    if( !screenplay.controls.fly_controls ) {
      screenplay.controls.fly_controls = new FlyControls( screenplay.active_cam, screenplay.ui_renderer.domElement );
    }
    screenplay.actions.change_cam( screenplay.active_cam.name );
    screenplay.controls.first_person_controls.enabled = false;
    screenplay.updatables.delete( 'controls' );
    screenplay.active_cam.user_control = false;
  }

  verify_capabilities = async ( screenplay, dictum_name, director, ndx ) => {
    console.log( 'Workflow.verify_capabilities' );

    class VerifyCapabilitiesModal extends React.Component {
      test; result_display;

      displayTestResults(){
        let test_results = this.result_display.cache.test_results = this.state.test_results;

        console.log( test_results );

        screenplay.updatables.set( 'test_results', this.result_display );
      }

      constructor( props ){
        super( props );
        this.state = {
          test_results: false,
          results_display: {
            score: 0,
            speed: 0
          }
        };

        /* -= User Performance Statistics Test =-
        ** This is where the user's device is tested for a baseline of rendering ability.
        ** Initial tests may fail due to loading delays... testing again upon failure ensures that
        ** elibigle users are filtered properly.
        ** Upon Failure: Display workflow without immersive rendering. */
        this.test = new SceneTransformation({
            update: ( delta )=>{
              if( this.test.cache.duration-- >= 0 ){
                this.test.cache.stamps.push( delta );
              } else {
                screenplay.updatables.delete( 'ups_test' );
                this.test.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
              }
            },
            cache: {
              duration: 60,
              stamps: [],
              test_results: []
            },
            reset: ()=>{

              this.test.cache.duration = 60;
              this.test.cache.stamps = [];

              screenplay.updatables.set( 'ups_test', this.test );
            },
            post: ( )=>{
              // Build the Test Results from the captured test data
              let test_results = {};
              test_results.stamps = this.test.cache.stamps;
              let pop_cnt = test_results.stamps.length;
              // Calculate the actual test duration based upon stamp values.
              test_results.time = this.test.cache.stamps.reduce( (a,b) => a + b, 0 );
              // Calculate Population Mean & Standard Deviation
              let pop_mean = test_results.mean = test_results.time / pop_cnt;
              let xi_less_u_2 = this.test.cache.stamps.map( (num)=> { return ( num - pop_mean ) ** 2 } );
              let sum_xi_less_u_2 = xi_less_u_2.reduce( (a,b) => a + b, 0 );
              let mean_of_deviation = sum_xi_less_u_2 / pop_cnt;
              test_results.std_dev = Math.sqrt( mean_of_deviation );
              // Determine the largest and smallest tick durations, or stamp values.
              test_results.max = Math.max( ...this.test.cache.stamps );
              test_results.min = Math.min( ...this.test.cache.stamps );
              // ...then calculate the highest and lowest FPS from them.
              test_results.max_fps = 1/test_results.min;
              test_results.min_fps = 1/test_results.max;
              // Grade the User Performance Statistics
              let std_fps = 1 / ( pop_mean + test_results.std_dev );

              test_results.score = Math.floor( std_fps );
              // ... then post the results to the test_results stack
              this.test.cache.test_results.push( test_results );
              // Should another test be run?  The max is 3 runs before failure is determined.
              let runs_so_far = this.test.cache.test_results.length;
              if ( test_results.score < 15 && runs_so_far < 3 || test_results.max_fps < 20 && runs_so_far < 3 ) {
                this.test.reset();  // Rack 'em up and knock 'em down again!
              } else {
                // Now that has completed, compile the tests ( 1 - 3 ), for scoring.
                let compiled_test_results = {
                  stamps: [],
                  time: 0,
                  max: -10000,
                  min: 10000
                };  // Default values to ensure proper evaluation.

                for( let results_ndx = 0; results_ndx < this.test.cache.test_results.length; results_ndx++ ){
                  let test_results = this.test.cache.test_results[results_ndx];
                  compiled_test_results.stamps.push( ...test_results.stamps );
                  // Calculate the actual test duration based upon stamp values.
                  compiled_test_results.time += test_results.stamps.reduce( (a,b) => a + b, 0 );
                  // Determine the largest and smallest tick durations, or stamp values.
                  let max = Math.max( ...test_results.stamps, compiled_test_results.max );
                  compiled_test_results.max = max;
                  let min = Math.min( ...test_results.stamps, compiled_test_results.min );
                  compiled_test_results.min = min;
                }
                // Calculate Population Mean & Standard Deviation
                let comp_pop_cnt = test_results.stamps.length;
                let comp_pop_mean = compiled_test_results.mean = compiled_test_results.time / comp_pop_cnt;
                let comp_xi_less_u_2 = compiled_test_results.stamps.map( (num)=> { return (num - comp_pop_mean) ** 2 } );
                let comp_sum_xi_less_u_2 = comp_xi_less_u_2.reduce( (a,b) => a + b, 0 );
                let comp_mean_of_deviation = comp_sum_xi_less_u_2 / comp_pop_cnt;
                compiled_test_results.std_dev = Math.sqrt( comp_mean_of_deviation );
                // ...then calculate the highest and lowest FPS from them.
                compiled_test_results.max_fps = 1/compiled_test_results.min;
                compiled_test_results.min_fps = 1/compiled_test_results.max;
                // Grade the User Performance Statistics
                let comp_std_fps = 1/( comp_pop_mean + compiled_test_results.std_dev );
                compiled_test_results.score = Math.floor( comp_std_fps );
                // ... then post the results to the console and the test_results stack
                console.log( compiled_test_results );

                this.setState( { test_results: compiled_test_results, test_complete: true });
                this.displayTestResults();
              }

            }
          });
        screenplay.updatables.set( 'ups_test', this.test );
      }

      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );
        // Give the results to the next SceneTransformation for display
        this.result_display = new SceneTransformation({
          update: ( delta )=>{
            if( this.state.test_results ){
              if( this.result_display.cache.duration-- > 0 ){
                let tick = this.result_display.cache.frames - this.result_display.cache.duration;
                let prog = tick / this.result_display.cache.frames;
                let results = this.state.test_results;
                let score = (prog * results.score);
                let stamp_ndx = Math.floor( tick * ( results.stamps.length - 1 ) / this.result_display.cache.frames );
                let speed = Math.ceil( 1 / results.stamps[ stamp_ndx ] );
                this.setState({
                  results_display: {
                    score: score.toFixed( 2 ),
                    speed: speed.toFixed( 1 )
                  }
                });

              } else {
                this.result_display.update = false;
                screenplay.updatables.delete( 'test_results' );
                this.result_display.post( this.state.test_results );
              }
            }
          },
          cache: {
           duration: 200,
           frames: 200,
           test_results: {
             stamps: [],
             time: 0,
             max: Number.MIN_SAFE_INTEGER,
             min: Number.MAX_SAFE_INTEGER,
             max_fps: false,
             min_fps: false,
             score: false
           }
          },

          post: ( test_results )=>{

            // Performance Filter //
            /* The score derived from the above UPS test may be used here to lead poorly
                performing devices into a workflow without immersive rendering. */
            if ( test_results.score > 20 || test_results.max_fps > 30 ) {
              document.querySelector( '#verify_capabilities .success').classList.remove( 'hidden' );
              setTimeout( ( dictum_name, ndx )=>{
                director.emit( `${dictum_name}_progress`, dictum_name, ndx );
              }, 3000, dictum_name, ndx );


            } else {
              setTimeout( ( dictum_name, ndx )=>{
                document.querySelector( '#verify_capabilities .failure').classList.remove( 'hidden' );
                director.emit( `${dictum_name}_failure`, dictum_name, ndx );
              }, 3000, dictum_name, ndx );
            }
          }
        });

      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      render(){
        return (
          <>
            <div id="verify_capabilities" className="pip_gui pip_splash">
              <h1 className="title">Verifying Performance Requirements</h1>
              <span className="description">For a more pleasant experience, a brief performance test must be run.</span>
              <p className="fps_display">
                Active&nbsp;FPS:&nbsp;<span className="speed">{this.state.results_display.speed}</span>
                <br />-<br />
                Standardized:&nbsp;FPS:&nbsp;<span className="score">{this.state.results_display.score}</span>
              </p>
              <h3 className="success hidden">Test Successful!</h3>
              <h3 className="failure hidden">Low-FPS Mode Required</h3>
            </div>
          </>
        );
      }
    }

    this.react_app.render( <ErrorBoundary><VerifyCapabilitiesModal /></ErrorBoundary> );
    document.title = 'Workflow.verify_capabilities | The Pale Blue Dot | Phox.Solutions';

  };
  user_instruction = async ( screenplay, dictum_name, director, ndx ) => {
    console.log('Workflow.user_introduction');

    class UserInstructionModal extends React.Component {



      componentDidMount(){
        document.getElementById( 'root' ).classList.add( 'pip_gui' );

        (function(w, d, x, id){
          let s=d.createElement('script');
          s.src='https://dend6g4sigg57.cloudfront.net/amazon-connect-chat-interface-client.js';
          s.async=1;
          s.id=id;
          d.getElementsByTagName('head')[0].appendChild(s);
          w[x] =  w[x] || function() { (w[x].ac = w[x].ac || []).push(arguments) };
        })(window, document, 'amazon_connect', '195b8fd0-ba42-4a8f-8ec3-3333f21043b5');
        amazon_connect('styles', { openChat: { color: '#ffffff', backgroundColor: '#123456'}, closeChat: { color: '#ffffff', backgroundColor: '#123456'} });
        amazon_connect('snippetId', 'QVFJREFIanUzYnhvNFBocFpzVHdoQjZmUUtOd1FaMjMxR3ZDRG9RRWNFUkFkM3dWVWdFamVzVXNlVmlzNnpnL0s1aytnaGV2QUFBQWJqQnNCZ2txaGtpRzl3MEJCd2FnWHpCZEFnRUFNRmdHQ1NxR1NJYjNEUUVIQVRBZUJnbGdoa2dCWlFNRUFTNHdFUVFNREhQNGt1N1hJeWxVamV0VUFnRVFnQ3ZCS3A0UU1BbGhTVDZVQytJYTFQam90RGkvTWxRdlg2TEo2Q2E3Z2FYaTBLVnMzZVJRU2d2YnVjWXU6OkFBZHlEVnRBYkswc2VLa09Kd1F3Tk1oYm5QOGNjM1lSSmJaMmVKbGN2SU5MeUJYMVlqbzRpclFaMUg2cFBEK3pUcGxhMFlzUUIvcUtCRnU2SWthY0lmK0pLR2F4VG84WlRLR0MxcVp4cWJHK1EybUU4eEJZMzNhVmtRNVVBUXdIN25ZN3ozT0FTbTV4b3AxT2xoRklNc293TnRHR1Y5WT0=');
        amazon_connect('supportedMessagingContentTypes', [ 'text/plain', 'text/markdown' ]);
      }

      componentWillUnmount(){
        document.getElementById( 'root' ).classList.remove( 'pip_gui' );
      }

      handleAckClick( e ){
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }

      render(){
        return (
          <>
            <div id="user_instruction" className="pip_gui pip_post" >
              <h1>Wither-to's and Why-for's</h1>
              <span className="introduction">
                Thank you for being here!<br/>
                Watch your head, so to speak, as this is a work in-progress.<br/><br/>
                You are welcome to investigate 'under the hood', though the code in your browser is compiled and difficult to traverse.<br/>
                The full codebase upon which this app is running may be <a href="https://github.com/phxsol/pale-blue-dot" target="_blank">found here on GitHub</a>.<br/>
              </span>
            </div>
            <button name="ack_user_instruction" className="pip_ack" type="button" onClick={this.handleAckClick}>OK</button>
          </>
        );
      }
    }

    this.react_app.render( <ErrorBoundary><UserInstructionModal /></ErrorBoundary> );

    document.title = 'Workflow.user_introduction | The Pale Blue Dot | Phox.Solutions';
  };

  constructor( react_app ){
    super();
    this.react_app = react_app;
  }
}

export { Workflow }
