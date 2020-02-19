import React from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from "reactstrap";
import { CreatableSelect } from "@atlaskit/select";
// react plugin used to create DropdownMenu for selecting items
import Select from "react-select";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Creatable } from "react-select";
import Panelheader from "../../components/PanelHeader/PanelHeader";

const createOption = label => ({
  label,
  value: label.toLowerCase().replace(/\W/g, "")
});

class CreateSkill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOptions: [],
      name: "",
      id: "",
      input: "",
      isLoading: false,
      value: undefined
    };
  }

  componentDidMount() {
    const decode = jwt_decode(localStorage.getItem("accessToken"));
    axios.get("https://localhost:5001/api/skill").then(response => {
      const selectOptions = response.data.map(item => ({
        value: item.id,
        label: item.name
      }));
      this.setState({ selectOptions });
    });

    console.log(this.state.selectedValue);
  }
  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = e => {
    e.preventDefault();
    axios
      .post("https://localhost:5001/api/subskill", {
        name: this.state.name,
        skillid: this.state.value.value,
        id: this.state.id,
        clientid: parseInt(localStorage.getItem("decoded"))
      })

      .then(response => {
        console.log("Hello world", response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value: newValue });
  };

  handleCreate = inputValue => {
    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoading: true });
    console.group("Option created");
    console.log("Wait a moment...");
    const { selectOptions } = this.state;
    const newOption = createOption(inputValue);
    console.log(newOption);
    console.groupEnd();

    axios
      .post("https://localhost:5001/api/skill", {
        name: newOption.label,
        clientid: parseInt(localStorage.getItem("decoded"))
      })

      .then(response => {
        console.log("Hello world post response", response);
        axios.get("https://localhost:5001/api/skill").then(response => {
          const selectOptions = response.data.map(item => ({
            value: item.id,
            label: item.name
          }));
          this.setState({ selectOptions });
          console.log(selectOptions);

          for (let index = 0; index < selectOptions.length; index++) {
            if (selectOptions[index].label === newOption.label) {
              newOption.value = selectOptions[index].value;
              console.log(newOption.value);
              console.log(selectOptions[index].value);
              this.setState({
                isLoading: false,
                selectOptions: [...selectOptions],
                value: newOption
              });
            }
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
    console.log(newOption);
  };

  render() {
    if (this.state.value != null) {
      console.log(this.state.value.value);
    }
    const { isLoading, options, value } = this.state;
    return (
      <div>
        <Panelheader size="sm" />
        <div className="content">
          <form onSubmit={this.submitHandler}>
            <Row>
              <Col xs="6">
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle>Create SubSkill</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <CreatableSelect
                      isClearable
                      isLoading={isLoading}
                      onChange={this.handleChange}
                      onCreateOption={this.handleCreate}
                      options={this.state.selectOptions}
                      value={value}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6">
                <Card className="card-chart">
                  <CardHeader>
                    <CardTitle>Create SubSkill</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <input
                      placeholder="Sub-Skill Name"
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.changeHandler}
                    />
                    <p></p>
                    <input
                      placeholder="id"
                      type="number"
                      name="id"
                      value={this.state.id}
                      onChange={this.changeHandler}
                    />
                    <Button>go</Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateSkill;
