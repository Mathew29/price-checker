import { NavLink } from "@remix-run/react"

const Nav = () => {
    return(
        <>
            <NavLink to="/homePage">Home</NavLink>
            <NavLink to="/priceTrackingPage">Tracking</NavLink>
        </>
    )
}

export default Nav