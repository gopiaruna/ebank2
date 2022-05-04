import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', IsErrorMsg: false, errorMsg: ''}

  onChangeUserId = e => {
    this.setState({
      userId: e.target.value,
      IsErrorMsg: false,
      errorMsg: '',
    })
  }

  onChangePin = e => {
    this.setState({
      pin: e.target.value,
      IsErrorMsg: false,
      errorMsg: '',
    })
  }

  onSubUserPin = async e => {
    e.preventDefault()
    const {userId, pin} = this.state
    if (userId.length === 0 && pin.length === 0) {
      this.setState({IsErrorMsg: true, errorMsg: 'Invalid UserID'})
    } else if (userId.length === 0) {
      this.setState({IsErrorMsg: true, errorMsg: 'Invalid UserID'})
    } else if (pin.length === 0) {
      this.setState({IsErrorMsg: true, errorMsg: 'Invalid Pin'})
    } else {
      const url = 'https://apis.ccbp.in/ebank/login'
      const data = {
        pin,
        user_id: userId,
      }

      const options = {
        method: 'POST',
        body: JSON.stringify(data),
      }

      const response = await fetch(url, options)
      const dataX = await response.json()
      const jwtToken = dataX.jwt_token

      if (response.ok === true) {
        const {history} = this.props
        Cookies.set('jwt_token', jwtToken, {expires: 30})
        history.replace('/')
      } else {
        this.setState({IsErrorMsg: true, errorMsg: dataX.error_msg})
      }
    }
  }

  render() {
    const {userId, pin, IsErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="container">
        <div className="container-1">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
          />
        </div>
        <form className="container-2" onSubmit={this.onSubUserPin}>
          <h1>Welcome Back!</h1>
          <label className="label-el" htmlFor="input-user-id">
            User ID
          </label>
          <input
            className="input-el"
            type="text"
            id="input-user-id"
            onChange={this.onChangeUserId}
            value={userId}
          />

          <label className="label-el" htmlFor="input-pin">
            PIN
          </label>
          <input
            className="input-el"
            type="password"
            id="input-pin"
            onChange={this.onChangePin}
            value={pin}
          />

          <button className="login-btn" type="submit">
            Login
          </button>
          {IsErrorMsg && <p className="error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
