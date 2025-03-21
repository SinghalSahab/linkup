"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"

interface Params{
    text:string,
    author:string,
    communityId:string | null,
    path:string
}

export async function createthread({text,author,communityId,path}:Params){
    connectToDB();


    const createdThread = await Thread.create({
        text,
        author,
        community: null,
      });

      await User.findByIdAndUpdate(author,{
        $push:{threads:createdThread._id}
      })

      revalidatePath(path);
}