<script setup lang="ts">
import { NuxtLink, UButton } from '#components'
import type { TableColumn } from '@nuxt/ui';
import { z } from 'zod'
import PriceChartDrawer from '~/components/PriceChartDrawer.vue';
import ProviderPopover from '~/components/ProviderPopover.vue';
import { storageProtocols, type ProviderPlan } from '~/types/types';

const overlay = useOverlay();

const { data: page } = await useAsyncData('storageProviders', () => queryCollection('storageProviders').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const schema = z.object({
  storage: z
    .coerce.number().nonnegative(),
  traffic: z.object({
    ingress: z.coerce.number().nonnegative(),
    egress: z.coerce.number().nonnegative(),
  }),
  protocols: z.enum(storageProtocols).array(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  storage: 1000,
  traffic: {
    ingress: 0,
    egress: 300,
  },
  protocols: [],
});

// Flattens providers and their plans into a list of ProviderPlan with provider info
const providerPlans = computed(() =>
  page.value?.providers.filter((provider) => {
    if (state.protocols && state.protocols.length > 0) {
      const hasProtocol = state.protocols.some((protocol) => provider.protocols.includes(protocol.toLowerCase()));
      if (!hasProtocol) {
        return false;
      }
    }

    return true;
  }).
    flatMap((provider) =>
      (provider.plans || []).map((plan) => ({
        ...plan,
        providerName: provider.name,
        providerUrl: provider.url,
        protocols: provider.protocols
      }))
    )
);

const columns: TableColumn<ProviderPlan>[] = [
  {
    accessorKey: 'providerName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Provider',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => h(ProviderPopover, { providerName: row.original.providerName, providerUrl: row.original.providerUrl, protocols: row.original.protocols }, h(UButton, row.original.providerName)),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Plan Name',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.name),
  },
  {
    accessorKey: 'baseCost',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Base Cost',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      const baseCost = row.original.baseCost;
      if (Array.isArray(baseCost)) {
        return baseCost.map(cost => `${cost.value} ${cost.currency || ''}${cost.interval ? '/yr' : ''}`).join(', ');
      }
      return `${baseCost.value} ${baseCost.currency || ''}${baseCost.interval ? '/yr' : ''}`;
    },
  },
  {
    accessorKey: 'storage.included',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Included Storage (GB)',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      const storage = row.original.storage?.included;
      return storage !== undefined ? (storage / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-';
    },
  },
  {
    accessorKey: 'storage.more',
    header: 'Extra Storage Price',
    cell: ({ row }) => {
      const more = row.original.storage?.more;
      if (!more) return '-';
      const { cost, per } = more;
      return `${cost.value} ${cost.currency || ''} per ${(per / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB`;
    }
  },
  {
    accessorKey: 'trafficAll.included',
    header: 'Included Traffic',
    cell: ({ row }) => {
      const traffic = row.original.trafficAll?.included;
      if (traffic === undefined) return '-';
      return traffic === -1 ? 'Unlimited' : (traffic / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' GB';
    }
  },
  {
    accessorKey: 'trafficEgress.included',
    header: 'Egress Traffic',
    cell: ({ row }) => {
      const traffic = row.original.trafficEgress?.included;
      if (traffic === undefined) return '-';
      return traffic === -1 ? 'Unlimited' : (traffic / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' GB';
    }
  },
  {
    accessorKey: 'trafficEgress.more',
    header: 'Extra Egress Price',
    cell: ({ row }) => {
      const more = row.original.trafficEgress?.more;
      if (!more) return '-';
      const { cost, per } = more;
      return `${cost.value} ${cost.currency || ''} per ${(per / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB`;
    }
  },
  {
    accessorKey: 'trafficIngress.included',
    header: 'Ingress Traffic',
    cell: ({ row }) => {
      const traffic = row.original.trafficIngress?.included;
      if (traffic === undefined) return '-';
      return traffic === -1 ? 'Unlimited' : (traffic / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' GB';
    }
  }
];

const sorting = ref([
  {
    id: 'providerName',
    desc: false
  }
])

const priceChartDrawer = overlay.create(PriceChartDrawer);
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'gap-0 sm:gap-0 p-0 sm:p-0' }">
    <template #header>
      <UDashboardNavbar title="Compare Storage Providers (Work In Progress)">
        <template #right>
          <NuxtLink to="https://github.com/redsolver/s3-wiki" external class="text-sm  hover:underline">
            (Fork of https://github.com/redsolver/s3-wiki)
          </NuxtLink>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #default>
          <UForm ref="formRef" :schema="schema" :state="state" class="flex w-full flex-col gap-2 items-center py-1">
            <div class="flex flex-row flex-wrap gap-4 items-center flex-1 w-full">
              <UFormField label="Storage (GB)" name="storage" class="flex-1">
                <UInputNumber v-model="state.storage" :min="0" :step="100" class="w-full" />
              </UFormField>

              <UFormField label="Ingress (GB)" name="traffic.ingress" class="flex-1">
                <UInputNumber v-model="state.traffic.ingress" :min="0" :step="100" class="w-full" />
              </UFormField>

              <UFormField label="Egress (GB)" name="traffic.egress" class="flex-1">
                <UInputNumber v-model="state.traffic.egress" :min="0" :step="100" class="w-full" />
              </UFormField>
            </div>

            <div class="flex flex-row flex-wrap gap-4 items-center w-full">
              <UFormField label="Protocol(s)" name="protocols" class="flex-1">
                <USelectMenu v-model="state.protocols" multiple label-key="label" value-key="value"
                  :items="storageProtocols.map((protocol) => ({ label: protocol as string, value: protocol }))"
                  class="w-full" />
              </UFormField>
            </div>
          </UForm>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UTable v-model:sorting="sorting" :columns="columns" :data="providerPlans" sticky class="flex-1" />
    </template>

    <template #footer>
      <div class="p-1">
        <UButton color="neutral" variant="subtle" block @click="priceChartDrawer.open()">
          Imagine here's a button that opens a price comparison diagram in a modal.
        </UButton>
      </div>
    </template>
  </UDashboardPanel>
</template>
