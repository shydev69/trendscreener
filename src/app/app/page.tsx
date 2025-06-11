import { SignedIn, SignedOut } from "@clerk/nextjs";
import Dashboard from "./(dashboard)/Dashboard";
import Landing from "../page";
// import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  // const user = await currentUser();
  // console.log(user);
  // if (!user) {
  //   return (
  //     <div className="w-full text-center mt-10 h-screen flex items-center justify-center">
  //       Please log in to view your trends.
  //     </div>
  //   );
  // }
  return (
    <>
      <Dashboard />
    </>
  );
}
