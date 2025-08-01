import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { EventEmitter } from 'eventemitter3';

// SpaceTime - The progression of temporal mechanics across the system.
class SpaceTime{
  clock;polls;

  delta = 0; heartbeat_delta = 0; qm_delta = 0; m_delta = 0; qh_delta = 0; hh_delta = 0; h_delta = 0; qd_delta = 0; hd_delta = 0; d_delta = 0;
  intervals = {
    heartbeat: 0.6366,
    qm: 15,
    m: 60,
    qh: 900,
    hh: 1800,
    h: 3600,
    qd: 21600,
    hd: 43200,
    d: 86400
  }
  beat = ( delta )=>{
    const beat_delta = delta;
    this.heartbeat_delta += beat_delta;
    this.qm_delta += beat_delta;
    this.m_delta += beat_delta;
    this.qh_delta += beat_delta;
    this.hh_delta += beat_delta;
    this.h_delta += beat_delta;
    this.qd_delta += beat_delta;
    this.hd_delta += beat_delta;
    this.d_delta += beat_delta;
    if ( this.heartbeat_delta  >= this.heartbeat_interval ) {
      const next_delta = this.heartbeat_delta % this.heartbeat_interval;
      this.heartbeat( this.heartbeat_delta );
      this.heartbeat_delta = next_delta;
      console.log( 'beat.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.qm_delta  >= this.qm_interval ) {
      const next_delta = this.qm_delta % this.qm_interval;
      this.poller.quarter_minute( this.qm_delta, 2 );
      this.qm_delta = next_delta;
      console.log( 'quarter_minute.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.m_delta  >= this.m_interval ) {
      const next_delta = this.m_delta % this.m_interval;
      this.poller.minute( this.m_delta, 3 );
      this.m_delta = next_delta;
      console.log( 'minute.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.qh_delta  >= this.qh_interval ) {
      const next_delta = this.qh_delta % this.qh_interval;
      this.poller.quarter_hour( this.qh_delta, 4 );
      this.qh_delta = next_delta;
      console.log( 'quarter_hour.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.hh_delta  >= this.hh_interval ) {
      const next_delta = this.hh_delta % this.hh_interval;
      this.poller.half_hour( this.hh_delta, 5 );
      this.hh_delta = next_delta;
      console.log( 'half_hour.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.h_delta  >= this.h_interval ) {
      const next_delta = this.h_delta % this.h_interval;
      this.poller.hour( this.h_delta, 6 );
      this.h_delta = next_delta;
      console.log( 'hour.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.qd_delta  >= this.qd_interval ) {
      const next_delta = this.qd_delta % this.qd_interval;
      this.poller.quarter_day( this.qd_delta, 7 );
      this.qd_delta = next_delta;
      console.log( 'quarter_day.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.hd_delta  >= this.hd_interval ) {
      const next_delta = this.hd_delta % this.hd_interval;
      this.poller.half_day( this.hd_delta, 8 );
      this.hd_delta = next_delta;
      console.log( 'half_day.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
    if ( this.d_delta  >= this.d_interval ) {
      const next_delta = this.d_delta % this.d_interval;
      this.poller.day( this.d_delta, 9 );
      this.d_delta = next_delta;
      console.log( 'day.. next @ ' + next_delta + 'latest delta: ' + delta );
    }
  }
  poller = {
    quarter_minute: ( delta )=>{
      this.polls.quarter_minute.forEach(( poll, name )=>{
        try { poll.update( delta, 2 ) } catch(e) { console.error( e ) };
      });
    },
    minute: ( delta )=>{
      this.polls.minute.forEach(( poll, name )=>{
        try { poll.update( delta, 3 ) } catch(e) { console.error( e ) };
      });
    },
    quarter_hour: ( delta )=>{
      this.polls.quarter_hour.forEach(( poll, name )=>{
        try { poll.update( delta, 4 ) } catch(e) { console.error( e ) };
      });
    },
    half_hour: ( delta )=>{
      this.polls.half_hour.forEach(( poll, name )=>{
        try { poll.update( delta, 5 ) } catch(e) { console.error( e ) };
      });
    },
    hour: ( delta )=>{
      this.polls.hour.forEach(( poll, name )=>{
        try { poll.update( delta, 6 ) } catch(e) { console.error( e ) };
      });
    },
    quarter_day: ( delta )=>{
      this.polls.quarter_day.forEach(( poll, name )=>{
        try { poll.update( delta, 7 ) } catch(e) { console.error( e ) };
      });
    },
    half_day: ( delta )=>{
      this.polls.half_day.forEach(( poll, name )=>{
        try { poll.update( delta, 8 ) } catch(e) { console.error( e ) };
      });
    },
    day: ( delta )=>{
      this.polls.day.forEach(( poll, name )=>{
        try { poll.update( delta, 9 ) } catch(e) { console.error( e ) };
      });
    }

  }

  constructor(){
    this.clock = new THREE.Clock();
    this.polls = {
      quarter_minute: new Map(),
      minute: new Map(),
      quarter_hour: new Map(),
      half_hour: new Map(),
      hour: new Map(),
      quarter_day: new Map(),
      half_day: new Map(),
      day: new Map()
    }
  }
}

// The ScreenDirector - Engine for orchestrating the logic and aesthetics of the system. //
class ScreenDirector extends EventEmitter {
    CAN_SAVE; SHOULD_SAVE;
    projector; manifesto; screenplay;
    active_dictum = 0;
    dictum_index = [];

    /* Handle PopState events to trigger page navigation in response to History Navigation (Back/Forward buttons)  */
    postPopState = () => {
      // TODO: Update the nav bar, load content.
    }

    Add_Dictum = function( dictum_name, dictum ){

      // EventHandler <dictum_name>: When fired, executes the designated functions in order, reporting the progress to the <dictum_name>_progress eventhandler.
      this.on( `${dictum_name}`, async ()=>{
        this.manifesto.dictums.get( dictum_name ).directions.on_enter( this.projector, dictum_name, `${dictum_name}_entered`, this );
      });
      this.on( `${dictum_name}_entered`, async ()=>{
        this.manifesto.dictums.get( dictum_name ).directions.on_idle( this.projector, dictum_name, `${dictum_name}_idling`, this );
      });

      // Run the dictum logic
      let logic_count = 0;
      if(!dictum.logic) throw new Error('Dictums must be logical.  Declare a void function at least.');   // Feedback for the Dictum writers.
      logic_count = dictum.logic.length;
      this.on( `${dictum_name}_idling`, async ()=>{
        dictum.logic[ 0 ]( this.projector, dictum_name, this, 0 );
      });

      this.on( `${dictum_name}_progress`, async ( dictum_name, ndx )=>{

        let dictum = this.manifesto.dictums.get( dictum_name );
        dictum.directions.on_progress( this.projector, dictum_name, ndx );
        dictum.progress.completed++;
        dictum.progress.passed++;
        if( dictum.progress.completed >= dictum.logic.length ) {
          this.emit( `${dictum_name}_end`, dictum_name );
        } else {
          this.emit( `next_logic`, dictum_name, ++ndx );
        }

      } );

      this.on( `${dictum_name}_failure`, async ( dictum_name, ndx )=>{

        let dictum = this.manifesto.dictums.get( dictum_name );
        dictum.directions.on_failure( this.projector, dictum_name, ndx );
        dictum.progress.completed++;
        dictum.progress.failed++;
        if( dictum.progress.completed === dictum.logic.length ) {
          this.emit( `${dictum_name}_end`, dictum_name );
        } else {
          this.emit( `next_logic`, dictum_name, ++ndx );
        }

      } );

      this.on( `${dictum_name}_end`, async ( dictum_name )=>{

        let dictum = this.manifesto.dictums.get( dictum_name );
        let next_emit = (dictum.progress.failed > 0) ? 'fail_dictum' : `confirm_dictum`;
        this.manifesto.dictums.get( dictum_name ).directions.on_end( this.projector, dictum_name, next_emit, this ) ;
      } );

      if( dictum.hooks){
        for ( const hook_name in dictum.hooks ){

          this.on( `${dictum_name}_${hook_name}`, async ( dictum_name, params )=>{

            let dictum = this.manifesto.dictums.get( dictum_name );
            dictum.directions.hooks[ dictum_name ]( this.projector, dictum_name, params );
          } );

        }
      }
    }

    constructor( screenplay, manifesto, root, projector ) {
        super();
        this.screenplay = screenplay;
        this.projector = projector;

        this.CAN_SAVE = ( typeof(Storage) !== "undefined" && typeof( window.indexedDB ) !== "undefined" ) || false;
        if( this.CAN_SAVE ){
          let should = localStorage.getItem("should_save") || true; // Defaults to true, false must be explicitly saved to take affect.
          this.SHOULD_SAVE = should;
        } else {
          this.SHOULD_SAVE = false;
        }


        window.addEventListener("popstate", (event) => {
          setTimeout(postPopState, 0); // Running this way ensures last-on the processing stack... ensuring a more predictable page state every time.
        });

        this.manifesto = manifesto;

        // Iterate through the provided dictums, generating event-handling pathways to progress through the manifesto.
        let dictum_names = this.dictum_index = this.manifesto.dictums.keys().toArray();
        for ( const dictum_name of dictum_names ) {

          let dictum = this.manifesto.dictums.get( dictum_name );
          this.Add_Dictum( dictum_name, dictum );
        }

        this.on('first_dictum', async ()=>{

          let dictum_name = this.dictum_index[ 0 ];
          this.emit( `${dictum_name}`, dictum_name );

        });

        this.on('next_dictum', async ()=>{

          this.active_dictum++;
          let dictum_name = this.dictum_index[ this.active_dictum ];
          if( this.active_dictum < this.dictum_index.length ){
            this.emit( `${dictum_name}`, dictum_name );
          } else {
            this.emit( 'manifesto_complete' );
          }

        });

        this.on('next_logic', async ( dictum_name, ndx )=>{

          let dictum = this.manifesto.dictums.get( dictum_name );
          dictum.logic[ ndx ]( this.projector, dictum_name, this, ndx );

        });

        this.on('prev_dictum', async ()=>{

          this.active_dictum--;
          let dictum_name = this.dictum_index[ this.active_dictum ];
          if(this.active_dictum > 0){
            this.emit( `${dictum_name}`, dictum_name );
          } else {
            this.emit( 'first_dictum' );
          }

        });

        this.on('goto_dictum', async ( dictum_name )=>{

          this.active_dictum = this.dictum_index.indexOf( dictum_name );
          dictum_name = this.dictum_index[ this.active_dictum ];
          this.emit( `${dictum_name}`, dictum_name );

        });

        this.on('confirm_dictum', async ( dictum_name )=>{

          this.manifesto.dictums.get( dictum_name ).result.complete = true;
          this.emit('next_dictum');

        });

        this.on('fail_dictum', async ( dictum_name )=>{

          if(this.manifesto.dictums.get( dictum_name ).result.fok) this.emit('next_dictum');
          else this.emit(`${dictum_name}`, dictum_name);

        });

        this.on('manifesto_complete', async function(){

          /* This doesn't necessarily have to happen.
            It fires when the last dictum is completed...
            though new ones may be added as desired. */

        });

        this.on('error', async function(){});

        this.projector.animate();
        this.emit('first_dictum');  // Begin the Manifesto
    }
}


// Manifesto - The strategy for implementing the Screenplay and Workflow. //
class Manifesto{
  dictums;
  constructor( screenplay, workflow ){
    this.dictums = new Map();
  }
}

// Projector - The mechanics of presenting a multi-layered spatial environment projection. //
class Projector{
  root;
  space_time; enable_vr;
  env_scene; env_renderer;
  ui_scene; ui_renderer;
  active_cam; ui_cam; view; controls;
  lil_gui;
  // TODO: Add composer to the environmental render (if device is capable).
  env_post = false; ui_post = false; env_composer = false; ui_composer = false;

  delta = 0;
  fps = 60; frame_interval = 1 / 60;  // Standard Value Default.
  animate = ()=>{
    requestAnimationFrame( this.animate );
    const delta = this.space_time.clock.getDelta();
    this.space_time.beat( delta );
    this.delta += delta;
    if ( this.delta  >= this.frame_interval ) {
      let next_delta = this.delta % this.frame_interval;
      this.update( this.delta, 0 );
      this.direct( this.delta );
      this.render_env();
      this.render_ui();

      this.delta = next_delta;
    }
  }

  // GUI Interactions
  raycaster; mouse; interactives;
  onPointerDown = ( event )=> {

    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // TODO: Redo this for the new camera setup
    this.raycaster.setFromCamera( this.mouse, this.active_cam );
    const intersects = (this.interactives && this.interactives.length > 0) ? this.raycaster.intersectObjects( this.interactives, false ) : [];
    if ( intersects.length > 0 ) {

      // Capture the first clicked target
      const object = intersects[ 0 ].object;
      let pos = object.position;
      if( object.click ) object.click(); // Fire the object's internal click handler if any.

    }

  }
  onResize = ( event )=> {
    this.reset_view();
    this.active_cam.updateProjectionMatrix();
    this.ui_cam.updateProjectionMatrix();
  }

  setEnvSkyCube = async ( cubeTextureSet )=>{
    // NOTE: Currently overriden with WeThe System textures.
    const loader = new THREE.CubeTextureLoader();
    loader.setPath( 'textures/environment/' );
    let textureCube = await loader.load( cubeTextureSet );
    this.env_scene.background = textureCube;
  };

  render_env = ()=>{
    if( this.env_post && this.env_composer ){
      this.env_composer.render(); // TODO: Implement this once ready to add visual complexity.
    } else {
      this.env_renderer.render( this.env_scene, this.active_cam );
  	}
  }
  render_ui = ()=>{
    if(this.ui_post && this.ui_composer){
      this.ui_composer.render();
    } else{
      this.ui_renderer.render( this.ui_scene, this.ui_cam );
  	}
  }
  reset_view = () =>{
    this.view = {};
    this.view.fov = 90;
    this.view.near = 0.1;
    this.view.far = 4487936120730, // 30 AU to see the sun from up to the inner edge of the Kuiper Belt
    this.view.aspect = window.innerWidth / window.innerHeight;
    this.view.major_dim = Math.max( this.view.height, this.view.width );
    this.view.minor_dim = Math.min( this.view.height, this.view.width );
    this.view.height = window.innerHeight;
    this.view.width = window.innerWidth;
    if(this.active_cam) this.active_cam.aspect = this.view.aspect;
    if(this.ui_cam) this.ui_cam.aspect = this.view.aspect;
    if(this.env_renderer) this.env_renderer.setSize( this.view.width, this.view.height );
    if(this.ui_renderer) this.ui_renderer.setSize( this.view.width, this.view.height );
  }

  updatables;
  update = ( delta )=>{
    this.updatables.forEach(( updatable, name )=>{
      if ( updatable.update ) updatable.update( delta, 0 );
    });
  };

  actives = [];
  direct = ( delta )=>{
    this.actives.forEach( ( active, name )=>{
      active.directions.forEach( ( direction, name )=>{
        direction( delta );
      } );
    } );
  }

  constructor( root ){
    this.root = root;
    window.addEventListener( 'pointerdown', this.onPointerDown );
    window.addEventListener( 'resize', this.onResize, { capture: true } );

    this.reset_view();
    this.space_time = new SpaceTime();
    this.updatables = new Map();
    this.interactives = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.env_scene = new THREE.Scene();
    this.env_scene.updates = {
      update: ()=>{},
      cache: {}
    };
    this.updatables.set('env_scene', this.env_scene.updates );
    this.ui_scene = new THREE.Scene();
    this.ui_scene.updates = {
      update: ()=>{},
      cache: {}
    };
    this.updatables.set('ui_scene', this.ui_scene.updates );

    const envr = this.env_renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true
    });

    envr.shadowMap.enabled = true;
    envr.shadowMap.type = THREE.PCFSoftShadowMap; // Ensuring soft shadows for realism

    envr.toneMapping = THREE.ACESFilmicToneMapping;
    envr.toneMappingExposure = 1.2; // Adjusting exposure slightly for better highlights

    envr.physicallyCorrectLights = true; // Ensuring realistic light behavior

    envr.setSize(window.innerWidth, window.innerHeight);
    envr.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    envr.xr.enabled = this.enable_vr;

    // Setting background color to match Lower Decks aesthetic
    envr.setClearColor(0x20232a);

    let envc = envr.domElement;
    envc.id = 'env_canvas';
    document.body.appendChild(envc);

    // Additional configuration for solar system scale scene
    const pmremGenerator = new THREE.PMREMGenerator(envr);
    pmremGenerator.compileEquirectangularShader(); // Prepares renderer for HDR environments


    // User Interface Renderer
    const uir = this.ui_renderer = new CSS3DRenderer( );
    uir.setSize( window.innerWidth, window.innerHeight );
    let uic = uir.domElement;
    uic.id = 'ui_canvas';
    document.body.appendChild( uic );

    // Camera & Controls Setup
    let center_cam = new THREE.PerspectiveCamera( this.view.fov, this.view.aspect, this.view.near, this.view.far );
    center_cam.position.set( 0, 0, 0 );
    //center_cam.lookAt( new THREE.Vector3() );
    center_cam.updateProjectionMatrix();
    this.active_cam = center_cam;

    this.ui_cam = new THREE.PerspectiveCamera( this.view.fov, this.view.aspect, this.view.near, this.view.far );
    //this.ui_cam.position.set( 0, 0, this.view.major_dim );
    this.ui_cam.position.set( 0, 0, 9 );
    this.ui_cam.setRotationFromEuler( new THREE.Euler( center_cam.rotation.x,center_cam.rotation.y,center_cam.rotation.z, 'XYZ' ) );
    this.reset_view();
  }
}

// SceneTransformation - Scripted animation templates run by the system.
class SceneTransformation{
  compile = ()=>{} // This is the computational run, which defines the frames which are then stacked and run by update();
  update = ()=>{}; // or Function()... depends on what you need the 'this' to refer to.
  cache = {}; // This persists beyond each run of the .update() during render... holding the values.
  post = ()=>{};  // same here
  reset = ()=>{};

  constructor( params ){
    this.compile = params.compile;
		this.update = params.update;
		this.cache = params.cache;
		this.post = params.post;
		this.reset = params.reset;

		// Migrate the engine functions into the base SceneTransformation object, for access to 'this'.
		for (const func in params) {
		  if (Object.hasOwn(params, func)) {
				if (func=="update" || func=="cache" || func=="post" || func=="reset" ){}
				else{
					this[func]=params[func];
				}
		  }
		}
  }
}

// Screenplay - The aesthetics and visual interactions of the UI. //
class Screenplay{
  lighting; cameras; scenes; actions; directions; models; projector;

  constructor( _projector ){
    let projector = this.projector = _projector;
    this.lighting = new Map();
    this.cameras = new Map();

    // Camera & Controls Setup
    let center_cam = new THREE.PerspectiveCamera( projector.view.fov, projector.view.aspect, projector.view.near, projector.view.far );
    center_cam.position.set( 0, 0, 9 );
    center_cam.lookAt( new THREE.Vector3() );
    center_cam.updateProjectionMatrix();
    this.cameras.set('Center',  center_cam);
    projector.active_cam = this.cameras.get( 'Center' );

    let dolly_cam = center_cam.clone();
    this.cameras.set('Dolly', dolly_cam );

    this.ui_cam = new THREE.PerspectiveCamera( projector.view.fov, projector.view.aspect, projector.view.near, projector.view.far );
    //this.ui_cam.position.set( 0, 0, this.view.major_dim );
    this.ui_cam.position.set( 0, 0, 9 );
    this.ui_cam.setRotationFromEuler( new THREE.Euler( center_cam.rotation.x,center_cam.rotation.y,center_cam.rotation.z, 'XYZ' ) );

  }
}

class SceneAsset3D extends THREE.Object3D{
  directions;  // Override this with a custom set of functions to be called by the ScreenDirector during the Animate() run of the Screenplay.
  click = ()=>{};

  constructor( obj3D = new THREE.Object3D() ){
    obj3D.directions = new Map();
    return obj3D;
  }
}

// Workflow - The logic and pipelines interactions of the UI. //
class Workflow{



  constructor( react_app ){
    this.react_app = react_app;
  }
}

// Dictum - Analagous to a work pipeline, defining the roles for the UI & environment. //
class Dictum{

  // logic: Passed on by the Manifesto from it's own construction
  // directions: JSON with functions to run for:
  //    on_enter, on_idle, on_progress, on_failure, on_end.
  constructor( logic, directions, okay_to_fail ){
    this.logic = logic;
    this.directions = directions;

    this.result = {
      fok: okay_to_fail
    }
    this.progress = {
      completed: 0,
      failed: 0,
      passed: 0
    };

  }
}

export { ScreenDirector, Projector, Screenplay, SceneAsset3D, SceneTransformation, Workflow, Dictum, Manifesto  };
