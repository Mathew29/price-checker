import Header from "~/components/Header";
import PriceTrackingPage from "../components/PriceTrackingPage";

export default function priceTrackingPage() {
    return(
        <>
            <Header/>

            <div className="flex h-screen items-center justify-center">
                <PriceTrackingPage />
            </div>
        </>
    )
}