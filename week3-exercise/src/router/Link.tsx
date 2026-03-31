import { type MouseEvent } from "react";
import type { LinkProps } from "./types.ts";
import { getCurrentPath, navigateTo } from "./utils.ts";

export const Link = ({to, children} : LinkProps) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (getCurrentPath() !==to){
            navigateTo(to);
        }
    }

    return (
        <a href={to} onClick={handleClick}>
            {children}
        </a>
    );
    
}