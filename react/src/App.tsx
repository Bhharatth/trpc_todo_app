import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import  { useState } from "react";
import { trpc } from "./utils/trpc";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",

          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: "Bearer " + localStorage.getItem("token") || "",
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <IndexPage />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export function IndexPage() {
  const userQuery = trpc.user.me.useQuery();
  const todoMutate = trpc.todo.todoCreate.useMutation();
  const todoQuery = trpc.todo.todoGet.useQuery();

  if (userQuery.isLoading) {
    return <div>Loding...</div>;
  }

  if (userQuery.isError) {
    return <Signup />;
  }

  return (
    <div>
      <p>{userQuery.data?.email}</p>
      {todoQuery.data?.map((x) => (
        <div>
          {x.title} - {x.description}
        </div>
      ))}

      <button
        disabled={todoMutate.isLoading}
        onClick={() =>
          todoMutate.mutate({ title: "go to gym", description: "hit the gym" })
        }
      >
        Create Frodo
      </button>
    </div>
  );
}

function Signup() {
  const userSignupMutate = trpc.user.signup.useMutation({
    onSuccess: (data) => {
      let token = data.token;
      localStorage.setItem("token", token);

      window.location = "/";
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      Signup Page username
      <input type="text" onChange={(e) => setUsername(e.target.value)}></input>
      Password
      <input type="text" onChange={(e) => setPassword(e.target.value)}></input>
      <button
        onClick={async () => {
          userSignupMutate.mutate({
            username,
            password,
          });
        }}
      >
        Signup
      </button>
    </div>
  );
}
