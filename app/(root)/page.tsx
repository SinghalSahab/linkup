
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";


async function Home() {
    
    const user = await currentUser();
    if(!user) return null

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const result = await fetchPosts(1,20);
  return (
    <>
      <h1 className="head-text text-left ">Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
      {result.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
          {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
         </section>
    </>
  );
}

export default Home;
