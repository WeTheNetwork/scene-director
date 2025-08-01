// ScreenDirector Reference
import { Screenplay as _Screenplay, SceneAsset3D, SceneTransformation } from '../bin/ScreenDirector';
// Component Reference
import { ErrorBoundary, LoginForm } from '../imp/ui_core';
// Support Library Reference
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GravitySimulator, MassiveObject, SpacialDensityMatrix } from '../imp/gravity_simulator.js';

// projector Implementation
class Screenplay extends _Screenplay{
  actions = {
    change_cam_original: ( async function ( cam_name ) {
      let ship = this.models.Starship;
      let new_position = new THREE.Vector3();
      let new_target_position = new THREE.Vector3();

      switch( cam_name ){
        case 'Center':
          new_position.setY( this.major_dim );
          new_position.setZ( this.major_dim );
          new_target_position = new THREE.Vector3();
          this.projector.active_cam.up = new THREE.Vector3( 0, 1, 0 );

          break;
        case 'CaptainCam':
        case 'OpsCam':
        case 'ConnCam':
        case '3rdPersonCam':
        case '3rdShipCam':
          ship.getWorldPosition( new_position );
          ship.NavDots.sight_target.getWorldPosition( new_target_position );
          break;
      }
      this.position.copy( new_position );
      this.target.copy( new_target_position );
      this.projector.active_cam.position.copy( this.position );
      this.projector.active_cam.lookAt( this.target );
      if( this.controls.orbit_controls ) this.controls.orbit_controls.target.copy( new_target_position );
      this.projector.active_cam.updateProjectionMatrix();
      this.projector.active_cam.name = cam_name;

    }).bind( this ),
    change_cam: ( async function ( cam_name ) {
      if( cam_name !== this.projector.active_cam.name ){
        function StringBuilder(){
          var _string = arguments[0] || '';

          for (var i=1; i < arguments.length; i++) {
            var symbol = '%' + i;
            var replacement = arguments[i] || 0;
            _string = _string.replace(symbol, replacement);
          }
          return _string;
        }

        function StringCombiner(){
          var _string = arguments[0] || '';

          for (var i=1; i < arguments.length; i++) {
            _string += ' ' + arguments[i];
          }
          return _string;
        }

        document.title = StringCombiner( 'Dollying to ', cam_name ,' | Wethe.Network' );
        let start_position = this.projector.active_cam.getWorldPosition( new THREE.Vector3() );
        let dolly_cam = this.projector.active_cam.clone();
        dolly_cam.position.copy( start_position );
        this.projector.env_scene.add( dolly_cam );
        this.projector.active_cam = dolly_cam;
        let destination_camera = this.cameras.get( cam_name );
        let finish_position = destination_camera.getWorldPosition( new THREE.Vector3() );
        let distance_between = start_position.distanceTo( finish_position );
        let ahead = new THREE.Vector3(0, 0, -1).transformDirection( dolly_cam.matrixWorld.clone() );
        let ray_forward = new THREE.Ray( start_position, ahead );
        let a_tenth_ahead = ray_forward.at( distance_between / 10, new THREE.Vector3() );

        let before = new THREE.Vector3(0, 0, 1).transformDirection( destination_camera.matrixWorld.clone() );
        let ray_before = new THREE.Ray( finish_position, before );
        let a_tenth_before = ray_before.at( distance_between / 2, new THREE.Vector3() );

        let dolly_path = new THREE.CubicBezierCurve3( start_position, a_tenth_ahead, a_tenth_before, finish_position );
        let pilot = new THREE.Object3D();
        pilot.position.copy( start_position );
        let transition_course = new SceneTransformation({
          compile: ( )=>{

            let cache = transition_course.cache;
            let dolly_cam = cache.dolly_cam;
            let course = cache.course;
            let pilot = cache.pilot;

            for( ;cache.iteration < cache.duration; cache.iteration++ ){
              let _prog = cache.iteration / cache.duration;
              let dolly_progress = _prog * Math.min( 1, _prog ** (2-(2*_prog)) );
              let next_pos = course.getPointAt( _prog );

              dolly_cam.position.copy( pilot.position.clone() );
              cache.compilation.dolly_cam.positions.push( dolly_cam.position.clone() );
              pilot.position.copy( next_pos );
              dolly_cam.lookAt( pilot.position );
              cache.compilation.dolly_cam.quaternions.push( dolly_cam.quaternion.clone() );
            }
            cache.compilation.dolly_cam.positions.push( course.getPointAt( 1 ) );

            //cache.compilation.dolly_cam.quaternions.push( cache.destination.quaternion );
            return cache.compiled = true;
          },
          update: ()=>{
            let cache = transition_course.cache;
            let dolly_cam = cache.dolly_cam;
            if( cache.completed ){
              this.projector.updatables.delete( 'dolly_to' );
              this.projector.env_scene.remove( dolly_cam );
              this.projector.active_cam = cache.destination;
              document.title = StringCombiner( cam_name,' | Wethe.Network' );

            } else {
              if( cache.frame < cache.compilation.dolly_cam.positions.length || cache.frame < cache.compilation.dolly_cam.quaternions.length){
                if( cache.compilation.dolly_cam.positions[cache.frame] ) dolly_cam.position.copy( cache.compilation.dolly_cam.positions[cache.frame] );
                if( cache.compilation.dolly_cam.quaternions[cache.frame] ) dolly_cam.quaternion.copy( cache.compilation.dolly_cam.quaternions[cache.frame] );

                dolly_cam.updateProjectionMatrix();
              } else {
                cache.completed = true;
              }
            }
            cache.frame++;
          },
          cache: {
            compiled: false,
            completed: false,
            frame: 0,
            iteration: 0,
            course: dolly_path,
            duration: 180,
            destination: destination_camera,
            dolly_cam: dolly_cam,
            pilot: pilot,
            compilation: {
              dolly_cam: {
                positions: [],
                quaternions: []
              }
            }
          }
        });
        transition_course.compile();
        this.projector.updatables.set('dolly_to', transition_course );
      }
    }).bind( this ),
    transform: ( async function ( objects, targets, duration, arrival_emitter = false ){
      // Remove actively competing animations by resetting this engine.
      this.projector.updatables.delete('ui_transform');
      delete this.ui_scene.updates;
      this.ui_scene.updates = {
        update: ()=>{},
        cache: {}
      };

      // Set the travel path to their target for each object.
      let paths = [];
      for ( let ndx = 0; ndx < objects.length; ndx++ ) {
        const object = objects[ ndx ];
        const target = targets[ ndx ];
        const path = new THREE.Line3( object.position, target.position );
        paths[ndx] = path;
      }

      let ui_transform_cache = {
        objects: objects,
        targets: targets,
        paths: paths,
        duration: duration,
        frame: 0,
        completed: false,
        arrival_emitter: arrival_emitter
      }
      let ui_transform = {
        update: ()=>{
          let cache = plotted_course.cache;

          // Call this last to clear the function
          if( cache.completed ){

            this.projector.updatables.delete( 'ui_transform' );
            let a = cache.arrival_emitter;
            if ( a && a instanceof Function ) {
              a();
            } else if( a && a.dictum_name && a.ndx ) {
              a.director.emit( `${a.dictum_name}_progress`, a.dictum_name, a.ndx );
            }
          } else {

            let objects = this.ui_scene.updates.cache.objects;
            let targets = this.ui_scene.updates.cache.targets;
            let paths = this.ui_scene.updates.cache.paths;
            let _tprog = this.ui_scene.updates.cache.frame / this.ui_scene.updates.cache.duration;
            let transform_progress = _tprog ** (10-(10.05*_tprog));

            for ( let ndx = 0; ndx < objects.length; ndx++ ) {

              let new_pos = new THREE.Vector3();
              if ( this.ui_scene.updates.cache.frame === this.ui_scene.updates.cache.duration ) {
                new_pos = targets[ ndx ].position;
              } else {
                paths[ ndx ].at( transform_progress, new_pos );
              }
              let object = objects[ ndx ];
              object.position.copy( new_pos );
              object.lookAt( this.projector.active_cam.position );
            }

          }
          if( ++this.ui_scene.updates.cache.frame >= this.ui_scene.updates.cache.duration ) this.ui_scene.updates.cache.completed = true;
        },
        cache: ui_transform_cache
      }
      this.updateables.set( 'ui_transform', ui_transform );
    }).bind( this ),
    addLabel: ( async function ( name, location ){

			const textGeo = new TextGeometry( name, {
				font: font,
				size: 20,
				height: 1,
				curveSegments: 1
			} );

			const textMaterial = new THREE.MeshBasicMaterial();
			const textMesh = new THREE.Mesh( textGeo, textMaterial );
			textMesh.position.copy( location );
			this.projector.env_scene.add( textMesh );

		}).bind( this ),
    dolly_camera_to: ( async function ( cam_name ) {
      if( cam_name !== this.projector.active_cam.name ){
        function StringBuilder(){
          var _string = arguments[0] || '';

          for (var i=1; i < arguments.length; i++) {
            var symbol = '%' + i;
            var replacement = arguments[i] || 0;
            _string = _string.replace(symbol, replacement);
          }
          return _string;
        }

        function StringCombiner(){
          var _string = arguments[0] || '';

          for (var i=1; i < arguments.length; i++) {
            _string += ' ' + arguments[i];
          }
          return _string;
        }

        document.title = StringCombiner( 'Dollying to ', cam_name ,' | Wethe.Network' );
        let start_position = this.projector.active_cam.getWorldPosition( new THREE.Vector3() );
        let dolly_cam = this.projector.active_cam.clone();
        dolly_cam.position.copy( start_position );
        this.projector.env_scene.add( dolly_cam );
        this.projector.active_cam = dolly_cam;
        let destination_camera = this.cameras.get( cam_name );
        let finish_position = destination_camera.getWorldPosition( new THREE.Vector3() );
        let distance_between = start_position.distanceTo( finish_position );
        let ahead = new THREE.Vector3(0, 0, -1).transformDirection( dolly_cam.matrixWorld.clone() );
        let ray_forward = new THREE.Ray( start_position, ahead );
        let a_tenth_ahead = ray_forward.at( distance_between / 10, new THREE.Vector3() );

        let before = new THREE.Vector3(0, 0, 1).transformDirection( destination_camera.matrixWorld.clone() );
        let ray_before = new THREE.Ray( finish_position, before );
        let a_tenth_before = ray_before.at( distance_between / 2, new THREE.Vector3() );

        let dolly_path = new THREE.CubicBezierCurve3( start_position, a_tenth_ahead, a_tenth_before, finish_position );
        let pilot = new THREE.Object3D();
        pilot.position.copy( start_position );
        let transition_course = new SceneTransformation({
          compile: ( )=>{

            let cache = transition_course.cache;
            let dolly_cam = cache.dolly_cam;
            let course = cache.course;
            let pilot = cache.pilot;

            for( ;cache.iteration < cache.duration; cache.iteration++ ){
              let _prog = cache.iteration / cache.duration;
              let dolly_progress = _prog * Math.min( 1, _prog ** (2-(2*_prog)) );
              let next_pos = course.getPointAt( _prog );

              dolly_cam.position.copy( pilot.position.clone() );
              cache.compilation.dolly_cam.positions.push( dolly_cam.position.clone() );
              pilot.position.copy( next_pos );
              dolly_cam.lookAt( pilot.position );
              cache.compilation.dolly_cam.quaternions.push( dolly_cam.quaternion.clone() );
            }
            cache.compilation.dolly_cam.positions.push( course.getPointAt( 1 ) );

            //cache.compilation.dolly_cam.quaternions.push( cache.destination.quaternion );
            return cache.compiled = true;
          },
          update: ()=>{
            let cache = transition_course.cache;
            let dolly_cam = cache.dolly_cam;
            if( cache.completed ){
              this.projector.updatables.delete( 'dolly_to' );
              this.projector.env_scene.remove( dolly_cam );
              this.projector.active_cam = cache.destination;
              document.title = StringCombiner( cam_name,' | Wethe.Network' );

            } else {
              if( cache.frame < cache.compilation.dolly_cam.positions.length || cache.frame < cache.compilation.dolly_cam.quaternions.length){
                if( cache.compilation.dolly_cam.positions[cache.frame] ) dolly_cam.position.copy( cache.compilation.dolly_cam.positions[cache.frame] );
                if( cache.compilation.dolly_cam.quaternions[cache.frame] ) dolly_cam.quaternion.copy( cache.compilation.dolly_cam.quaternions[cache.frame] );

                dolly_cam.updateProjectionMatrix();
              } else {
                cache.completed = true;
              }
            }
            cache.frame++;
          },
          cache: {
            compiled: false,
            completed: false,
            frame: 0,
            iteration: 0,
            course: dolly_path,
            duration: 180,
            destination: destination_camera,
            dolly_cam: dolly_cam,
            pilot: pilot,
            compilation: {
              dolly_cam: {
                positions: [],
                quaternions: []
              }
            }
          }
        });
        transition_course.compile();
        this.projector.updatables.set('dolly_to', transition_course );
      }
    }).bind( this ),
    activate_orbit_controls: ( async function (){

      let root_element = document.getElementById( 'root' );
      this.projector.controls = new OrbitControls( this.projector.active_cam, root_element );
      this.projector.controls.zoomSpeed = 1;
      this.projector.controls.enableDamping = true;
      this.projector.controls.enableZoom = false;
      this.projector.controls.enablePan = false;

      this.projector.controls.saveState();
      this.projector.controls.release_distance = 1 + this.projector.controls.getDistance();
      this.projector.updatables.set( 'controls', this.projector.controls );
      this.projector.controls.enabled = true;


    } ).bind(this),
    deactivate_orbit_controls: ( async function (){

      this.projector.controls.reset();
      this.projector.controls.enabled = false;
      this.projector.updatables.delete( 'controls' );

    } ).bind(this)
  };
  cameras;
  directions = {

    enter_ready : async ( projector, dictum_name, next_emit, director )=>{
     let env_scene = projector.env_scene;
     let ui_scene = projector.ui_scene;
     await projector.setEnvSkyCube( [ 'corona_lf.png', 'corona_rt.png', 'corona_up_2.png', 'corona_dn_2.png', 'corona_ft.png', 'corona_bk.png'   ] );

     director.emit( next_emit, dictum_name );
    },
    idle_on_ready : async ( projector, dictum_name, next_emit, director )=>{
      const gui = projector.lil_gui;
      let env_scene = projector.env_scene;
      let ui_scene = projector.ui_scene;
      let page_ve_scene = projector.page_ve_scene;
      let page_ui_scene = projector.page_ui_scene;

      director.emit( next_emit, dictum_name );
    },
    progress_ready : async ( projector, dictum_name, ndx )=>{
    },
    ready_failure : async ( projector, dictum_name, ndx  )=>{
      // Do something here in response to the failure
    },
    ready_for_anything : async ( projector, dictum_name, next_emit, director )=>{
     document.title = 'Ready for anything... - "Screen Director"';

     director.emit( next_emit, dictum_name );
    },
    resume_user: async ( projector, dictum_name, [ resume ] )=>{
      // Do something to resume the user to their place... doesn't require emission.
    },

  };
  lighting;
  models = {
    ,
    get Model(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/scene.glb',
          async ( gltf )=>{
            resolve( gltf );
          },
          async function ( xhr ) {
            // TODO: Add Repair progress functionality... if needed.
            //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          async ( err )=>{
            console.error( err );
            reject( err );
          }
        );
      });


      return (async () => {
        try {
          return await loading.then(( model )=>{
            delete this.Model;
            return this.Model = model;

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    },
    get Avatar(){

      let loading = new Promise( ( resolve, reject )=>{
        const loader = new GLTFLoader();
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'models/Avatar.glb',
          async ( gltf )=>{
            resolve( gltf );
          },
          async function ( xhr ) {
            // TODO: Add Repair progress functionality... if needed.
            //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          async ( err )=>{
            console.error( err );
            reject( err );
          }
        );
      });


      return (async () => {
        try {
          return await loading.then(( avatar )=>{
            delete this.Avatar;
            return this.Avatar = avatar.scene.children[0];

          })
        } catch(e) {
          return 0; // fallback value;
        }
      })();
    }
  };
  set = {
    get SplashScreen(){
      let splash_screen = new THREE.Mesh(
        new THREE.PlaneGeometry( window.innerWidth, window.innerHeight ),
        new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
      );
      delete this.SplashScreen;
      return this.SplashScreen = splash_screen;
    }
  };
  projector;

  constructor( projector ){
    super( projector );



  }
}

export default Screenplay;
