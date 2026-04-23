import { servicesCatalog } from "../content/servicesCatalog";
import ServiceDetailTemplate from "../templates/ServiceDetailTemplate";

const service = servicesCatalog.find((item) => item.slug === "aircraft-security");

export default function AircraftSecurityPage() {
  return <ServiceDetailTemplate service={service} />;
}
