<template>
	<button
		class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
		:class="[block ? 'w-full' : '']"
		@click="$emit('click')"
	>
		<slot>Button</slot>
	</button>
</template>

<script setup lang="ts">
defineProps<{
	block?: boolean
}>()

defineEmits<{
	click: []
}>()
</script>
