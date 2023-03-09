import LoginButton from "@/src/components/loginButton";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (session?.user) router.push("/");
  }, [session, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white">
      <LoginButton />
    </div>
  );
};
export default LoginPage;
