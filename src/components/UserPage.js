import Button from "react-bootstrap/Button";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Form } from "react-bootstrap";
import React from 'react';
import { useState } from 'react';
import { UserNavBar } from './NavBar';
import { Modal } from 'react-bootstrap';

import { Veg, Req, User, addVeg } from '../data_structures';


function UserWallet(props) {
  return <div>
    <Container fluid>
      <Row>
        <Col>Name: {props.user.name}</Col>
        <Col>GreenPoints: {props.user.gPoints}</Col>
        <Col>GreenCoins: {props.user.gCoins}</Col>
      </Row>
    </Container>
  </div>
}

function UserVegCard(props) {
  const supplier = User.find((obj) => {
    return (obj.id === props.veg.supplierId);
  });
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img></Card.Img>
      <Card.Body>
        <Card.Title>{props.veg.vegName}</Card.Title>
        <Card.Text>
          <br />
          Quantity: {props.veg.quantity}kg <br />
          Supplier: {supplier.name}<br />
          Date supplied: {props.veg.date}<br />
        </Card.Text>
      </Card.Body>
      <Button variant="primary">Go somewhere</Button>
    </Card>
  );
}

function UserRequestCard(props) {

  const supplier = User.find((obj) => {
    return (obj.id === props.req.supplierId);
  });

  const buyer = User.find((obj) => {
    return (obj.id === props.req.buyerId);
  });
  return <Card style={{ width: '18rem' }}>
    <Card.Img></Card.Img>
    <Card.Body>
      <Card.Title>{props.req.vegName}</Card.Title>
      <Card.Text>
        Quantity: {props.req.quantity}kg
        <br />
        Buyer: {buyer.name}
        <br />
        Supplier: {(props.req.supplierId != null) ? supplier.name : 'TBD'}
      </Card.Text>
    </Card.Body>
  </Card>
}

const vegList = [{
  name: 'rau den',
  count: 2,
},
{
  name: 'rau ngot',
  count: 1,
}
];

const requestList = [{
  buyer: 'lmao',
  vegName: 'rau den',
  count: 1,
}];

function AddVegetablesButton(props) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [qt, setQt] = useState(0);
  const [img, setImg] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Vegetables to sell
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Vegetables to Sell</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formVeg">
            <Form.Control type="text" placeholder="Vegetable Name" onChange={e => setName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNum">
            <Form.Control type="text" placeholder="Quantity" onChange={e => setQt(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Control type="text" placeholder="Image Link" onChange={e => setImg(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            try {
              addVeg(name, qt, props.curUser, img);
              alert('Success!');
              props.renderer();
              handleClose()
            }
            catch (e) {
              alert(e);
            }
          }}>
            Add!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vegs: props.vegs,
      requests: props.requests,
      tab: 0,
    };
  }
  render() {
    let cardList = (this.state.tab === 0) ? this.state.vegs.map((obj) => {
      return <UserVegCard veg={obj} />
    })
      :
      this.state.requests.map((obj) => {
        return <UserRequestCard req={obj} />
      });
    return <div>
      <Nav variant="tabs" onSelect={
        (eventKey) => {
          if (eventKey === 'veg') this.setState({
            tab: 0
          });
          else this.setState({
            tab: 1
          });
        }
      }>
        <Nav.Item>
          <Nav.Link eventKey="veg">Your vegetables</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="request">Your requests</Nav.Link>
        </Nav.Item>
        <AddVegetablesButton renderer={this.props.renderer} curUser={this.props.curUser} />
      </Nav>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        {cardList}
      </div>
    </div>
  }
}

export default function UserPage(props) {
  const [cnt, setCnt] = useState(0);
  let vegList = Veg.filter((obj) => { return (obj.supplierId === props.curUser.id); });
  let reqList = Req.filter((obj) => { return (obj.supplierId === props.curUser.id || obj.buyerId === props.curUser.id); });
  return (
    <div>
      <UserNavBar switchHandler={props.switchHandler} curUser={props.curUser} setUser={props.setUser} />
      <UserWallet user={props.curUser} />
      <UserList curUser={props.curUser} vegs={vegList} requests={reqList} renderer={() => { setCnt(cnt + 1); }} />
    </div>
  );
}