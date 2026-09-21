import HomeWorld from './HomeWorld';
import GoogleReviews from '@/components/sections/GoogleReviews';

export default function HomePage() {
  return <HomeWorld reviews={<GoogleReviews />} />;
}
