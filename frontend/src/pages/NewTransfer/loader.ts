import ApiClient from "../../lib/api";

export async function loader() {
    // On a besoin de la liste des utilisateurs pour remplir le <select>
    const users = await ApiClient.getUsers();
    return { users };
}