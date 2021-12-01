// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";

// Components
import {
    ResourceList, ConfirmationButton, Appearance, ResourceCard,

    Panel, ComponentSize, Grid, Columns, Form, Input, FlexBox, SlideToggle,
    Button, IconFont, ButtonType, ComponentColor, SelectDropdown, TextArea,
    ComponentStatus, QuestionMarkTooltip, InfluxColors, SquareButton, DapperScrollbars,
    ButtonGroup, Orientation
} from '@influxdata/clockface'

// Helpers
import { NotificationManager } from 'react-notifications';

// Actions
import { fetchUpdateProfile } from "../../store/index";

class EditProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            location: "",
        }
    }

    componentDidMount() {
        this.setFormFields();
    }

    setFormFields = () => {
        const { user } = this.props;
        console.log(user.location);

        this.setState({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            location: user.location || "",
        })
    }

    save = async () => {
        const { firstname, lastname, email, location } = this.state;
        const { fetchUpdateProfile } = this.props;

        if (firstname.trim() === "" || lastname.trim() === "" || email.trim() === "") {
            NotificationManager.error('Firstname, Lastname and Email cannot be empty', 'Error', 3000);
            return;
        }

        const profile = {
            firstname,
            lastname,
            email,
            location
        }

        console.log(profile);

        await fetchUpdateProfile(profile);
    }

    render() {
        const { firstname, lastname, email, username, role, createdAt, location } = this.state;
        const { user } = this.props;

        return (
            <Panel style={{ marginTop: '30px' }}>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <Grid>
                        <Grid.Row>
                            {/* LEFT SIDE */}
                            <Grid.Column widthXS={Columns.Twelve}>
                                <Panel style={{ backgroundColor: '#292933', padding: '10px' }}>
                                    <Grid.Row>
                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Firstname"
                                                required={true}
                                            >
                                                <Input
                                                    onChange={(e) => { this.setState({ firstname: e.target.value }) }}
                                                    value={firstname}
                                                />
                                            </Form.Element>
                                        </Grid.Column>

                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Lastname"
                                                required={true}
                                            >
                                                <Input
                                                    onChange={(e) => { this.setState({ lastname: e.target.value }) }}
                                                    value={lastname}
                                                />
                                            </Form.Element>
                                        </Grid.Column>

                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Email"
                                                required={true}
                                            >
                                                <Input
                                                    onChange={(e) => { this.setState({ email: e.target.value }) }}
                                                    value={email}
                                                />
                                            </Form.Element>
                                        </Grid.Column>

                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Username"
                                                required={true}
                                            >
                                                <Input
                                                    value={user.username}
                                                    status={ComponentStatus.Disabled}
                                                />
                                            </Form.Element>
                                        </Grid.Column>


                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Role"
                                                required={true}
                                            >
                                                <Input
                                                    value={user.role}
                                                    status={ComponentStatus.Disabled}
                                                />
                                            </Form.Element>
                                        </Grid.Column>


                                        <Grid.Column widthXS={Columns.Six}>
                                            <Form.Element
                                                label="Created At"
                                                required={true}
                                            >
                                                <Input
                                                    value={new Date(user.createdAt["$date"])}
                                                    status={ComponentStatus.Disabled}
                                                />
                                            </Form.Element>
                                        </Grid.Column>

                                        <Grid.Column widthXS={Columns.Twelve}>
                                            <Form.Element
                                                label="Address/Location"
                                            >
                                                <TextArea
                                                    value={location}
                                                    onChange={(e) => { this.setState({ location: e.target.value }) }}
                                                    rows={3}
                                                />
                                            </Form.Element>
                                        </Grid.Column>

                                    </Grid.Row>
                                </Panel>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Panel.Header>

                <Panel.Footer>
                    <Button
                        text="Save"
                        icon={IconFont.Checkmark}
                        type={ButtonType.Button}
                        color={ComponentColor.Primary}
                        size={ComponentSize.Medium}
                        onClick={this.save}
                    />
                </Panel.Footer>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUpdateProfile: (payload) => dispatch(fetchUpdateProfile(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);