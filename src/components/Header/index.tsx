import _ from "lodash";
import React from "react";
import { NavLink } from "react-router-dom";
import {
    Collapse,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
} from "reactstrap";

interface IState {
    isOpen: boolean;
}

class Header extends React.Component {
    public state: IState = { isOpen: false };

    public render() {
        const links: Record<string, string> = {
            "/mifare/editor": "Mifare Editor",
            "/mifare/access-bits": "Access Bits",
            "/mifare/help": "Help",
        };
        return (
            <Navbar color="dark" dark expand="md" className="fixed-top">
                <NavbarBrand href="#">Mifare Online</NavbarBrand>
                <NavbarToggler onClick={this.handleToggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav navbar>
                        {_.map(links, (name, link) => (
                            <NavItem key={name}>
                                <NavLink
                                    className="nav-link"
                                    to={link}
                                >
                                    {name}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }

    private handleToggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
}

export default Header;
