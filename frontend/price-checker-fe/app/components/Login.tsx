import { Form, Link, useActionData } from "@remix-run/react";
import { useEffect } from "react";


const Login = () => {
  const actionData = useActionData();

  useEffect(() => {
    if (actionData && actionData.userId && actionData.token) {
      localStorage.setItem('userId', actionData.userId);
      localStorage.setItem('token', actionData.token);
      window.location.href = '/addItem';
    }
  }, [actionData]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-6xl font-bold decoration-accent-1">
            My Price Tracking App
          </h1>
        </header>
        <nav>
          <div className="bg-bkg flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-accent-2">
                  Sign in to your account
                </h2>
              </div>
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Form method="post" className="space-y-6">
                  {actionData?.error && (
                    <div className="text-red-500 text-sm mb-4">{actionData.error}</div>
                  )}
                  <label htmlFor="email" className="block text-sm/6 font-medium text-accent-2">
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-accent-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-1 sm:text-sm/6"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm/6 font-medium text-accent-2">
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md border-0 py-1.5 text-accent-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent-1 sm:text-sm/6"
                      />
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
                  <Link to="/SignUp" className="font-semibold text-accent-2 hover:text-accent-2">
                    Create an Account
                  </Link>
                </p>
                <p className="mt-5 text-center text-sm/6 text-gray-500">
                  Monitor the price of products you want to buy!
                </p>
                <p className="mt-2 text-center text-sm/6 text-gray-500">
                  Create a list and get tracking!
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Login;
