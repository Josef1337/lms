<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Compass } from 'lucide-vue-next'
</script>

<template>
	<div class="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
		<span
			class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100"
			aria-hidden="true"
		>
			<Compass :size="28" />
		</span>
		<h1 class="mt-5 text-2xl font-bold">Bu sayfayı bulamadık</h1>
		<p class="mt-2 text-ink-600">
			Bağlantı eskimiş veya yanlış yazılmış olabilir. İlerlemeniz güvende; panele dönerek kaldığınız
			yerden devam edebilirsiniz.
		</p>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<RouterLink :to="{ name: 'dashboard' }" class="btn btn-primary">Genel Bakış’a dön</RouterLink>
			<RouterLink :to="{ name: 'welcome' }" class="btn btn-secondary">Ana sayfa</RouterLink>
		</div>
	</div>
</template>
