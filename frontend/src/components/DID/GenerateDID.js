// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import DidTypeListButtons from "./DidTypeListButtons";
import GenerateDidEbsi from "./GenerateDidEbsi";

class GenerateDID extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDidType: "did:ebsi",
        }
    }

    render() {
        const { selectedDidType } = this.state;

        return (
            <>
                <DidTypeListButtons
                    selectedDidType={selectedDidType}
                    handleChooseDidType={(didType) => { this.setState({ selectedDidType: didType }) }}
                />

                {selectedDidType === "did:ebsi" && <GenerateDidEbsi />}
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateDID);