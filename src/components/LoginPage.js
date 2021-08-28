import { UserNavBar } from './NavBar';
import { Form } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import * as consts from './constants';
import '../App.css'

function LoginForm(props) {

  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  return <div>
    <Container>
      <Form>
        <div class="flex-container-column">
          <div class="flex-item">
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Control type="text" placeholder="Username" onChange={e => setName(e.target.value)} />
            </Form.Group>
          </div>
          <div class="flex-item">
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Control type="password" placeholder="Password" onChange={e => setPass(e.target.value)} />
            </Form.Group>
          </div>
          <div class="flex-item">
            <Button variant="primary" class="btn" onClick={
              () => { props.loginHandler(name, pass); }
            }>
              Sign In!
            </Button>
            <Button variant="primary" class="btn" onClick={() => props.switchHandler(consts.SCREEN_REGISTER)}>
              Don't have an account ?
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  </div>
}

export default function LoginPage(props) {
  return <div>
    <UserNavBar switchHandler={props.switchHandler} curUser={props.curUser} setUser={props.setUser} />
    <LoginForm switchHandler={props.switchHandler} loginHandler={props.loginHandler} />
  </div>
}