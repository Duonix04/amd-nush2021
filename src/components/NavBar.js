import { Container } from "react-bootstrap";
import { Nav, Navbar } from "react-bootstrap";
import React from 'react';
import * as consts from './constants';

export function MainNavBar(props) { // for main page and login page
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => props.switchHandler(consts.SCREEN_MAIN)}>
          AMD-Green
        </Navbar.Brand>
      </Container>
    </Navbar >
  );
}

export function UserNavBar(props) { // for user page and shop page
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => props.switchHandler(consts.SCREEN_MAIN)}>AMD-Green</Navbar.Brand>
        <Nav className="me-auto" onSelect={(eventKey) => {
          if (eventKey === consts.LOGOUT) {
            props.switchHandler(consts.SCREEN_LOGIN);
            props.setUser(null);
          }
          else props.switchHandler(eventKey);
        }}>
          <Nav.Link eventKey={consts.SCREEN_USER}>User</Nav.Link>
          <Nav.Link eventKey={consts.SCREEN_SHOP}>Shop</Nav.Link>
          {(props.curUser === null)
            ? <Nav.Link eventKey={consts.SCREEN_LOGIN}>Login</Nav.Link>
            : <Nav.Link eventKey={consts.LOGOUT}>Logout</Nav.Link>
          }
        </Nav>
      </Container>
    </Navbar>
  );
}