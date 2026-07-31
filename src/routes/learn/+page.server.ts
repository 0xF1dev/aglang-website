import { redirect } from '@sveltejs/kit'

export async function load({ cookies }) {
    const savedLesson = cookies.get("savedLesson") || 1

    redirect(302, `/learn/${savedLesson}`)
}