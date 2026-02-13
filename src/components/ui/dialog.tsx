"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DialogContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>({
    open: false,
    onOpenChange: () => { },
});

export const Dialog = ({
    children,
    open,
    onOpenChange,
}: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) => {
    const [internalOpen, setInternalOpen] = React.useState(false);

    // Controlled or uncontrolled
    const isControlled = open !== undefined;
    const finalOpen = isControlled ? open : internalOpen;
    const finalSetOpen = isControlled ? onOpenChange : setInternalOpen;

    return (
        <DialogContext.Provider value={{ open: finalOpen || false, onOpenChange: finalSetOpen || (() => { }) }}>
            {children}
        </DialogContext.Provider>
    );
};

export const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
    const { onOpenChange } = React.useContext(DialogContext);

    // Simple implementation of asChild logic: clone the child and add onClick
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (e: React.MouseEvent) => {
                // Call original onClick if it exists
                children.props.onClick?.(e);
                onOpenChange(true);
            }
        });
    }

    return (
        <button onClick={() => onOpenChange(true)}>
            {children}
        </button>
    );
};

export const DialogContent = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    const { open, onOpenChange } = React.useContext(DialogContext);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                className={cn(
                    "relative w-full max-w-lg rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-lg sm:rounded-xl",
                    className
                )}
            >
                <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <button onClick={() => onOpenChange(false)} className="text-neutral-400 hover:text-white">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
);

export const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
);

export const DialogTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight text-white",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = "DialogTitle"

export const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-neutral-400", className)}
        {...props}
    />
))
DialogDescription.displayName = "DialogDescription"
