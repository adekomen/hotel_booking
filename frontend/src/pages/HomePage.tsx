import GlobalSearch from "../components/global-search-box/GlobalSearch";
import HotelCard from "../components/hotel-card/HotelCard";
import NearbyHotels from "../components/nearby-hotels/NearbyHotels";

function HomePage() {
  return (
    <>
      <GlobalSearch />
      <HotelCard />
      <NearbyHotels />
    </>
  );
}

export default HomePage;
