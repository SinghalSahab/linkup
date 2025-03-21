import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export const page = async () => {
    const user = await currentUser();

    if(!user) return null;
    const userInfo = await fetchUser(user.id)
    console.log(userInfo._id)
    if(!userInfo?.onboarded) redirect('/onboarding')
        const userId = userInfo._id?.toString();
    return (
   <>
   <h1 className="head-text">Create Thread</h1>

   <PostThread userId = {userId} />
   </>
  )
}

