<script>
    import { page } from "$app/state";
</script>

<div id="wrapper">
    <h1>error {page.status}</h1>
    <span>{page.error?.message}</span>
</div>

<style>
    #wrapper {
        width: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    span {
        margin-bottom: 4rem;
    }
</style>
