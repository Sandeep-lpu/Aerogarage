import { servicesCatalog } from "../content/servicesCatalog";
import ServiceDetailTemplate from "../templates/ServiceDetailTemplate";

const service = servicesCatalog.find((item) => item.slug === "aircraft-cleaning");

export default function AircraftCleaningPage() {
  return <ServiceDetailTemplate service={service} />;
}
