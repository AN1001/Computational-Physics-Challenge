import Globe from "./Globe";

interface Props {
  lat: number;
  long: number;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function latLonToXYAngles(latitude: number) {
  const angleX = Math.PI / 2 - toRad(latitude);

  return angleX;
}

function GlobeHolder({ lat, long }: Props) {
  return (
    <>
      <Globe
        key={`10f`}
        long={latLonToXYAngles(lat)}
        lat={latLonToXYAngles(lat)}
        angle={latLonToXYAngles(lat)}
      ></Globe>
    </>
  );
}

export default GlobeHolder;
