import { NavLink } from "@remix-run/react"
import LogoutButton from "./LogOutButton"

const Nav = () => {
    return(
        <>
            <NavLink to="/homePage">Home</NavLink>
            <NavLink to="/priceTrackingPage">Tracking</NavLink>
            <LogoutButton />
        </>
    )
}

export default Nav