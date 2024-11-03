import { Form,redirect, useActionData } from "@remix-run/react"
import { ActionFunctionArgs, json } from "@remix-run/node";
import axios from "axios";

export async function action({ request }: ActionFunctionArgs) {

    const formData = await request.formData();
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    if (!email || !email.includes('@')){
        return json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    if (confirmPassword != password){
        return json({error: "Passwords do not match"}, { status: 400})
    }


    try {
        const response = await axios.post('http://localhost:5001/api/users/register', {
            password,
            email
        })
        return redirect(`/`)
    } catch(error){
        if(error.response){
            return json({error: error.response.data.error}, {status: error.response.status})
        }
        return json({error: 'Server error fe'}, {status: 500})
    }


  }

export default function SignUpPage() {
    const actionData = useActionData()
    return(
        <div className="bg-bkg flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-accent-2">
                    Create Your Account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Form action="#" method="POST" className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-accent-2">
                        Email address
                        </label>
                        <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="block w-full rounded-md border-0 py-1.5 text-accent-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-1 sm:text-sm/6"
                        />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-accent-2">
                            Password
                        </label>
                        </div>
                        <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md border-0 py-1.5 text-accent-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-1 sm:text-sm/6"
                        />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-accent-2">
                            Confirm Password
                        </label>
                        </div>
                        <div className="mt-2">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md border-0 py-1.5 text-accent-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-1 sm:text-sm/6"
                        />
                        </div>
                    </div>
                    {actionData?.error && <p className="text-red-600">{actionData.error}</p>}

                    <div>
                        <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-accent-1 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1"
                        >
                        Create Account
                        </button>
                    </div>
                    </Form>

                </div>
            </div>
        </div>
    )
}


