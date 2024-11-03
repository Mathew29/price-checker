import { NavLink } from "@remix-run/react"
import LogoutButton from "./LogOutButton"

const Nav = () => {
    return(
        <>
            <div className="flex items-center space-x-4">
                <NavLink to="/priceTracking">Tracking</NavLink>
                <LogoutButton />
            </div>
        </>
    )
}

export default Nav