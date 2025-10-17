import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutAction, selectCurrentUser } from "@/store/auth";
import { LogOut, User as UserIcon } from "lucide-react";
import { Dropdown, DropdownMenuItem } from "@/components/shared/Dropdown";
import { Avatar } from "@/components/shared/Avatar";
import { Link } from "react-router-dom";

export function UserNav() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);

    const handleLogout = () => {
        dispatch(logoutAction());
    };

    const getAvatarFallback = (name?: string | null) => {
        if (!name) return "AD";
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    const UserAvatarButton = (
        <button className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Avatar fallback={getAvatarFallback(user?.fullName)} className="h-10 w-10" />
        </button>
    );

    return (
        <Dropdown button={UserAvatarButton}>
            <div className="px-1 py-1">
                <div className="px-2 py-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>
            <div className="px-1 py-1">
                <Link to="/profile">
                    <DropdownMenuItem>
                        <UserIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                        Profile
                    </DropdownMenuItem>
                </Link>
            </div>
            <div className="px-1 py-1">
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                    Log out
                </DropdownMenuItem>
            </div>
        </Dropdown>
    );
}