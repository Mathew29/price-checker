import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect } from "@remix-run/react";
import SignInPage from "./SignInPage";

export const meta: MetaFunction = () => {
  return [
    { title: "Price Tracking App" },
    { name: "description", content: "Welcome to Price Tracking!" },
  ];
};


export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-6xl font-bold decoration-accent-1">
            My Price Tracking App
          </h1>
        </header>
        <nav>
          <SignInPage />
          {/* <Form method="post">
              <input className="text-sky-700 decoration-accent-1" name="username" type="text" />
              <input className="text-sky-700" name="password" type="password" />
              <button type="submit">Submit</button>
          </Form> */}

        </nav>
      </div>
    </div>
  );
}




