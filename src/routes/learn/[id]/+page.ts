import { error } from "@sveltejs/kit"

export async function load({ params }) {
    try {
        const lessonText = await import(`$lib/content/part-${params.id}.md`)
        const lessonContent = await import(`$lib/content/content-${params.id}.json`)

        return {
            id: params.id,
            next: parseInt(params.id) + 1,
            body: lessonText.default,
            content: lessonContent.default
        }
    } catch (e) {
        error(404, "the requested lesson doesn't exist")
    }
}