import React from 'react';



class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      name: '',
      subMessage: ''
    }
  }
  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }
  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
  }
  onNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  onSubmitSignIn =() => {
    if(!this.state.signInEmail.includes('@')) {
      this.setState({subMessage: 'Please include a @'})
  } else if(this.state.signInPassword.length < 6) {
      this.setState({subMessage: 'Your password is too short'})
  } 
  else if(!this.state.signInPassword.match(/[$@#&!]+/) || !this.state.signInPassword.match(/[0-9]+/)) {
      this.setState({subMessage:'Your password must have at least 1 number and special character'})
  } else if(this.state.name === '') {
      this.setState({subMessage: 'Please include a name'})
  } else {
    fetch('https://afternoon-hollows-91457.herokuapp.com/register', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify( {
        email: this.state.signInEmail,
        password: this.state.signInPassword,
        name: this.state.name
      })
    })
    .then(response => response.json())
    .then( user => {
      if(user.id) {
        this.props.loadUser(user)
        this.props.onRouteChange('home')
      }
    })
}
}
   
    
  render() {
    
    return (
      <article className='br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-1 mw6 shadow-1 center'>
        <main className="pa4 black-80">
      <div className="measure">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f4 fw6 ph0 mh0">Register</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlfor="Name">Name</label>
            <input onChange={this.onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="text"  id="text"/>
          </div>
           <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlfor="email-address">Email</label>
            <input onChange={this.onEmailChange}  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
          </div>
  
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlfor="password">Password</label>
            <input onChange={this.onPasswordChange}  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
          </div>
          <p className='dark-red'>{this.state.subMessage}</p>
        </fieldset>
        <div className="">
          <input onClick={this.onSubmitSignIn} 
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib pointer" 
          type="submit" 
          value="Register"/>
        </div>
        
      </div>
    </main>
      </article>
      
    )
  }
  
}

export default Register;