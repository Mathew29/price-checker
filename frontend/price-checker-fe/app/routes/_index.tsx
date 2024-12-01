import { MetaFunction, ActionFunctionArgs, json} from "@remix-run/node";
import axios from "axios";
import Login from "~/components/Login";

export const meta: MetaFunction = () => {
  return [
    { title: "Price Tracking App" },
    { name: "description", content: "Welcome to Price Tracking!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await axios.post('http://localhost:5001/api/users/login', {
      email,
      password,
    });
    const { userId, token } = response.data;
    return console.error({ userId, token });
  } catch (error) {
    if (error.response) {
      return console.error({ error: error.response.data.error }, { status: error.response.status });
    }
    return console.error({ error: 'Server error' }, { status: 500 });
  }
}

export default function Index() {

  return (
    <div>
      <Login />
    </div>
  );
}




