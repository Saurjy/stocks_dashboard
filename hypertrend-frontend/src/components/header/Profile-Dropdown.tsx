import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User } from "lucide-react"

export function ProfileDropdown() {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatar.png" alt="User" />
                        <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-48"
            >
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">

                        <p className="text-sm font-medium">Saurjya</p>
                        <p className="text-xs text-muted-foreground">
                            saurjya@email.com
                        </p>
                    </div>


                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link to="/profile">Profile</Link>

                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <Link to="/settings">Settings</Link>

                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <Link to="/logout">LogOut</Link>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
