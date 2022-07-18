import * as THREE from './lib/three.min.js';
import { Screenplay as _Screenplay } from './bin/ScreenDirector.js';


class Screenplay extends _Screenplay{

  constructor( scene_assets, scene_directions ){
    // The super-class will apply the scene_assets and scene_directions as properties.
    super( scene_assets, scene_directions );

  }
}

export { Screenplay }
