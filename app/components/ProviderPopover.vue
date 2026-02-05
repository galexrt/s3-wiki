<script lang="ts" setup>
defineProps<{
  providerName: string;
  providerUrl: string;
  protocols: string[];
}>();
</script>

<template>
  <UPopover>
    <slot />

    <template #content>
      <div class="p-2">
        {{ providerName }}

          <NuxtLink :to="providerUrl" target="_blank" rel="noopener noreferrer">
            <UButton size="sm" variant="outline" class="w-full">
              Visit Provider
            </UButton>
          </NuxtLink>
      </div>
    </template>
  </UPopover>
</template>
