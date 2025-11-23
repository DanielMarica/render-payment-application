import ApiClient from "../../lib/api";

export async function loader() {
    const users = await ApiClient.getUsers();
    return { users };
}