import { servicesCatalog } from "../content/servicesCatalog";
import ServiceDetailTemplate from "../templates/ServiceDetailTemplate";

const service = servicesCatalog.find((item) => item.slug === "surface-transportation");

export default function SurfaceTransportationPage() {
  return <ServiceDetailTemplate service={service} />;
}
