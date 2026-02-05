<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <UTooltip text="Cloud Storage Provider Comparison" placement="right">
  <UButton icon="i-lucide-cloudy" color="neutral" variant="ghost" block :square="collapsed"
    class="data-[state=open]:bg-elevated" :class="[!collapsed && 'py-2']" :ui="{
      trailingIcon: 'text-dimmed'
    }" />
    </UTooltip>
</template>
