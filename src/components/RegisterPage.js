import { UserNavBar } from './NavBar';
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
// import { addUser } from '../db_utils'
import { useState } from 'react';
// const mongoose = require('mongoose');
function RegisterForm(props) {
  // console.log(mongoose.connect);
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [cpass, setCpass] = useState('');
  const [locX, setLocX] = useState(0);
  const [locY, setLocY] = useState(0);
  const [contacts, setContacts] = useState('');
  const [error, setError] = useState('');
  return <Container>
    <Form>
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Control type="text" placeholder="Username" onChange={e => setName(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Control type="password" placeholder="Password" onChange={e => setPass(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Control type="password" placeholder="Confirm your password" onChange={e => setCpass(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCoordinate">
        <Form.Control type="text" placeholder="Your X-Coordinate" onchange={e => setLocX(parseInt(e.target.value))} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCoordinate">
        <Form.Control type="text" placeholder="Your Y-Coordinate" onchange={e => setLocY(parseInt(e.target.value))} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formContacts">
        <Form.Control type="text" placeholder="Your contacts" onChange={e => setContacts(e.target.value)} />
      </Form.Group>

      <Button variant="primary" onClick={
        () => { props.registerHandler(name, pass, locX, locY, contacts); }
      }>
        Sign Up!

      </Button >
    </Form>
    {error}
  </Container >
}

export default function RegisterPage(props) {
  return <>
    <UserNavBar switchHandler={props.switchHandler} curUser={props.curUser} setUser={props.setUser} />
    <RegisterForm registerHandler={props.registerHandler} />
  </>
}