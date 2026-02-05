<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <UDashboardPanel id="error">
        <UError :error="error" />
      </UDashboardPanel>
    </NuxtLayout>
  </UApp>
</template>
