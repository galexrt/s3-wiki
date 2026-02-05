<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import SiderbarHeader from '~/components/SiderbarHeader.vue';

const open = ref(false);

const links = [
    [
        {
            label: 'Home',
            icon: 'i-lucide-house',
            to: '/',
            onSelect: () => {
                open.value = false;
            },
        },
    ],
    [
        {
            label: 'Feedback',
            icon: 'i-lucide-message-circle',
            to: 'https://github.com/galexrt/s3-wiki/discussions/new/choose',
            target: '_blank',
        },
        {
            label: 'Help',
            icon: 'i-lucide-info',
            to: 'https://github.com/galexrt/s3-wiki/discussions',
            target: '_blank',
        },
    ],
] satisfies NavigationMenuItem[][];
</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar id="default" class="bg-elevated/25" collapsed :ui="{ footer: 'lg:border-t lg:border-default' }">
            <template #header="{ collapsed }">
                <SiderbarHeader :collapsed="collapsed" />
            </template>

            <template #default="{ collapsed }">
                <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />

                <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip class="mt-auto" />
            </template>
        </UDashboardSidebar>

        <slot />
    </UDashboardGroup>
</template>
