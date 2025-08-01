import { SceneTransformation } from '../bin/ScreenDirector.js';
import React, { useState, useEffect, useRef, Fragment, Component } from 'react';
// Support Library Reference
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import jsQR from 'jsqr';
import GUI from 'lil-gui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: false };
  }
  // Update state so the next render will show the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }
  // You can also log the error to an error reporting service
  componentDidCatch(error, errorInfo) {
    console.error( error, errorInfo );
  }

  render() {
    // You can render any custom fallback UI
    if (this.state.hasError) {
      return (<><h1>Something went wrong.</h1><p>{this.state.error}</p></>);
    }
    return this.props.children;
  }
}
function LoginForm( { director, projector, dictum_name, ndx }) {
  const [uname, setUname] = useState("");
  const [pword, setPword] = useState("");
  const [saveu, setSaveu] = useState(false);
  const [phase, setPhase] = useState(0);
  const [enter, setEnter] = useState(false);
  const [exit, setExit] = useState(false);
  const panel = useRef();
  const submitButton = useRef(null);
  function cleanup(){
    const root = document.getElementById( "root" );
    root.classList.remove( "no_gui" );
  }

  // Initialization --> Singleton
  useEffect(()=>{
    const root = document.getElementById( "root" );
    root.classList.add( "no_gui" );

    const entrance_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = entrance_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          entrance_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in 15 frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        entrance_transition.cache.duration = 15;
        entrance_transition.cache.frame = 0;
        projector.updatables.set( 'ResumeUserModal_entrance_transition', entrance_transition );
      },
      post: ( )=>{
        let cache = entrance_transition.cache;
        projector.updatables.delete( 'ResumeUserModal_entrance_transition' );
        panel.current.style.transform = `scale(1)`;
      }
    });
    setEnter( entrance_transition );
    const exit_transition = new SceneTransformation({
      update: ( delta )=>{
        let cache = exit_transition.cache;
        if( ++cache.frame <= cache.duration ){
          let progress = 1 - cache.frame / cache.duration;
          panel.current.style.scale = progress;

        } else {
          exit_transition.post( );  // This calls for the cleanup of the object from the scene and the values from itself.
        }
      },
      cache: {
        duration: 15, /* do something in this many frames */
        frame: 0,
        manual_control: false,
        og_transition: false
      },
      reset: ()=>{
        exit_transition.cache.duration = 15;
        exit_transition.cache.frame = 0;
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit_transition );
      },
      post: ( )=>{
        let cache = exit_transition.cache;
        projector.updatables.delete( 'ResumeUserModal_exit_transition' );
        panel.current.style.transform = `scale(0)`;
        director.emit( `${dictum_name}_progress`, dictum_name, ndx );
      }
    });
    setExit( exit_transition );
    projector.updatables.set( 'ResumeUserModal_entrance_transition', entrance_transition );

    return cleanup;
  },[]);

  const handleSubmitResumeUser = async ( event ) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.autocomplete = 'off'; // --> Fix for Firefox. It persists the dynamic disabled state without this hack.

    await uname;
    await pword;
    await saveu;
    let login = new Request("/tokens",{
      method:"PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username:uname,
        password:pword,
        saveu:saveu})
      });

    fetch( login ).then( async res => {
      submitButton.disabled = false

      if( res.status >= 100 && res.status <= 199 ){
        alert( 'Hrm... not a clue why you are receiving this response... continuing anonymously.  I guess, log in later?!' );
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 200 && res.status <= 299 ){
        let _uname = res.headers.get("uname");
        if ( director.CAN_SAVE ) localStorage.setItem( "uname", _uname );
        let _token = res.headers.get("token");
        if ( director.CAN_SAVE ) localStorage.setItem( "token", _token );
        ResumeUser( _uname, _token );
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 300 && res.status <= 399 ){
        alert( 'Danger!  An unauthorized redirection has occurred with your login credentials... continuing anonymously.');
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 400 && res.status <= 499 ){
        alert( 'Unauthorized.  Verify the credentials used and retry, or create a new user if you are not yet registered!' );
      }
      if( res.status >= 500 && res.status <= 599 ){
        alert( 'You are disconnected from the WeThe Network... system will continue anonymously.');
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
    });
  }

  const handleSubmitNewUser = async ( event ) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.autocomplete = 'off'; // --> Fix for Firefox. It persists the dynamic disabled state without this hack.

    await uname;
    await pword;
    let register = new Request("/users",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await JSON.stringify({
        username:uname,
        password:pword,
        contactPath:{ email:'sjaycgf@gmail.com'}
      })
    });

    fetch( register ).then( res => {
      submitButton.disabled = false

      if( res.status >= 100 && res.status <= 199 ){
        alert( 'Hrm... not a clue why you are receiving this response... continuing anonymously.  I guess, register later?!' );
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 200 && res.status <= 299 ){
        let _uname = res.headers.get("uname");
        if ( director.CAN_SAVE ) localStorage.setItem( "uname", _uname );
        let _token = res.headers.get("token");
        if ( director.CAN_SAVE ) localStorage.setItem( "token", _token );
        ResumeUser( _uname, _token );
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 300 && res.status <= 399 ){
        alert( 'Danger!  An unauthorized redirection has occurred with your login credentials... continuing anonymously.');
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
      if( res.status >= 400 && res.status <= 499 ){
        alert( 'Unauthorized Registration... did you mean to log in instead?' );
      }
      if( res.status >= 500 && res.status <= 599 ){
        alert( 'You are disconnected from the WeThe Network... system will continue anonymously.');
        projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
      }
    });
  }

  const handleAnonymousUser = async ( event ) => {

    projector.updatables.set( 'ResumeUserModal_exit_transition', exit );
  }

  const changeInputs = async ( event, which_input ) => {
    switch(which_input){
      case 1:
        setUname(event.target.value);
        break;

      case 2:
        setPword(event.target.value);
        break;

      case 3:
        setSaveu(!saveu);
        break;
    }
  }

  switch(phase){
    case 0: // Top-Level Options
      return (
        <div ref={ panel } className="pip_gui pip_chat" >
          <h1 className="pip_title">Captain Assignment</h1>
          <span className="ui_side pip_text" style={{ gridRow: 2 }}>
          Greetings Captain.
          </span>
          <span className="ui_side pip_text" style={{ gridRow: 3 }}>What are your orders?</span>
          <div className="user_side pip_text" style={{ gridRow: 25}}>
            <label htmlFor="login_button">Login:</label>
            <input
              name="login_button"
              className="pip_accept"
              type="button"
              value="login"
              onClick={(e) => setPhase( 1 )}/>
              <br />
              <label htmlFor="new_user_button">New Captain:</label>
              <input
              name="new_user_button"
              className="pip_accept"
              type="button"
              value="New"
              onClick={(e) => setPhase( 2 )} />
              <br />
              <label htmlFor="anonymous_button">Anonymously:</label>
              <input
              name="anonymous_button"
              className="pip_cancel"
              type="button"
              value="Anon"
              onClick={(e) => setPhase( 3 )} />
          </div>

        </div>);
      break;

    case 1: // Login Captain

      return (
        <>

        <div ref={ panel } className="pip_gui pip_chat" >
          <h1 className="pip_title">Authorization Required</h1>
          <span className="ui_side pip_text" style={{ gridRow: 2 }}>
          Greetings Captain.
          </span>
          <span className="ui_side pip_text" style={{ gridRow: 3 }}>How do you prefer to be addressed?</span>
          <form onSubmit={handleSubmitResumeUser} className="user_side pip_text" style={{ gridRow: 25}}>
            <label htmlFor="username">User:</label>
            <input
              name="username"
              type="text"
              autoComplete="username"
              value={uname}
              onChange={(e) => changeInputs(e, 1)}

            /><br />
            <label htmlFor="password">Pass:</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={pword}
              onChange={(e) => changeInputs(e, 2)}
            />
            <br />
            <label htmlFor="submit">Submit:</label>
            <input name="submit" type="submit" value="Go" className="pip_accept" ref={ submitButton } />
            <br />
            <label htmlFor="back">Return:</label>
            <input
              name="back"
              className="pip_cancel"
              style={{ marginLeft: '1rem' }}
              type="button"
              onClick={(e) => setPhase( 0 )} value="Back"/>
            <br />
            <label htmlFor="keep_logged">Keep me logged in:</label>
              <input
                name="keep_logged"
                type="checkbox"
                value={saveu}
                onChange={(e) => changeInputs(e, 3)}
              />
          </form>
        </div>
      </>);
      break;

    case 2: // Register New Captain
      return (
        <>

        <div ref={ panel } className="pip_gui pip_chat" >
          <h1 className="pip_title">New Captain</h1>
          <span className="ui_side pip_text" style={{ gridRow: 2 }}>
          Greetings Captain.
          </span>
          <span className="ui_side pip_text" style={{ gridRow: 3 }}>How do you prefer to be addressed?</span>
          <form onSubmit={handleSubmitNewUser} className="user_side pip_text" style={{ gridRow: 25}}>

          <label htmlFor="username">User:</label>
          <input
            name="username"
            type="text"
            autoComplete="username"
            value={uname}
            onChange={(e) => changeInputs(e, 1)}

          />
          <br />
          <label htmlFor="password">Pass:</label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={pword}
              onChange={(e) => changeInputs(e, 2)}
            />
          <br />
          <label htmlFor="submit">Submit:</label>
          <input name="submit" type="submit" value="Go" className="pip_accept" ref={ submitButton } />
          <br />
          <label htmlFor="back">Go Back:</label>
          <input
            name="back"
            className="pip_cancel"
            style={{ marginLeft: '1rem' }}
            type="button"
            onClick={(e) => setPhase( 0 )} value="Back"/>
          <br />
          <label htmlFor="keep_logged">Keep me logged in:</label>
            <input
              name="keep_logged"
              type="checkbox"
              value={saveu}
              onChange={(e) => changeInputs(e, 3)}
            />
          </form>
        </div>
      </>);
      break;

    case 3: // Proceed Anonymously
      return (
        <>

          <div ref={ panel } className="pip_gui pip_chat" >
            <h1 className="pip_title">Anonymous Pilot</h1>
            <span className="ui_side pip_text" style={{ gridRow: 2 }}>As you wish.  Welcome pilot!</span>
            <span className="ui_side pip_text" style={{ gridRow: 3 }}>I must inform you that persistant changes will NOT be available to you until you choose to login to a registered Captain's chair.</span>
            <div className="user_side pip_text" style={{ gridRow: 25}}>
              <label>Acknowledge:<input
                name="ack"
                className="pip_accept"
                style={{ marginLeft: '1rem' }}
                type="button"
                onClick={handleAnonymousUser} value="Ok"/></label>
              <br />
              <label>Reconsider:<input
                name="back"
                className="pip_cancel"
                style={{ marginLeft: '1rem' }}
                type="button"
                onClick={(e) => setPhase( 0 )} value="Back"/></label>
            </div>
          </div>
        </>);
      break;

  }
}

export { ErrorBoundary, LoginForm};
