import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

const fallbackSponsors = [
  { name: 'SPONSORS-CROWN-MEDIA', logo: '/images/sponsors/SPONSORS-CROWN-MEDIA.png' },
  { name: 'GANZI', logo: '/images/sponsors/GANZI.png' },
  { name: 'jeziOriginal', logo: '/images/sponsors/jeziOriginal.png' },
  { name: 'MAGARI', logo: '/images/sponsors/MAGARI.png' },
  { name: 'SPONSORS-BAR', logo: '/images/sponsors/SPONSORS-BAR.png' },
  { name: 'SPONSORS1', logo: '/images/sponsors/SPONSORS1.png' },
  { name: 'simuhadhiYako', logo: '/images/sponsors/simuhadhiYako.png' },
  { name: 'RAMA', logo: '/images/sponsors/RAMA.png' },
  { name: 'SPONSORS-DOLLY', logo: '/images/sponsors/SPONSORS-DOLLY.png' },
  { name: 'SPONSORS GAZEM', logo: '/images/sponsors/SPONSORS-GAZEM.png' },
  { name: 'SPONSORS-jay', logo: '/images/sponsors/SPONSORS-jay.png' },
  { name: 'SPONSORSkim', logo: '/images/sponsors/SPONSORSkim.png' },
  { name: 'SPONSORS-STOCK', logo: '/images/sponsors/SPONSORS-STOCK.png' },
  { name: 'MAKUNDUCHI', logo: '/images/sponsors/MAKUNDUCHI.png' },
  { name: 'MQ', logo: '/images/sponsors/MQ.png' },
  { name: 'NIVES TRENDS', logo: '/images/sponsors/NIVES_TRENDS.png' },
  { name: 'PRO SHARE', logo: '/images/sponsors/PRO-SHARE.png' },
  { name: 'mama viwanja', logo: '/images/sponsors/mama-viwanja.png' },
];

export function useSponsors() {
  const page = usePage();

  const sponsors = computed(() => {
    const shared = page.props.sponsors;
    return Array.isArray(shared) && shared.length > 0 ? shared : fallbackSponsors;
  });

  return {
    sponsors,
  };
}
