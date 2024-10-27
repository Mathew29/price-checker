import { Form, Link } from "@remix-run/react";
import Header from "~/components/Header";

export default function HomePage() {
    return(
        <>
            <Header/>
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-16">
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Lets Get Started!
                    </h1>
                </header>
                <p className="leading-6 text-gray-700 dark:text-gray-200">
                    Start by entering an Amazon product URL you would like to track.
                </p>
                <p className="leading-6 text-gray-700 dark:text-gray-200">
                    Press Track to start tracking!
                </p>
                <input name="product" type="text" />
                <button><Link to="/priceTrackingPage">Track</Link></button>
                </div>

            </div>
        </>
    )
}