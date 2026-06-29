<script setup>
defineProps({
  compact: {
    type: Boolean,
    default: true,
  },
  statistics: {
    type: Object,
    default: () => ({
      total_visitors: 0,
      today_visitors: 0,
      week_visitors: 0,
      month_visitors: 0,
      online_visitors: 0,
      page_views: 0,
    }),
  },
});
</script>

<template>
  <section class="border-t border-white/10 bg-gray-950/95" :class="compact ? 'py-4' : 'relative overflow-hidden py-16'">
    <div v-if="!compact" class="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"></div>
    <div v-if="!compact" class="absolute inset-0 opacity-20"
      style="background-image: radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(220,38,38,0.18), transparent 30%);">
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
      <div class="mb-3 flex items-center justify-between gap-3" :class="compact ? '' : 'mb-8 max-w-3xl'">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-red-300">Visitor Stats</p>
          <p v-if="!compact" class="mt-3 text-sm leading-6 text-slate-300">
            Hizi takwimu zinaonyesha utembeleaji wa tovuti na page views. Google Analytics inaendelea kufanya tracking nyuma ya pazia.
          </p>
        </div>
      </div>

      <div
        class="grid gap-2"
        :class="compact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6 sm:gap-4'"
      >
        <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur">
          <p class="text-[10px] uppercase tracking-wide text-slate-400">Total</p>
          <p class="mt-1 text-lg font-bold text-white sm:text-xl">{{ statistics.total_visitors.toLocaleString() }}</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur">
          <p class="text-[10px] uppercase tracking-wide text-slate-400">Today</p>
          <p class="mt-1 text-lg font-bold text-white sm:text-xl">{{ statistics.today_visitors.toLocaleString() }}</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur">
          <p class="text-[10px] uppercase tracking-wide text-slate-400">Week</p>
          <p class="mt-1 text-lg font-bold text-white sm:text-xl">{{ statistics.week_visitors.toLocaleString() }}</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur">
          <p class="text-[10px] uppercase tracking-wide text-slate-400">Month</p>
          <p class="mt-1 text-lg font-bold text-white sm:text-xl">{{ statistics.month_visitors.toLocaleString() }}</p>
        </div>
        <div class="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 backdrop-blur">
          <p class="text-[10px] uppercase tracking-wide text-emerald-200">Online</p>
          <p class="mt-1 text-lg font-bold text-white sm:text-xl">{{ statistics.online_visitors.toLocaleString() }}</p>
        </div>
        <div class="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2.5 backdrop-blur">
          <p class="text-[10px] uppercase tracking-wide text-red-200">Views</p>
          <p class="mt-1 text-lg font-bold text-white sm:text-xl">{{ statistics.page_views.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
