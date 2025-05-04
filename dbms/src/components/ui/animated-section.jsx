import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0, 
  ...props 
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className={cn("", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.4, delay }}
      className={cn("", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedHeader({
  children,
  className,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn("", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItems({ children, staggerAmount = 0.1 }) {
  return (
    <>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.3, delay: i * staggerAmount }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
} 