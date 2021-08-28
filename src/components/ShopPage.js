import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import React from 'react';
import { UserNavBar } from './NavBar';
import { ReqObj, Req } from '../data_structures';

const initialState = {
  show: false,
  id: null,
  vegName: null,
  quantity: null,
  createdAt: null,
  type: null,
  buyerId: null,
  supplierId: null,
  vegId: null,
  status: null,
  fulfillmentStatus: null,
}

class AddRequestCommunityShop extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.setVegName.bind(this);
    this.setQuantity.bind(this);
  }

  handleShow() { this.setState({ show: true }); }
  handleClose() { this.setState({ show: false }); }

  setVegName(event) { this.setState({ name: event.target.value }) }
  setQuantity(event) { this.setState({ quantity: event.target.value }) }

  saveAndClose() {
    console.log('obama hamburger sussy balls (debug)');
    const obj = {
      id: this.id,
      vegName: this.vegName,
      quantity: this.quantity,
      createdAt: this.createdAt,
      type: this.type,
      buyerId: this.buyerId,
      supplierId: this.supplierId,
      vegId: this.vegId,
      status: this.status,
      fulfillmentStatus: this.fulfillmentStatus,
    }
    const newReq = new ReqObj(obj);
    for (let x in newReq) {
      alert(`${x}, ${newReq[x]}`);
    }
    Req.push(newReq);
    this.setState(initialState);
    this.handleClose();
  }

  render() {
    return (<div>
      <Button variant="primary" onClick={this.handleShow.bind(this)}>
        Add Request
      </Button>

      <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Request to Community Shop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Vegetable name: </label>
            <input type="text" placeholder="" onChange={(e) => { this.setVegName(e.target.value) }} value={this.state.vegName} />
            <br />
            <label>Quantity: </label>
            <input type="text" placeholder="" onChange={(e) => { this.setQuantity(e.target.value) }} value={this.state.quantity} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose.bind(this)}>
            Close
          </Button>
          <Button variant="primary" onClick={this.saveAndClose.bind(this)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>)
  }
}

class ShopInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: props.tab,
    }
  }
  render() {
    return (
      <Container>
        <Nav variant="tabs" onSelect={
          (eventKey) => {
            if (eventKey === 'comshop') this.setState({
              tab: 0
            });
            else this.setState({
              tab: 1
            });
          }
        }>
          <Nav.Item>
            <Nav.Link eventKey="comshop">Community Shop</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="onetake">One-take Shop</Nav.Link>
          </Nav.Item>
          <Form inline>
            <Button variant="outline-info">
              Search
            </Button>
          </Form>
        </Nav>
      </Container>
    );
  }
}

export default function ShopPage(props) {
  return <Container>
    <UserNavBar switchHandler={props.switchHandler} curUser={props.curUser} setUser={props.setUser} />
    <ShopInterface />
    <AddRequestCommunityShop /> { /* testing */}
  </Container>
}