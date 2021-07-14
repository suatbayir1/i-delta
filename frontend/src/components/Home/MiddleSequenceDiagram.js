// Libraries
import React, { Component } from 'react'
import * as d3 from "d3";


// Components
import {
    Panel, Form, ComponentSize, Grid, Columns,
    ComponentColor, IconFont, Button, ButtonType, FlexBox,
} from '@influxdata/clockface'

class MiddleSequenceDiagram extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: ["Class A", "Class B", "Class C", "Class D", "Class E", "Class F", "Class G"],
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

    componentDidMount() {
        const { classes, messages } = this.state;

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

        // Create an svg canvas
        var svg = d3.select("#drawArea")
            .append("svg")
            .attr("width", CANVAS_WIDTH)
            .attr("height", CANVAS_HEIGHT)

        // Draw vertical lines
        classes.forEach(function (c, i) {
            var line = svg.append("line")
                .style("stroke", "#888")
                .attr("x1", XPAD + i * VERT_SPACE)
                .attr("y1", YPAD)
                .attr("x2", XPAD + i * VERT_SPACE)
                .attr("y2", YPAD + VERT_PAD + messages.length * MESSAGE_SPACE);
        });

        // Draw classes
        classes.forEach(function (c, i) {
            var x = XPAD + i * VERT_SPACE;
            var g1 = svg.append("g")
                .attr("transform", "translate(" + x + "," + YPAD + ")")
                .attr("class", "first")

            g1.append("rect")
                .attr("width", CLASS_WIDTH)
                .attr("height", CLASS_HEIGHT)
                .attr("x", -CLASS_WIDTH / 2)
                .attr("y", 0)
                .attr("fill", "#CCC")
        });

        // Draw class labels
        classes.forEach(function (c, i) {
            var x = XPAD + i * VERT_SPACE;
            var g1 = svg.append("g")
                .attr("transform", "translate(" + x + "," + YPAD + ")")
                .attr("class", "first")
                .append("text")
                .text(function (d) { return c; })
                .attr("dx", CLASS_LABEL_X_OFFSET)
                .attr("dy", CLASS_LABEL_Y_OFFSET)
        });

        // Draw message arrows
        messages.forEach(function (m, i) {
            var y = YPAD + MESSAGE_ARROW_Y_OFFSET + i * MESSAGE_SPACE;
            var line = svg.append("line")
                .style("stroke", "#CCC")
                .attr("x1", XPAD + m.start * VERT_SPACE)
                .attr("y1", y)
                .attr("x2", XPAD + m.end * VERT_SPACE)
                .attr("y2", y)
                .attr("marker-end", "url(#end)")
                .append("text")
                .style("fill", "#CCC")
                .text(function (d) { return m.message; });
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
                .text(function (d) { return m.message; });
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

    render() {
        return (
            <Panel>
                <Panel.Header size={ComponentSize.ExtraSmall}>
                    <Form>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column widthXS={Columns.Twelve}>
                                    <div style={{ float: 'right' }}>
                                        <Button
                                            text="Action"
                                            icon={IconFont.Shuffle}
                                            type={ButtonType.Button}
                                            color={ComponentColor.Primary}
                                        />
                                    </div>
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
                                        text="Close"
                                        icon={IconFont.Remove}
                                        type={ButtonType.Button}
                                        color={ComponentColor.Danger}
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

export default MiddleSequenceDiagram;