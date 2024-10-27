import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Price Tracking App" },
    { name: "description", content: "Welcome to Price Tracking!" },
  ];
};

export async function action({ request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username")
  const password = formData.get("password")
  console.log({ username, password })
  return redirect(`/homePage`)
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-6xl font-bold decoration-accent-1">
            My Price Tracking App
          </h1>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 decoration-accent-1">
            Sign In
          </p>
          <Form method="post">
              <input name="username" type="text" />
              <input name="password" type="password" />
              <button type="submit">Submit</button>
          </Form>

        </nav>
      </div>
    </div>
  );
}

