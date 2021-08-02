// Libraries
import React, { Component } from 'react'
import { connect } from "react-redux";

// Components
import {
    Panel, Form, ComponentSize, Grid, Columns, ConfirmationButton,
    ComponentColor, IconFont, Button, ButtonType, FlexBox, Appearance,
} from '@influxdata/clockface'
import ActionTabs from "./ActionTabs";

// Actions
import { fetchDeleteAction, fetchDeleteTransaction } from "../../store/";

// Assets
import styles from "../../assets/css/sequenceDiagram.module.css";

// Overlays
import ClassDetail from "../../shared/overlays/ClassDetail";

// Graph global variables
var d3 = window.d3;
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
var selected_link, selected_node;

class MiddleSequenceDiagram extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [
                { id: "classA", name: "Class A", prop1: 'prop1', prop2: 'prop2' },
                { id: "classB", name: "Class B", prop1: 'prop1', prop2: 'prop2' },
                { id: "classC", name: "Class C", prop1: 'prop1', prop2: 'prop2' },
                { id: "classD", name: "Class D", prop1: 'prop1', prop2: 'prop2' },
                { id: "classE", name: "Class E", prop1: 'prop1', prop2: 'prop2' },
                { id: "classF", name: "Class F", prop1: 'prop1', prop2: 'prop2' },
                { id: "classG", name: "Class G", prop1: 'prop1', prop2: 'prop2' },
            ],
            selectedClass: {},
            visibleClassDetailOverlay: false,
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
                })

                message["message"] = transaction.transactionMessage;
                message["id"] = transaction.id;
                return message;
            })
            : [];


        this.createSequenceDiagram(classes, messages);
    }

    handleDeleteTransaction = async (transaction) => {
        const { fetchDeleteTransaction, selectedAction } = this.props;

        const payload = {
            "actionID": selectedAction["_id"]["$oid"],
            "transactionID": transaction["id"]["$uuid"]
        }

        await fetchDeleteTransaction(payload);
    }

    dismissOverlay = (state) => {
        this.setState({ [state]: false })
    }

    handleOpenClassDetailOverlay = (selected) => {
        this.setState({
            visibleClassDetailOverlay: true,
            selectedClass: selected
        });
    }

    createSequenceDiagram = (classes, messages) => {
        d3.selectAll("svg").remove();

        var thisCopy = this;

        function contextMenu() {
            var height,
                width,
                margin = 0.1, // fraction of width
                items = [],
                rescale = false,
                style = {
                    'rect': {
                        'mouseout': {
                            'fill': 'rgb(244,244,244)',
                            'stroke': 'white',
                            'stroke-width': '1px'
                        },
                        'mouseover': {
                            'fill': 'rgb(200,200,200)'
                        }
                    },
                    'text': {
                        'fill': 'steelblue',
                        'font-size': '13'
                    }
                };

            function menu(x, y, m) {
                d3.select('.context-menu').remove();
                scaleItems();

                // Draw the menu
                d3.select('svg')
                    .append('g').attr('class', 'context-menu')
                    .selectAll('tmp')
                    .data(items).enter()
                    .append('g').attr('class', 'menu-entry')
                    .style({ 'cursor': 'pointer' })
                    .on('mouseover', function () {
                        d3.select(this).select('rect').style(style.rect.mouseover)
                    })
                    .on('mouseout', function () {
                        d3.select(this).select('rect').style(style.rect.mouseout)
                    });

                d3.selectAll('.menu-entry')
                    .append('rect')
                    .attr('x', x)
                    .attr('y', function (d, i) { return y + (i * height); })
                    .attr('width', width)
                    .attr('height', height)
                    .style(style.rect.mouseout)
                    .on("click", (d, i) => { handleMenuActions(d, m) })

                d3.selectAll('.menu-entry')
                    .append('text')
                    .text(function (d) { return d.text; })
                    .attr('x', x)
                    .attr('y', function (d, i) { return y + (i * height); })
                    .attr('dy', height - margin / 2)
                    .attr('dx', margin)
                    .style(style.text)
                    .on("click", (d, i) => { handleMenuActions(d, m) })

                // Other interactions
                d3.select('body')
                    .on('click', function () {
                        d3.select('.context-menu').remove();
                    });

                function handleMenuActions(d, m) {
                    console.log(d, m);
                    switch (d.id) {
                        case "delete":
                            thisCopy.handleDeleteTransaction(m);
                            break;
                        case "second":
                            alert("A new action to be added")
                            break;
                        case "classDetail":
                            thisCopy.handleOpenClassDetailOverlay(m);
                            break;
                    }
                }

            }

            menu.items = function (e) {
                if (!arguments.length) return items;
                for (let i in arguments) items.push(arguments[i]);
                rescale = true;
                return menu;
            }

            // Automatically set width, height, and margin;
            function scaleItems() {
                if (rescale) {
                    d3.select('svg').selectAll('tmp')
                        .data(items).enter()
                        .append('text')
                        .text(function (d) { return d; })
                        .style(style.text)
                        .attr('x', -1000)
                        .attr('y', -1000)
                        .attr('class', 'tmp');
                    var z = d3.selectAll('.tmp')[0]
                        .map(function (x) { return x.getBBox(); });
                    width = d3.max(z.map(function (x) { return x.width; }));
                    margin = margin * width;
                    width = width + 2 * margin;
                    height = d3.max(z.map(function (x) { return x.height + margin / 2; }));

                    // cleanup
                    d3.selectAll('.tmp').remove();
                    rescale = false;
                }
            }

            return menu;
        }

        var linkMenu = contextMenu().items(
            { id: "delete", text: "Delete Link" },
            { id: "second", text: "Second Action" },
        );

        var classMenu = contextMenu().items(
            { id: 'classDetail', text: 'Class Detail' },
            { id: 'action1', text: 'Action 1' },
            { id: 'action2', text: 'Action 2' },
            { id: 'action3', text: 'Action 3' },
        )

        // Create an svg canvas
        var svg = d3.select("#drawArea")
            .append("svg")
            .attr("width", CANVAS_WIDTH)
            .attr("height", CANVAS_HEIGHT)
            .call(d3.behavior.zoom().on("zoom", function () {
                svg.attr('transform', 'translate(' + (d3.event.translate[0]) +
                    ',' + (d3.event.translate[1]) + ') scale(' + d3.event.scale + ')');
            }))
            .append("g")


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
                    .attr("fill", function (d) {
                        return c === selected_node ? "#FF0000" : "#CCC"
                    })
                    .on("mousedown", () => { handleRectangleClick(c) })
                    .on("mouseover", changeCursorToPointer)
                    .on('contextmenu', function () {
                        d3.event.preventDefault();
                        // classMenu(d3.mouse(this)[0] + x, d3.mouse(this)[1] + YPAD, c);
                        classMenu(d3.mouse(this)[0] + x, d3.mouse(this)[1] + YPAD, c);

                    })
            });

            // Draw class labels
            classes.forEach(function (c, i) {
                var x = XPAD + i * VERT_SPACE;
                var g1 = svg.append("g")
                    .attr("transform", "translate(" + x + "," + YPAD + ")")
                    .attr("class", "first")
                    .append("text")
                    .text(function (d) { return c.name; })
                    .attr("fill", function (d) {
                        return c === selected_node ? "#FFFFFF" : "#000"
                    })
                    .attr("dx", CLASS_LABEL_X_OFFSET)
                    .attr("dy", CLASS_LABEL_Y_OFFSET)
                    .on("mousedown", () => { handleRectangleClick(c) })
                    .on("mouseover", changeCursorToPointer)
                    .on('contextmenu', function () {
                        d3.event.preventDefault();
                        classMenu(d3.mouse(this)[0] + x, d3.mouse(this)[1] + YPAD, c);
                    })
            });

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
                    .on('contextmenu', function () {
                        d3.event.preventDefault();
                        linkMenu(d3.mouse(this)[0], d3.mouse(this)[1], m);
                    })
                    .attr("x1", XPAD + m.start * VERT_SPACE)
                    .attr("y1", y)
                    .attr("x2", XPAD + m.end * VERT_SPACE)
                    .attr("y2", y)
                    .attr("marker-end", "url(#end)")
                    .append("text")
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
                    .style('fill', function () {
                        return "#CCC"
                    })
                    .text(function (d) { return m.message; })
                    .on("mousedown", () => { handleLineClick(m) })
                    .on("mouseover", changeCursorToPointer)
                    .on('contextmenu', function () {
                        d3.event.preventDefault();
                        linkMenu(d3.mouse(this)[0] + xPos, d3.mouse(this)[1] + yPos, m);
                    });
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
                .attr("markerHeight", 5)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .style("fill", function (d) {
                    return '#FF0000'
                });
        }

        function handleRectangleClick(d) {
            selected_node = d;
            selected_link = null;
            update();
        }

        function changeCursorToPointer(d) {
            d3.select(this).style("cursor", "pointer");
        }

        let vm = this;
        function handleLineClick(m) {
            vm.props.handleClickLink(m);
            selected_link = m;
            selected_node = null;
            update();
        }
    }


    // createSequenceDiagram = (classes, messages) => {
    //     var d3 = window.d3;
    //     d3.selectAll("svg").remove();

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
        const { visibleClassDetailOverlay, selectedClass } = this.state;

        return (
            <>
                <ClassDetail
                    visible={visibleClassDetailOverlay}
                    selectedClass={selectedClass}
                    dismissOverlay={this.dismissOverlay}
                />

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

                        {/* <Grid.Row>
                            <Grid.Column widthXS={Columns.Twelve}>
                                <div style={{ float: 'right', marginTop: '20px' }}>
                                    <FlexBox margin={ComponentSize.Medium}>
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
                        </Grid.Row> */}
                    </Panel.Body>
                </Panel>
            </>
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
        fetchDeleteTransaction: (payload) => dispatch(fetchDeleteTransaction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MiddleSequenceDiagram);