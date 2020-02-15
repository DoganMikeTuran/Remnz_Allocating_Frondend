import React, { Component } from "react";
import PanelHeader from "../../components/PanelHeader/PanelHeader";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table
} from "reactstrap";

class Users extends Component {
  render() {
    return (
      <div>
        <PanelHeader size="sm" />
        <div className="container-2">
          <Row>
            <Col md="6">Hej</Col>

            <Col md="6">Farvel</Col>
          </Row>
        </div>
        <h1>All users</h1>
      </div>
    );
  }
}

export default Users;
