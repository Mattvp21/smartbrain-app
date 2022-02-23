import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation.component';
import './App.css';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank';
import Particles from "react-tsparticles";

import FacialRecognition from './components/FacialRecognition/FacialRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
window.process = {
  env: {
      NODE_ENV: 'development'
  }
} 



const initialState = {
    input: '',
      imageUrl: '',
      box: {},
      route: 'Signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''  
}
} 


class App extends Component  {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined 
    }})
  }

 

  componentDidMount() {
    fetch('https://afternoon-hollows-91457.herokuapp.com/')
    .then(response => response.json())
    .then(console.log)
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    };
  }


  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value})
    
  }
  

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
       fetch("https://afternoon-hollows-91457.herokuapp.com/imageurl", {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify( {
              input: this.state.input
            })
          })
        .then(response => response.json())
        .then((response) =>{
          if(response){
           fetch("https://afternoon-hollows-91457.herokuapp.com/image", {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify( {
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries:count}))
          })
         
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
        .catch((error) => console.log('error', error))
     
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }


  render() {
    const {imageUrl, route, isSignedIn, box} = this.state;
    return (
      <div className="App">
     <Particles
    params={{
	    "particles": {
	        "number": {
	            "value": 60,
	            "density": {
	                "enable": true,
	                "value_area": 1500
	            }
	        },
	        "line_linked": {
	            "enable": true,
	            "opacity": 0.02
	        },
	        "move": {
	            "direction": "right",
	            "speed": 0.05
	        },
	        "size": {
	            "value": 1
	        },
	        "opacity": {
	            "anim": {
	                "enable": true,
	                "speed": 1,
	                "opacity_min": 0.05
	            }
	        }
	    },
	    "interactivity": {
	        "events": {
	            "onclick": {
	                "enable": true,
	                "mode": "push"
	            }
	        },
	        "modes": {
	            "push": {
	                "particles_nb": 1
	            }
	        }
	    },
	    "retina_detect": true
	}} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
        ? 
        <div>
          <Logo />
          <Rank username={this.state.user.name} userentries={this.state.user.entries} />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
          <FacialRecognition imageUrl={imageUrl} box={box} />
        </div>
        :(
          this.state.route === 'Signin' ?  
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : 
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        ) 
       
        
      
        }
        
        
        
       
      </div>
    );
  }
}

export default App;
