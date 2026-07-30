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
        height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
