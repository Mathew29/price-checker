import Header from "~/components/Header";
import PriceTracking from "~/components/PriceTracking";

export default function dashBoard() {
    return(
        <>
            <Header/>

            <div className="flex h-screen items-center justify-center">
                <PriceTracking />
            </div>
        </>
    )
}