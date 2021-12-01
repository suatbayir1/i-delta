// Libraries
import React, { Component } from 'react'

// Components
import DownloadKeyPair from "../overlays/DownloadKeyPair";
import ResolvedDid from "../overlays/ResolvedDid";

class OverlayContainer extends Component {
    render() {
        return (
            <>
                <DownloadKeyPair />
                <ResolvedDid />
            </>
        )
    }
}

export default OverlayContainer;