import Dashboard from "./(dashboard)/Dashboard";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  console.log(user);
  if (!user) {
    return (
      <div className="w-full text-center mt-10">
        Please log in to view your trends.
      </div>
    );
  }
  return <Dashboard />;
}
