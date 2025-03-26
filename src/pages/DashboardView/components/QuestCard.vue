<template>
    <Panel class="w-100 mb-2">
        <template #header>
            <div class="d-flex">
                <h4>
                    {{ quest.title }}
                </h4>
            </div>
        </template>
        <p class="m-0">
            {{ quest.bodyText }}
        </p>
        <template #footer>
            <div class="d-flex justify-content-end">
                <Button text>
                    Edit
                </Button>
                <Button severity="danger" text>
                    Delete
                </Button>
            </div>
        </template>
    </Panel>
</template>
<script>
export default {
    name: 'QuestCard',
    props: {
        quest: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>