import type { User } from "../types/type";

interface UserItemProps {
    user: User;
}

const UserItem = ({ user }: UserItemProps) => {
    return (
        <div>
            <p>{user.name}</p>
        </div>
    );
}

export default UserItem;