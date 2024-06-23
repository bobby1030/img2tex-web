<script>
    export let message, clickHandler;
</script>

<div class="alert alert-error">
    <span class="material-symbols-rounded">error</span>
    <span>{message}</span>
    <div>
        <button class="btn" on:click={clickHandler}>
            <span class="material-symbols-rounded">refresh</span>
            <span>Retry</span>
        </button>
    </div>
</div>
