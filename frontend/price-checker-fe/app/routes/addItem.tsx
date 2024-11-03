import { Form, redirect, useActionData } from "@remix-run/react"
import { ActionFunctionArgs, json } from "@remix-run/node";
import axios from "axios";
import Header from "~/components/Header";

export async function action({ request }: ActionFunctionArgs) {

    const formData = await request.formData();
    const product = formData.get("product") as string
    const userId = formData.get("userId") as string;


    const urlPattern = new RegExp('^(https?://)?(www\\.)?amazon\\.(com|co.uk|de|fr|es|it|ca|jp)/.+$');

    if (!urlPattern.test(product)) {
        return json({ error: 'Please enter a valid Amazon product URL' }, { status: 400 });
    }

    try {
        const response = await axios.post('http://localhost:3000/api/product/add-product', { product });

        const { productId } = response.data

        await axios.post('http://localhost:5001/api/users/track-user-item', {
            userId,
            productId
        });

        return redirect('/dashBoard');
    } catch (error) {
        return json({ error: 'Failed to track the URL' }, { status: 500 });
    }


  }

export default function AddItemPage() {
    const actionData = useActionData();
    const userId = typeof window !== "undefined" ? localStorage.getItem('userId') : "";
    return(
        <>
            <Header/>
            <div className="bg-bkg flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700 max-w-xl mx-auto w-full sm:px-8">
                <header className="flex flex-col items-center gap-9">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Let's Get Started!
                    </h1>
                </header>
                <div className="flex flex-col items-center gap-4">
                    <p className="leading-6 text-gray-700 dark:text-gray-200">
                    Start by entering an Amazon product URL you would like to track.
                    </p>
                    <p className="leading-6 text-gray-700 dark:text-gray-200">
                    Press Track to start tracking!
                    </p>
                    {actionData?.error && (
                        <p className="text-red-500">{actionData.error}</p>
                    )}
                    <Form method="post" className="space-y-6">
                    <input
                            id="product"
                            name="product"
                            type="url"
                            required
                            className="text-sky-700 w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="hidden"
                            name="userId"
                            value={userId || ''}
                        />
                        <button type="submit" className=" bg-blue-500 text-white rounded w-full px-4 py-2 hover:bg-blue-600 transition duration-200">
                            Track
                        </button>
                    </Form>
                </div>
            </div>
        </>
    )
}