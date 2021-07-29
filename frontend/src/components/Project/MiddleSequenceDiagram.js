// Libraries
import React, { Component } from 'react'
// import * as d3 from "d3";
import { connect } from "react-redux";

// Components
import {
    Panel, Form, ComponentSize, Grid, Columns, ConfirmationButton,
    ComponentColor, IconFont, Button, ButtonType, FlexBox, Appearance,
} from '@influxdata/clockface'
import ActionTabs from "./ActionTabs";

// Actions
import { fetchDeleteAction } from "../../store/";

// Assets
import "../../assets/css/sequenceDiagram.css";

class MiddleSequenceDiagram extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // classes: ["Class A", "Class B", "Class C", "Class D", "Class E", "Class F", "Class G"],
            classes: [
                { id: "classA", name: "Class A", prop1: 'prop1', prop2: 'prop2' },
                { id: "classB", name: "Class B", prop1: 'prop1', prop2: 'prop2' },
                { id: "classC", name: "Class C", prop1: 'prop1', prop2: 'prop2' },
                { id: "classD", name: "Class D", prop1: 'prop1', prop2: 'prop2' },
                { id: "classE", name: "Class E", prop1: 'prop1', prop2: 'prop2' },
                { id: "classF", name: "Class F", prop1: 'prop1', prop2: 'prop2' },
                { id: "classG", name: "Class G", prop1: 'prop1', prop2: 'prop2' },
            ],
            messages: [
                { start: 0, end: 2, message: "From A to C" },
                { start: 2, end: 3, message: "From C to D" },
                { start: 3, end: 4, message: "From D to E" },
                { start: 4, end: 3, message: "From E to D" },
                { start: 3, end: 6, message: "From D to G" },
                { start: 6, end: 3, message: "From G to D" },
                { start: 3, end: 2, message: "From D to C" },
                { start: 2, end: 0, message: "From C to A" }
            ],
        }
    }

    handleDeleteAction = async () => {
        const { selectedAction, fetchDeleteAction } = this.props;
        await fetchDeleteAction(selectedAction);
    }

    componentDidUpdate = async (prevProps) => {
        const { selectedAction } = this.props;
        if (prevProps.selectedAction !== selectedAction) {
            this.setDiagramData();
        }
    }

    setDiagramData = () => {
        const { selectedAction } = this.props;
        const { classes } = this.state;

        const messages = selectedAction !== undefined && selectedAction.transactions !== undefined
            ? selectedAction?.transactions.map(transaction => {
                let message = {};

                classes.map((cl, idx) => {
                    if (cl.id === transaction.source.id) {
                        message["start"] = idx;
                    }

                    if (cl.id === transaction.target.id) {
                        message["end"] = idx;
                    }

                    message["message"] = transaction.transactionMessage;
                })

                return message;
            })
            : [];


        this.createSequenceDiagram(classes, messages);
    }

    createSequenceDiagram = (classes, messages) => {
        var d3 = window.d3;
        d3.selectAll("svg").remove();

        console.log("d3", d3);

        var XPAD = 50;
        var YPAD = 20;
        var VERT_SPACE = 100;
        var VERT_PAD = 60;

        var CLASS_WIDTH = 80;
        var CLASS_HEIGHT = 40;
        var CLASS_LABEL_X_OFFSET = -25;
        var CLASS_LABEL_Y_OFFSET = 25;

        var MESSAGE_SPACE = 50;
        var MESSAGE_LABEL_X_OFFSET = -40;
        var MESSAGE_LABEL_Y_OFFSET = 70;
        var MESSAGE_ARROW_Y_OFFSET = 80;

        var CANVAS_WIDTH = 800;
        var CANVAS_HEIGHT = 600;

        var selected_link;

        // Create an svg canvas
        var svg = d3.select("#drawArea")
            .append("svg")
            .attr("width", CANVAS_WIDTH)
            .attr("height", CANVAS_HEIGHT)

        update();

        function update() {


            // Draw vertical lines
            var line = svg.selectAll("line")
                .data(classes)
                .enter()
                .append("line")
                .style("stroke", "#888")
                .attr("x1", function (d, i) { return XPAD + i * VERT_SPACE; })
                .attr("y1", YPAD)
                .attr("x2", function (d, i) { return XPAD + i * VERT_SPACE; })
                .attr("y2", YPAD + VERT_PAD + messages.length * MESSAGE_SPACE)

            // Draw rectangles
            var g1 = svg.selectAll("rect")
                .data(classes)
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (XPAD + i * VERT_SPACE) + "," + YPAD + ")";
                })
                .attr("class", "first")

            g1.append("rect")
                .attr("width", CLASS_WIDTH)
                .attr("height", CLASS_HEIGHT)
                .attr("x", -CLASS_WIDTH / 2)
                .attr("y", 0)
                .attr("fill", "#CCC")
                .on("mousedown", handleRectangleClick)
                .on("mouseover", changeCursorToPointer)

            // Draw class labels
            var g1 = svg.selectAll("text")
                .data(classes)
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (XPAD + i * VERT_SPACE) + "," + YPAD + ")";
                })
                .attr("class", "first")
                .append("text")
                .text(function (d) { return d.name; })
                .attr("dx", CLASS_LABEL_X_OFFSET)
                .attr("dy", CLASS_LABEL_Y_OFFSET)
                .on("mousedown", handleRectangleClick)
                .on("mouseover", changeCursorToPointer)

            // Draw message arrows
            messages.forEach(function (m, i) {
                var y = YPAD + MESSAGE_ARROW_Y_OFFSET + i * MESSAGE_SPACE;
                var line = svg.append("line")
                    .style("stroke", function () {
                        return m === selected_link ? "#FF0000" : "#CCC"
                    })
                    .attr("stroke-width", 2)
                    .on("mousedown", () => { handleLineClick(m) })
                    .on("mouseover", changeCursorToPointer)
                    .attr("x1", XPAD + m.start * VERT_SPACE)
                    .attr("y1", y)
                    .attr("x2", XPAD + m.end * VERT_SPACE)
                    .attr("y2", y)
                    .attr("marker-end", "url(#end)")
                    .append("text")
                    .style("fill", "#CCC")
                    .text(function (d) { return m.message; })
            });


            // Draw message labels
            messages.forEach(function (m, i) {
                var xPos = XPAD + MESSAGE_LABEL_X_OFFSET + (((m.end - m.start) * VERT_SPACE) / 2) + (m.start * VERT_SPACE);
                var yPos = YPAD + MESSAGE_LABEL_Y_OFFSET + i * MESSAGE_SPACE;

                var g1 = svg.append("g")
                    .attr("transform", "translate(" + xPos + "," + yPos + ")")
                    .attr("class", "first")
                    .append("text")
                    .style('fill', '#CCC')
                    .text(function (d) { return m.message; })
                    .on("mousedown", () => { handleLineClick(m) })
                    .on("mouseover", changeCursorToPointer)

            });

            // Arrow style
            svg.append("svg:defs").selectAll("marker")
                .data(["end"])
                .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 10)
                .attr("refY", 0)
                .attr("markerWidth", 10)
                .attr("markerHeight", 10)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", '#CCC');
        }

        function handleRectangleClick(d) {
            console.log("clicked", d);
        }

        function changeCursorToPointer(d) {
            d3.select(this).style("cursor", "pointer");
        }

        function handleLineClick(m) {
            console.log(m);
            selected_link = m;
            update();
        }
    }


    // createSequenceDiagram = (classes, messages) => {
    //     var d3 = window.d3;
    //     d3.selectAll("svg").remove();

    //     console.log("d3", d3);

    //     var XPAD = 50;
    //     var YPAD = 20;
    //     var VERT_SPACE = 100;
    //     var VERT_PAD = 60;

    //     var CLASS_WIDTH = 80;
    //     var CLASS_HEIGHT = 40;
    //     var CLASS_LABEL_X_OFFSET = -25;
    //     var CLASS_LABEL_Y_OFFSET = 25;

    //     var MESSAGE_SPACE = 50;
    //     var MESSAGE_LABEL_X_OFFSET = -40;
    //     var MESSAGE_LABEL_Y_OFFSET = 70;
    //     var MESSAGE_ARROW_Y_OFFSET = 80;

    //     var CANVAS_WIDTH = 800;
    //     var CANVAS_HEIGHT = 600;

    //     // Create an svg canvas
    //     var svg = d3.select("#drawArea")
    //         .append("svg")
    //         .attr("width", CANVAS_WIDTH)
    //         .attr("height", CANVAS_HEIGHT)

    //     // Draw vertical lines
    //     classes.forEach(function (c, i) {
    //         var line = svg.append("line")
    //             .style("stroke", "#888")
    //             .attr("x1", XPAD + i * VERT_SPACE)
    //             .attr("y1", YPAD)
    //             .attr("x2", XPAD + i * VERT_SPACE)
    //             .attr("y2", YPAD + VERT_PAD + messages.length * MESSAGE_SPACE);
    //     });

    //     // Draw classes
    //     classes.forEach(function (c, i) {
    //         var x = XPAD + i * VERT_SPACE;
    //         var g1 = svg.append("g")
    //             .attr("transform", "translate(" + x + "," + YPAD + ")")
    //             .attr("class", "first")

    //         g1.append("rect")
    //             .attr("width", CLASS_WIDTH)
    //             .attr("height", CLASS_HEIGHT)
    //             .attr("x", -CLASS_WIDTH / 2)
    //             .attr("y", 0)
    //             .attr("fill", "#CCC")
    //             .on("mousedown", function (d) {
    //                 console.log(d);
    //             })
    //     });

    //     // Draw class labels
    //     classes.forEach(function (c, i) {
    //         var x = XPAD + i * VERT_SPACE;
    //         var g1 = svg.append("g")
    //             .attr("transform", "translate(" + x + "," + YPAD + ")")
    //             .attr("class", "first")
    //             .append("text")
    //             .text(function (d) { return c.name; })
    //             .attr("dx", CLASS_LABEL_X_OFFSET)
    //             .attr("dy", CLASS_LABEL_Y_OFFSET)
    //     });

    //     // Draw message arrows
    //     messages.forEach(function (m, i) {
    //         var y = YPAD + MESSAGE_ARROW_Y_OFFSET + i * MESSAGE_SPACE;
    //         var line = svg.append("line")
    //             .style("stroke", "#CCC")
    //             .attr("stroke-width", 2)
    //             .attr("x1", XPAD + m.start * VERT_SPACE)
    //             .attr("y1", y)
    //             .attr("x2", XPAD + m.end * VERT_SPACE)
    //             .attr("y2", y)
    //             .attr("marker-end", "url(#end)")
    //             .append("text")
    //             .style("fill", "#CCC")
    //             .text(function (d) { return m.message; });
    //     });

    //     // Draw message labels
    //     messages.forEach(function (m, i) {
    //         var xPos = XPAD + MESSAGE_LABEL_X_OFFSET + (((m.end - m.start) * VERT_SPACE) / 2) + (m.start * VERT_SPACE);
    //         var yPos = YPAD + MESSAGE_LABEL_Y_OFFSET + i * MESSAGE_SPACE;

    //         var g1 = svg.append("g")
    //             .attr("transform", "translate(" + xPos + "," + yPos + ")")
    //             .attr("class", "first")
    //             .append("text")
    //             .style('fill', '#CCC')
    //             .text(function (d) { return m.message; });
    //     });

    //     // Arrow style
    //     svg.append("svg:defs").selectAll("marker")
    //         .data(["end"])
    //         .enter().append("svg:marker")
    //         .attr("id", String)
    //         .attr("viewBox", "0 -5 10 10")
    //         .attr("refX", 10)
    //         .attr("refY", 0)
    //         .attr("markerWidth", 10)
    //         .attr("markerHeight", 10)
    //         .attr("orient", "auto")
    //         .append("svg:path")
    //         .attr("d", "M0,-5L10,0L0,5")
    //         .style("fill", '#CCC');
    // }

    render() {
        return (
            <Panel>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <Form>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <ActionTabs />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Panel.Header>
                <Panel.Body size={ComponentSize.ExtraSmall}>
                    <Grid.Row>
                        <div
                            id="drawArea"
                            style={{ textAlign: 'center' }}
                        ></div>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column widthXS={Columns.Twelve}>
                            <div style={{ float: 'right', marginTop: '20px' }}>
                                <FlexBox margin={ComponentSize.Medium}>
                                    <Button
                                        text="Zoom Out"
                                        icon={IconFont.Search}
                                        type={ButtonType.Button}
                                        color={ComponentColor.Primary}
                                    />
                                    <Button
                                        text="Zoom In"
                                        icon={IconFont.Search}
                                        type={ButtonType.Button}
                                        color={ComponentColor.Primary}
                                    />
                                    <Button
                                        text="Save Action"
                                        icon={IconFont.Checkmark}
                                        type={ButtonType.Button}
                                        color={ComponentColor.Success}
                                    />

                                    <ConfirmationButton
                                        icon={IconFont.Remove}
                                        size={ComponentSize.Small}
                                        onConfirm={this.handleDeleteAction}
                                        text="Delete Action"
                                        popoverColor={ComponentColor.Danger}
                                        popoverAppearance={Appearance.Outline}
                                        color={ComponentColor.Danger}
                                        confirmationLabel="Do you want to delete ?"
                                        confirmationButtonColor={ComponentColor.Danger}
                                        confirmationButtonText="Yes"
                                    />
                                </FlexBox>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Panel.Body>
            </Panel>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        selectedAction: state.action.selectedAction
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchDeleteAction: (payload) => dispatch(fetchDeleteAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MiddleSequenceDiagram);