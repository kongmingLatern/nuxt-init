<template>
	<button
		:class="[
			'px-4 py-2 rounded-lg transition-colors',
			sizeClasses,
			variantClasses,
			block ? 'w-full' : '',
			className
		]"
		:type="type"
		@click="$emit('click')"
	>
		<slot>Button</slot>
	</button>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(defineProps<{
	block?: boolean
	variant?: ButtonVariant
	size?: ButtonSize
	type?: ButtonType
	className?: string
}>(), {
	block: false,
	variant: 'primary',
	size: 'md',
	type: 'button',
	className: ''
})

const variantClasses = computed(() => {
	switch (props.variant) {
		case 'primary':
			return 'bg-blue-500 text-white hover:bg-blue-600'
		case 'secondary':
			return 'bg-gray-200 text-gray-800 hover:bg-gray-300'
		case 'success':
			return 'bg-green-500 text-white hover:bg-green-600'
		case 'danger':
			return 'bg-red-500 text-white hover:bg-red-600'
		case 'warning':
			return 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
		case 'info':
			return 'bg-cyan-500 text-white hover:bg-cyan-600'
		default:
			return 'bg-blue-500 text-white hover:bg-blue-600'
	}
})

const sizeClasses = computed(() => {
	switch (props.size) {
		case 'sm':
			return 'text-sm py-1 px-3'
		case 'md':
			return 'text-base py-2 px-4'
		case 'lg':
			return 'text-lg py-3 px-6'
		default:
			return 'text-base py-2 px-4'
	}
})

defineEmits<{
	click: []
}>()
</script>
