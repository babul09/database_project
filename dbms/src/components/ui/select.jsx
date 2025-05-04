import * as React from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const Select = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.select
      whileFocus={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex h-10 w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:bg-card transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Select.displayName = "Select";

const SelectGroup = React.forwardRef(({ className, ...props }, ref) => {
  return <optgroup ref={ref} className={cn("", className)} {...props} />;
});
SelectGroup.displayName = "SelectGroup";

const SelectOption = React.forwardRef(({ className, ...props }, ref) => {
  return <option ref={ref} className={cn("", className)} {...props} />;
});
SelectOption.displayName = "SelectOption";

export { Select, SelectGroup, SelectOption }; 