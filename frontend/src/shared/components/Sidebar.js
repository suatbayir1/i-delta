// Libraries
import React, { Component } from 'react';
import {
    Link,
} from 'react-router-dom'

// Components
import { Icon, TreeNav, IconFont, ComponentColor, } from '@influxdata/clockface';

// Assets
import logo from '../../assets/images/logo.png'

// Constants
import { hierarchy } from "../constants/navigation";


class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
        }
    }

    getNavItemActivation = (keywords, location) => {
        const ignoreOrgAndOrgID = 1
        const parentPath = location.split('/').slice(ignoreOrgAndOrgID)

        if (!parentPath.length) {
            parentPath.push("me")
        }

        return keywords.some(path => parentPath.includes(path))
    }

    render() {
        const { isExpanded } = this.state;

        return (
            <TreeNav
                expanded={isExpanded}
                headerElement={<>
                    <TreeNav.Header
                        id="getting-started"
                        icon={<Icon glyph={IconFont.CuboNav} />}
                        label={<img src={logo} />}
                        color={ComponentColor.Secondary}
                        linkElement={className => <Link className={className} to={"/"} />}
                    />
                </>}
                userElement={<>
                    <TreeNav.User username={"Username"} team={"Role"}>
                        <TreeNav.UserItem
                            id="users"
                            label="Sample Operation"
                            testID="user-nav-item-users"
                            linkElement={className => (
                                <Link className={className} to={""} />
                            )}
                        />
                        <TreeNav.UserItem
                            id="logout"
                            label="Logout"
                            testID="user-nav-item-logout"
                            linkElement={className => <Link className={className} to="/logout" />}
                        />
                    </TreeNav.User>
                </>}
                bannerElement={<></>}
                onToggleClick={() => { this.setState({ isExpanded: !this.state.isExpanded }) }}
            >


                {hierarchy.map(item => {
                    const linkElement = (className) => {
                        if (item.link.type === 'href') {
                            return <a href={item.link.location} className={className} />
                        }

                        return <Link to={item.link.location} className={className} />
                    }

                    let navItemElement = (
                        <TreeNav.Item
                            key={item.id}
                            id={item.id}
                            testID={item.testID}
                            icon={<Icon glyph={item.icon} />}
                            label={item.label}
                            shortLabel={item.shortLabel}
                            active={this.getNavItemActivation(
                                item.activeKeywords,
                                window.location.pathname
                            )}
                            linkElement={linkElement}
                        >
                            {Boolean(item.menu) && (
                                <TreeNav.SubMenu>
                                    {item.menu.map(menuItem => {
                                        const linkElement = (className) => {
                                            if (menuItem.link.type === 'href') {
                                                return (
                                                    <a
                                                        href={menuItem.link.location}
                                                        className={className}
                                                    />
                                                )
                                            }

                                            return (
                                                <Link
                                                    to={menuItem.link.location}
                                                    className={className}
                                                />
                                            )
                                        }

                                        let navSubItemElement = (
                                            <TreeNav.SubItem
                                                key={menuItem.id}
                                                id={menuItem.id}
                                                testID={menuItem.testID}
                                                active={this.getNavItemActivation(
                                                    [menuItem.id],
                                                    window.location.pathname
                                                )}
                                                label={menuItem.label}
                                                linkElement={linkElement}
                                            />
                                        )
                                        return navSubItemElement
                                    })}
                                </TreeNav.SubMenu>
                            )}
                        </TreeNav.Item>
                    )
                    return navItemElement
                })}


            </TreeNav>
        )
    }
}

export default Sidebar;