// Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Components
import {
    Panel, Form, ComponentSize, Grid, Columns,
    ComponentColor, IconFont, Button, ButtonType,
} from '@influxdata/clockface'

class RightSideInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
        }
    }


    getText = () => {
        const { selectedAction } = this.props;
        let text = "";

        selectedAction?.transactions.map((transaction, idx) => {
            text += ` ${idx + 1} - ${transaction.source.name} ==> ${transaction.target.name} : ${transaction.transactionMessage}\n`
        })
        return text;
    }

    render() {
        const { text } = this.state;

        return (
            <Panel>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <Grid>
                        <Grid.Row>
                            <textarea
                                rows={4}
                                onChange={(e) => { }}
                                style={{ width: '100%', height: "400px", backgroundColor: '#1f2020', color: 'white' }}
                                value={this.getText()}
                            ></textarea>

                        </Grid.Row>
                    </Grid>
                </Panel.Header>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedAction: state.action.selectedAction

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightSideInformation);