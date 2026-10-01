import HeroStory from "./HeroStory";
import BuiltDifferently from "./BuiltDifferently";
import { MenuTeaser, Sourcing, FindUs } from "./Sections";

export default function BurgerMeHome() {
  return (
    <main>
      <HeroStory />
      <BuiltDifferently />
      <MenuTeaser />
      <Sourcing />
      <FindUs />
    </main>
  );
}
