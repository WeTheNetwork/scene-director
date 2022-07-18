// ScreenDirector Reference
import { ScreenDirector } from './bin/ScreenDirector.js' ;

// ScreenDirector Implementation Library
import Screenplay from  './implementation/Screenplay.js' ;
import SceneAssets from  './implementation/SceneAssets.js' ;
import SceneDirections from  './implementation/SceneDirections.js' ;
import Manifesto from  './implementation/Manifesto.js' ;
import Workflow from  './implementation/Workflow.js' ;


let app = {};
app.init = ()=>{

  // Initialization
  const confirm_start = ( yes ) => {
    if(yes || window.confirm('start loading?')){
      scene_director.start();
    } else {
      setTimeout(confirm_start, 5000);
    }
  };

  // Scene Director Implementation
  const scene_assets = new SceneAssets();
  const scene_directions = new SceneDirections();
  const screen_play = new Screenplay( scene_assets, scene_directions );
  const workflow = new Workflow();
  const manifesto = new Manifesto( scene_directions, workflow );

  const scene_director = new ScreenDirector(screen_play, manifesto, false);

  // Main Logic
  confirm_start( true );

}

// Execute initialization prior to exportation
app.init();
