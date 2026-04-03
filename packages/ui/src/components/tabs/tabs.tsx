"use client";

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { toClassName } from "../../helpers/format";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={toClassName(
      // "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      // Custom styles
      // "flex h-10 items-center !justify-start rounded-none border-b border-gray-200 dark:border-gray-800 bg-transparent p-0 w-full",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={toClassName(
      // "px-4 font-medium inline-flex items-center justify-center whitespace-nowrap mr-3 py-1.5 transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:font-medium",
      // Custom styles
      // "relative h-10 rounded-none bg-transparent pb-3 pt-2 text-gray-300 duration-300 shadow-none transition-none data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white !font-bold",
      // "hover:text-black dark:hover:text-white",
      // " focus-visible:text-black focus-visible:outline-none",
      // "!text-sm",

      "text-white data-[state=active]:underline",

      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={toClassName(
      "mt-2 ring-offset-background focus-visible:outline-none",
      "mt-4",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
