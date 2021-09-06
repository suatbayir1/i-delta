// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Panel, ComponentSize, Grid, Columns, Form, Input, FlexBox, SlideToggle,
    Button, IconFont, ButtonType, ComponentColor, SelectDropdown, TextArea,
    ComponentStatus, QuestionMarkTooltip, InfluxColors, SquareButton, DapperScrollbars,
} from '@influxdata/clockface'

// Constants
import {
    tipStyle, personalInformation, addressesOfBCandSC,
} from '../../shared/constants/tips';

// Notifications
import { NotificationManager } from 'react-notifications';

// Actions
import { fetchGenerateDID } from "../../store/";

class GenerateDID extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addresses: [
                { type: "", address: "" }
            ],
            name: "",
            email: "",
            location: "",
        }
    }

    componentDidMount() {
        const { user } = this.props;
        this.setState({ name: `${user.firstname} ${user.lastname}` })
    }

    changeType = (e, index) => {
        const { addresses } = this.state
        addresses[index].type = e
        this.setState({ addresses })
    }

    changeAddress = (e, index) => {
        console.log(e);
        const { addresses } = this.state
        addresses[index].address = e
        this.setState({ addresses })
    }

    remove = (index) => {
        const { addresses } = this.state
        addresses.splice(index, 1)
        this.setState({ addresses })
    }

    generate = async () => {
        const { addresses, name, email, location, } = this.state;
        const { fetchGenerateDID, user } = this.props;
        let error = false;

        if (name.trim() === "" || email.trim() === "") {
            NotificationManager.error('Name or email cannot be empty', 'Error', 3000);
            return;
        }

        addresses.forEach(address => {
            if (address.type === "" || address.address.trim() === "") {
                NotificationManager.error('Type and address cannot be empty', 'Error', 3000);
                error = true;
                return;
            }
        })

        console.log("user", user);

        if (!error) {
            const payload = {
                name,
                email,
                location,
                addresses,
                createdAt: Date.now()
            }

            console.log(payload);
            await fetchGenerateDID(payload);
        }
    }

    render() {
        const { addresses, name, email, location, } = this.state;

        return (
            <>
                <Panel style={{ marginTop: '30px' }}>
                    <Panel.Header size={ComponentSize.ExtraSmall}>
                        <Grid>
                            <Grid.Row>
                                {/* LEFT SIDE */}
                                <Grid.Column widthXS={Columns.Six}>
                                    <Panel style={{ backgroundColor: '#292933', padding: '10px' }}>
                                        <FlexBox
                                            style={{ marginBottom: '20px' }}
                                            margin={ComponentSize.Medium}
                                        >
                                            <h2 style={{ color: '#B1B6FF' }}>Personal Information</h2>
                                            <QuestionMarkTooltip
                                                diameter={20}
                                                tooltipStyle={{ width: '400px' }}
                                                color={ComponentColor.Secondary}
                                                tooltipContents={<div style={{ whiteSpace: 'pre-wrap', fontSize: "13px" }}>
                                                    <div style={{ color: InfluxColors.Star }}>{"Personal information:"}
                                                        <hr style={tipStyle} />
                                                    </div>
                                                    {personalInformation}
                                                </div>}
                                            />
                                        </FlexBox>

                                        <Grid.Row>
                                            <Grid.Column widthXS={Columns.Six}>
                                                <Form.Element
                                                    label="Name"
                                                    required={true}
                                                >
                                                    <Input
                                                        onChange={(e) => { this.setState({ name: e.target.value }) }}
                                                        value={name}
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
                                        </Grid.Row>

                                        <Grid.Row>
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

                                {/* RIGHT SIDE */}
                                <Grid.Column widthXS={Columns.Six}>
                                    <Panel style={{ backgroundColor: '#292933', padding: '10px' }}>
                                        <FlexBox
                                            style={{ marginBottom: '20px' }}
                                            margin={ComponentSize.Medium}
                                        >
                                            <h2 style={{ color: '#B1B6FF' }}>BC & SC Addresses</h2>
                                            <QuestionMarkTooltip
                                                diameter={20}
                                                tooltipStyle={{ width: '400px' }}
                                                color={ComponentColor.Secondary}
                                                tooltipContents={<div style={{ whiteSpace: 'pre-wrap', fontSize: "13px" }}>
                                                    <div style={{ color: InfluxColors.Star }}>{"BC & SC Adresses:"}
                                                        <hr style={tipStyle} />
                                                    </div>
                                                    {addressesOfBCandSC}
                                                </div>}
                                            />
                                        </FlexBox>

                                        <Grid.Row >
                                            <Grid.Column widthSM={Columns.Six}>
                                                <Button
                                                    text="Add Address"
                                                    icon={IconFont.Plus}
                                                    color={ComponentColor.Primary}
                                                    onClick={() => {
                                                        this.setState({
                                                            addresses: [...this.state.addresses, { type: "", address: "" }]
                                                        })
                                                    }}
                                                />

                                            </Grid.Column>
                                        </Grid.Row>

                                        <div>
                                            <DapperScrollbars
                                                autoHide={false}
                                                noScrollX={true}
                                                autoSizeHeight={true}
                                                style={{ maxHeight: '200px' }}
                                                className="data-loading--scroll-content"
                                            >
                                                {addresses.map((item, index) => {
                                                    return (
                                                        <Grid.Row style={{ marginTop: "10px" }} key={index}>
                                                            <Grid.Column widthSM={Columns.Three}>
                                                                <Form.Element
                                                                    label="Type"
                                                                    required
                                                                >
                                                                    <SelectDropdown
                                                                        options={["BC", "SC"]}
                                                                        selectedOption={addresses[index].type}
                                                                        onSelect={(e) => { this.changeType(e, index) }}
                                                                    />
                                                                </Form.Element>
                                                            </Grid.Column>

                                                            <Grid.Column widthSM={Columns.Eight}>
                                                                <Form.Element
                                                                    label="Address"
                                                                    required
                                                                >
                                                                    <Input
                                                                        placeholder={""}
                                                                        onChange={(e) => { this.changeAddress(e.target.value, index) }}
                                                                        value={addresses[index].address}
                                                                    />
                                                                </Form.Element>
                                                            </Grid.Column>

                                                            <Grid.Column widthSM={Columns.One}>
                                                                <FlexBox margin={ComponentSize.Medium}>
                                                                    <Form.Element
                                                                        label=""
                                                                        style={{ paddingTop: '18px' }}
                                                                    >
                                                                        <SquareButton icon="remove"
                                                                            onClick={() => { this.remove(index) }}>
                                                                        </SquareButton>
                                                                    </Form.Element>
                                                                </FlexBox>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    )
                                                })}
                                            </DapperScrollbars>
                                        </div>
                                    </Panel>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Panel.Header>

                    <Panel.Footer>
                        <Button
                            text="Generate"
                            icon={IconFont.Checkmark}
                            type={ButtonType.Button}
                            color={ComponentColor.Primary}
                            size={ComponentSize.Medium}
                            onClick={this.generate}
                        />
                    </Panel.Footer>
                </Panel>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGenerateDID: (payload) => dispatch(fetchGenerateDID(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateDID);