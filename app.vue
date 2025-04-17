<template>
	<div class="min-h-screen bg-gray-100 py-10 px-5">
		<div class="container mx-auto max-w-3xl">
			<h1 class="text-3xl font-bold text-center mb-6 text-gray-800">
				Welcome to Nuxt Application
			</h1>

			<div class="bg-white p-6 rounded-lg shadow-md mb-6">
				<p class="mb-4 text-gray-600">
					This is a Nuxt 3 application with UnoCSS, Vitest, and Playwright.
				</p>

				<div class="space-y-3">
					<Button @click="count++"> Clicked {{ count }} times </Button>

					<Button block class="mt-4" @click="count = 0"> Reset counter </Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
