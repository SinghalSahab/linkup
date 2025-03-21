"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }
  
  export const updateUser = async ({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params):Promise<void> => {
   await connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
              username: username.toLowerCase(),
              name,
              bio,
              image,
              onboarded: true,
            },
            { upsert: true }
          );
      
          if (path === "/profile/edit") {
            revalidatePath(path);
          }
        } catch (error: any) {
          throw new Error(`Failed to create/update user: ${error.message}`);
        }
      
}

export const fetchUser = async(userId:string) => {
    try {
        await connectToDB();

    return await User.findOne({ id: userId })
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });
    } catch (error:any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        // {
        //   path: "community",
        //   model: Community,
        //   select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        // },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

export async function fetchUsers ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
   try {
    await connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString,"i");

    const query : FilterQuery<typeof User> = {
      id:{$ne:userId}
    }

    if(searchString.trim() !== '')
    {
      query.$or = [
        {username : {$regex : regex}},
        {name : {$regex : regex}}
      ]
    }

    const sortOptions = {createdAt:sortBy};

    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec();

    const isNext = skipAmount + users.length < totalUsersCount;

    return {users,isNext};
   } catch (error : any) {
       throw new Error(`Failed to fetch users: ${error.message}`)
   }
}