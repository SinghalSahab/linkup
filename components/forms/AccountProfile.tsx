"use client"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input"
  import { useForm } from "react-hook-form";
  import * as z from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { Button } from "../ui/button";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent } from "react";

interface Props {
    user:{
        id:string,
        objectId:string,
        username:string,
        name:string,
        bio:string,
        image:string
    },
    btnTitle:string
}
const AccountProfile = ({user , btnTitle}:Props) => {
    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues:{
            profile_photo: user?.image ? user.image : "",
            name: user?.name ? user.name : "",
            username: user?.username ? user.username : "",
            bio: user?.bio ? user.bio : "",
        }
        
    })

    const handleImage = (e: ChangeEvent,fieldChange: (value:string) => void) => {
        e.preventDefault();
    }

    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
        // const blob = values.profile_photo;
    
        // const hasImageChanged = isBase64Image(blob);
        // if (hasImageChanged) {
        //   const imgRes = await startUpload(files);
    
        //   if (imgRes && imgRes[0].fileUrl) {
        //     values.profile_photo = imgRes[0].fileUrl;
        //   }
        }
  return (
    <Form {...form}>
    <form
     onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col justify-start gap-10">
      <FormField
        control={form.control}
        name="profile_photo"
        render={({ field }) => (
          <FormItem  className="flex items-center gap-4">
            <FormLabel className="account-form_image-label">
                {field.value ? (
                    <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full object-contain'
                  />
                ) : (
                    <Image
                      src='/assets/profile.svg'
                      alt='profile_icon'
                      width={24}
                      height={24}
                      className='object-contain'
                    />
                  )}
            </FormLabel>
            <FormControl className="flex-1 text-base-semibold text-gray-200">
              <Input
               type='file'
               accept='image/*'
               placeholder='Add profile photo'
               className='account-form_image-input'
               onChange={(e) => handleImage(e, field.onChange)}
             />
            </FormControl>
           
          </FormItem>
        )}
      />

<FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem  className="flex w-full flex-col gap-3">
            <FormLabel className="text-base-semibold text-light-2 gap-3 w-full">
                Name
            </FormLabel>
            <FormControl >
             { <Input
               type='text'
               className="account-form_input no-focus"
               {...field}
             />}
            </FormControl>
           
          </FormItem>
        )}
      />

<FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem  className="flex w-full flex-col gap-3">
            <FormLabel className="text-base-semibold text-light-2 gap-3 w-full">
                Username
            </FormLabel>
            <FormControl >
             { <Input
               type='text'
               className="account-form_input no-focus"
               {...field}
             />}
            </FormControl>
           
          </FormItem>
        )}
      />

<FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem  className="flex w-full flex-col gap-3">
            <FormLabel className="text-base-semibold text-light-2 gap-3 w-full">
                Bio
            </FormLabel>
            <FormControl >
             { <Textarea
               rows={10}
               className="account-form_input no-focus"
               {...field}
             />}
            </FormControl>
           
          </FormItem>
        )}
      />
      
      <Button type="submit" className="bg-primary-500">Submit</Button>
    </form>
  </Form>
  )
}

export default AccountProfile