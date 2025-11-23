import ApiClient from "../../lib/api";
import type { LoaderFunctionArgs } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
    const id = Number(params.id);
    const expense = await ApiClient.getExpenseById(id);
    return { expense };
}