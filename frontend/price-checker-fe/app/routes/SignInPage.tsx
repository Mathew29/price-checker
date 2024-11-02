import { Form, Link, redirect } from "@remix-run/react"
import type { ActionFunctionArgs } from "@remix-run/node";


export default function SignInPage() {
    return(
        <div className="bg-bkg flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-accent-2">
                    Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Form className="space-y-6">
                        <label htmlFor="email" className="block text-sm/6 font-medium text-accent-2">Email Address</label>
                        <div className="mt-2">
                            <input
                                id="email"
                                required
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-accent-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-1 sm:text-sm/6"/>
                        </div>
                        <div>

                            <label htmlFor="password" className="block text-sm/6 font-medium text-accent-2">Password</label>
                            <div className="mt-2">
                                <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-accent-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-1 sm:text-sm/6"/>
                            </div>
                            <div className="mt-6">
                                <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-accent-1 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-accent-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-1"
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>

                    </Form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        <Link to="/SignUpPage" className="font-semibold text-accent-2 hover:text-accent-2">Create an Account</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}


export async function action({ request }: ActionFunctionArgs) {

    const formData = await request.formData();
    const email = formData.get("email")
    const password = formData.get("password")
    console.log({email, password});

    return redirect(`/homePage`)
  }