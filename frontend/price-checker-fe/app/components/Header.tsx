import Nav from "./Nav";

const Header = () => {
    return(
        <header className="sticky top-0 z-[20] mx-auto flex w-full items-center justify-between">
            <Nav/>
        </header>
    );
};

export default Header;