import { servicesCatalog } from "../content/servicesCatalog";
import ServiceDetailTemplate from "../templates/ServiceDetailTemplate";

const service = servicesCatalog.find((item) => item.slug === "line-maintenance");

export default function LineMaintenancePage() {
  return <ServiceDetailTemplate service={service} />;
}
